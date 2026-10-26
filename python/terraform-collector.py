import re
import os
import requests
import subprocess

# Constants
DEFAULT_NAMESPACE = "hashicorp"

# Where each provider publishes its resource documentation on GitHub, and which
# branches to try. HashiCorp providers keep the legacy `website/docs/r` layout,
# the others moved to `docs/resources`.
HASHICORP_DOCS_PATH = "website/docs/r/{resource}.html.markdown"
REGISTRY_DOCS_PATH = "docs/resources/{resource}.md"
BRANCHES = ["main", "master"]

HEADERS = {
    'User-Agent': 'Mozilla/5.0'
}

def substitute_values(content, slug, substitutions):
    """
    Substitute attributes with specified values.
    """
    for attribute, value in substitutions.items():
        if attribute == "tags":
            pattern = re.compile(rf'^(\s*){attribute}\s*=\s*{{.*?}}', re.DOTALL | re.MULTILINE)
            replacement = rf'\1{attribute} = {value}'
        else:
            pattern = re.compile(rf'^(\s*){attribute}\s*=\s*".*?"', re.MULTILINE)
            replacement = rf'\1{attribute} = {value}'
        content = pattern.sub(replacement, content)
    return content

HEREDOC_PATTERN = re.compile(r'<<-?\s*([A-Za-z_]\w*)\s*$')

def find_block_end(lines, start):
    """
    Index of the `}` in column 0 closing the block opened on `lines[start]`.
    Heredoc bodies are skipped, so a JSON document closing with `}` inside
    `<<EOF ... EOF` does not end the block early.
    """
    heredoc_marker = None
    for i in range(start + 1, len(lines)):
        line = lines[i]
        if heredoc_marker:
            if line.strip() == heredoc_marker:
                heredoc_marker = None
            continue
        heredoc = HEREDOC_PATTERN.search(line)
        if heredoc:
            heredoc_marker = heredoc.group(1)
        elif line.rstrip() == '}':
            return i
    return len(lines) - 1

def extract_blocks(content, header_pattern):
    """
    Return the top-level blocks whose first line matches `header_pattern`.
    """
    header = re.compile(header_pattern)
    lines = content.split('\n')
    blocks = []
    i = 0
    while i < len(lines):
        if header.match(lines[i]):
            end = find_block_end(lines, i)
            blocks.append('\n'.join(lines[i:end + 1]))
            i = end
        i += 1
    return blocks

def extract_resources_and_data(content, resource_type):
    """
    Extract the block for a specific resource type from the Terraform content and
    retain blocks containing "data" or "locals" references.
    """
    locals_pattern = r'^locals\s*{'
    data_pattern = r'^data\s+".*?"\s+".*?"\s*{'
    resource_pattern = rf'^resource\s+"{resource_type}"\s+".*?"\s*{{'

    resource_blocks = extract_blocks(content, resource_pattern)
    # Dicts dedupe while keeping the documentation order: a set followed the
    # per-run string hash, so every run reshuffled the blocks of the snippets.
    data_blocks = {}
    locals_blocks = {}

    for resource_block in resource_blocks:
        if 'data.' in resource_block:
            data_blocks.update(dict.fromkeys(extract_blocks(content, data_pattern)))
        if 'local.' in resource_block:
            locals_blocks.update(dict.fromkeys(extract_blocks(content, locals_pattern)))

    combined_blocks = list(data_blocks) + list(locals_blocks) + resource_blocks
    return '\n\n'.join(combined_blocks)

def extract_resource_from_terraform_url(url):
    """
    Extracts the Terraform service name from the Terraform documentation URL.
    """
    match = re.search(r"/resources/(.*)", url)
    if match:
        return match.group(1)
    return None

def get_github_raw_urls(cloud, resource):
    """
    Formulates the candidate raw GitHub URLs for the Markdown documentation.
    Providers do not agree on the layout nor on the default branch, so every
    combination is tried until one answers.
    """
    namespace = cloud.get("namespace", DEFAULT_NAMESPACE)
    provider = cloud["provider"]
    docs_path = cloud.get(
        "docs_path",
        HASHICORP_DOCS_PATH if namespace == DEFAULT_NAMESPACE else REGISTRY_DOCS_PATH,
    )
    path = docs_path.format(resource=resource)
    return [
        f"https://raw.githubusercontent.com/{namespace}/terraform-provider-{provider}/{branch}/{path}"
        for branch in BRANCHES
    ]

def fetch_markdown_content(url):
    """
    Fetches the raw Markdown content from the GitHub raw URL.
    """
    try:
        print(f"Fetching {url}...")
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            return response.text
        else:
            print(f"Failed to fetch {url}: HTTP {response.status_code}")
    except requests.RequestException as e:
        print(f"Error fetching URL {url}: {e}")
    return None

def extract_terraform_code_blocks(markdown_content):
    """
    Extracts Terraform code blocks from the Markdown content.
    """
    # Providers fence their examples with ```hcl or ```terraform.
    code_blocks = re.findall(r'```(?:hcl|terraform)(.*?)```', markdown_content, re.DOTALL)
    return code_blocks

def supports_tags(markdown_content):
    """
    Checks if 'tags' are mentioned in the attributes section of the Markdown content.
    """
    return "tags -" in markdown_content

def append_tags_if_supported(markdown_content, terraform_code):
    """
    Appends 'tags = var.tags' to the Terraform code if tags are supported but not present.
    """
    if supports_tags(markdown_content) and 'tags =' not in terraform_code:
        terraform_code = re.sub(r'}\s*$', '\n  tags = var.tags\n}', terraform_code, flags=re.MULTILINE)
    return terraform_code

def format_terraform_code(code: str, indentation='  '):
    """
    Indent Terraform code so that it is formatted correctly.
    """
    lines = code.split('\n')
    indent_level = 0
    formatted_lines = []
    heredoc_marker = None

    for line in lines:
        # Heredoc bodies are kept verbatim: re-indenting them would move the
        # closing marker off column 0 and leave the string unterminated.
        if heredoc_marker:
            formatted_lines.append(line)
            if line.strip() == heredoc_marker:
                heredoc_marker = None
            continue

        stripped_line = line.strip()
        heredoc = HEREDOC_PATTERN.search(stripped_line)
        if heredoc:
            heredoc_marker = heredoc.group(1)
        if stripped_line.startswith('}'):
            indent_level -= 1
        formatted_line = (indentation * indent_level) + stripped_line
        formatted_lines.append(formatted_line)
        if stripped_line.endswith('{'):
            indent_level += 1

    return '\n'.join(formatted_lines)

cloud_platforms = [
    {
        'name': 'azure',
        'provider': 'azurerm',
        'namespace': 'hashicorp',
    },
    {
        'name': 'aws',
        'provider': 'aws',
        'namespace': 'hashicorp',
    },
    {
        'name': 'google',
        'provider': 'google',
        'namespace': 'hashicorp',
    },
    {
        'name': 'ovh',
        'provider': 'ovh',
        'namespace': 'ovh',
        'docs_path': 'docs/resources/{resource}.md',
    },
    {
        'name': 'scaleway',
        'provider': 'scaleway',
        'namespace': 'scaleway',
        'docs_path': 'docs/resources/{resource}.md',
    },
]

for cloud in cloud_platforms:
    cloud_name = cloud['name']
    cloud_provider = cloud['provider']

    with open(f'../src/app/data/{cloud_name}.ts', 'r') as f:
        tsx_content = f.read()

    pattern = re.compile(r'id:\s*\'(.*?)\',.*?slug:\s*\'(.*?)\',.*?terraformUrl:\s*\'(.*?)\'', re.DOTALL)
    matches = pattern.findall(tsx_content)

    output_directory = f"../public/{cloud_name}/code/terraform"
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    for id, slug, url in matches:
        resource = extract_resource_from_terraform_url(url)
        if resource:
            markdown_content = None
            github_raw_url = None
            for candidate in get_github_raw_urls(cloud, resource):
                markdown_content = fetch_markdown_content(candidate)
                if markdown_content:
                    github_raw_url = candidate
                    break

            if markdown_content:
                code_blocks = extract_terraform_code_blocks(markdown_content)

                if code_blocks:
                    content = code_blocks[0]

                    # Append tags if supported
                    content = append_tags_if_supported(markdown_content, content)

                    # The raw Markdown is already plain HCL: decoding escape
                    # sequences here turned "\\d" into an invalid "\d" and
                    # unquoted the \" of embedded JSON, breaking the snippet.

                    substitutions = {
                        "name": f'"{slug}${{local.naming_suffix}}"',
                        "location": "var.location",
                        "tags": "var.tags",
                    }

                    # Substitute name and location values
                    content = substitute_values(content, slug, substitutions)

                    # Extract specific resource block
                    content = extract_resources_and_data(content, f"{cloud_provider}_{resource}")

                    if not content:
                        print(f"Specific resource block not found for {id}!")
                        continue

                    # Replace all instances of "example" and .example
                    content = content.replace('"example"', '"main"').replace('.example', '.main')

                    # Format the Terraform code
                    content = format_terraform_code(content)

                    if not content:
                        print(f"No content for {id}, skipping...")
                        continue

                    file_name = id.replace(' ', '-').lower() + '.tf'
                    full_path = os.path.join(output_directory, file_name)

                    # Check if file already exists and contents are the same
                    if os.path.exists(full_path):
                        with open(full_path, 'r') as f:
                            existing_content = f.read()
                        if existing_content == content:
                            print(f"No changes for {id}, skipping...")
                            continue

                    print(f"Saving to {full_path}")
                    with open(full_path, 'w') as f:
                        f.write(content)
                else:
                    print(f"No code blocks found in {github_raw_url}")
            else:
                print(f"Failed to fetch or parse content for {id}")

    print(f"Files saved successfully for cloud: {cloud_name}!")

    # Run terraform fmt on all written files
    try:
        print("Running terraform fmt...")
        subprocess.run(["terraform", "fmt", "."], cwd=output_directory, check=True)
        print("Terraform fmt completed successfully!")
    except FileNotFoundError:
        print("terraform is not installed, skipping terraform fmt!")
    except subprocess.CalledProcessError:
        print("Error running terraform fmt!")
