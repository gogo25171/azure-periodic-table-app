import React, { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bicep from 'react-syntax-highlighter/dist/esm/languages/prism/bicep';
import hcl from 'react-syntax-highlighter/dist/esm/languages/prism/hcl';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Check, CopyIcon } from 'lucide-react';

// The light build only bundles the languages registered here (the full Prism
// build ships every grammar): add one when a new snippet language is used.
SyntaxHighlighter.registerLanguage('bicep', bicep);
SyntaxHighlighter.registerLanguage('hcl', hcl);
SyntaxHighlighter.registerLanguage('json', json);

export const CodeSnippet = ({
  codeString = `resource "aws_instance" "example" {
  ami = "abc123"

  network_interface {
    # ...
  }
}`,
  language = "hcl", // Default to HCL, but can be overridden
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  if (!codeString) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <SyntaxHighlighter
        language={language} // Use the language prop here
        style={oneDark}
        customStyle={{ fontSize: 14 }}
      >
        {codeString}
      </SyntaxHighlighter>
      {isHovering && (
        <div className="absolute top-4 right-4">
          <CopyToClipboard text={codeString} onCopy={handleCopy}>
            <button className="absolute justify-center right-1 rounded-md border border-transparent">
              {isCopied ? (
                <Check width={16} />
              ) : (
                <CopyIcon width={16} />
              )}
            </button>
          </CopyToClipboard>
        </div>
      )}
    </div>
  );
};

export default CodeSnippet;
