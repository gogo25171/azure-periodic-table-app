# TODO

## En cours / à faire

### 🔴 Priorité 1 : espace admin (fraîcheur des données) et versions des ressources

> **Consigne** : c'est le prochain chantier. Quand je demande « qu'est-ce qu'il faut faire ? », on fait ce bloc dans l'ordre, puis on commit (un commit par étape, `yarn verify` vert à chaque fois).

- [x] **1. `/admin` actif seulement si `ADMIN_PASSWORD` est défini, sinon 404 (en dev comme en prod).**
  > Aujourd'hui la page s'affiche toujours et l'API répond 503 sans mot de passe. Cible : sans `ADMIN_PASSWORD`, `/admin` **et** `/api/admin/*` répondent 404, comme si la route n'existait pas.
  > **Implémentation** : `src/app/admin/page.tsx` est un composant client → le renommer en `admin-dashboard.tsx` et créer un `page.tsx` serveur qui appelle `notFound()` quand `process.env.ADMIN_PASSWORD` est vide, sinon rend le dashboard. Dans `api/admin/audit/route.ts`, remplacer les 503 par des 404 (GET et POST). Éviter un `middleware.ts` : il tourne sur le runtime edge, où la lecture des variables serveur au runtime est moins fiable en auto-hébergé (Docker). Mettre à jour `.env.example`, `docs/features/admin.md`, `docs/getting-started/3-configuration.md` et `docs/reference/environment-variables.md`.

- [x] **2. Détecter les snippets orphelins (fichier sans ressource).**
  > Nouvelle règle `orphan-snippet` (warning) dans `src/lib/data-audit.ts` : tout fichier de `public/<provider>/code/{terraform,bicep,arm}/` dont le nom ne correspond à aucun `id` du dataset (ressource renommée ou supprimée). `data-audit.ts` reste pur : la liste des fichiers lui est injectée comme `iconExists` (nouvelle option `listSnippetFiles`), fournie par la route admin et par `scripts/validate-data.mjs`. Ajouter un test dans `tests/`.

- [ ] **3. Tracer la version du provider Terraform utilisée à chaque collecte.**
  > Aujourd'hui tous les `terraformUrl` pointent sur `/latest/` et le collecteur lit la branche `main` des docs GitHub : on ne sait pas sur quelle version reposent les snippets.
  > `python/terraform-collector.py` écrit un fichier `public/<provider>/code/sync.json` : namespace/nom du provider, **version** (dernier tag GitHub au moment de la collecte, ou mieux : collecter directement sur ce tag plutôt que sur `main`), date de collecte, SHA du commit des docs, et la liste des ressources ajoutées / modifiées / supprimées pendant ce run. Garder un **historique** (les N derniers runs) dans le même fichier, pour l'étape 5. Faire de même pour `arm-collector.py` et `bicep-collector.py` (version d'API Azure au lieu de version de provider).
  > Source de la dernière version publiée : `https://registry.terraform.io/v1/providers/<namespace>/<name>` → champ `version`.

- [ ] **4. Signaler un provider en retard sur sa dernière version.**
  > Règle `provider-version-outdated` : compare la version de `sync.json` à celle du registre Terraform. Écart de version mineure → `info`, écart de version majeure → `warning` (jamais `error` : la CI ne doit pas casser parce que HashiCorp publie une release). Comme ça demande un appel réseau : dans la route admin avec un cache (1 h), et dans la CLI derrière un flag `yarn validate:data --online` (la CI reste hors-ligne).

- [ ] **5. Dans `/admin` : voir si les données sont à jour et l'historique des mises à jour automatiques.**
  > Nouvelle section « Synchronisation » en tête du dashboard, par provider : version collectée vs dernière publiée (badge à jour / en retard), date de la dernière collecte (« il y a 3 jours »), nombre de snippets / ressources sans snippet / orphelins.
  > Section « Tâches planifiées » : chaque workflow cron (`run-code-collector.yml` le dimanche à 00:00 UTC, `dependency-check.yml` le lundi à 06:00 UTC) avec sa planification lisible, la **prochaine exécution**, et ses derniers runs : date, statut (succès / échec), PR ouverte et **ce qui a changé** (ressources ajoutées / modifiées / supprimées, lues dans l'historique de `sync.json`).
  > Les statuts et liens des runs viennent de l'API GitHub (`GET /repos/{owner}/{repo}/actions/workflows/{file}/runs`) avec un `GITHUB_TOKEN` côté serveur, optionnel : sans token, n'afficher que ce que contient `sync.json`. À documenter dans `.env.example`.

- [ ] **6. Fiche ressource : informer l'utilisateur sur les versions et la compatibilité.**
  > Nouvelle section « Compatibilité » dans la sidebar de `/resource/[id]`, alimentée par les métadonnées écrites par les collecteurs (un `public/<provider>/code/meta/<id>.json` ou un champ par ressource dans `sync.json`), lues côté serveur dans `resource/[id]/page.tsx` comme les snippets :
  > - **version du provider** sur laquelle repose le snippet (« basé sur azurerm 4.12.0 ») et date de mise à jour ;
  > - **version minimale** de Terraform et du provider pour utiliser la ressource (bloc `required_providers` / version d'apparition de la ressource, à extraire du CHANGELOG du provider) ;
  > - **ressource dépréciée** : badge bien visible et ressource de remplacement si la doc l'indique (les docs contiennent des mentions « deprecated » / « superseded by ») ;
  > - pour Bicep/ARM : la **version d'API** utilisée (`Microsoft.X/y@2024-01-01`) ;
  > - lien vers le CHANGELOG du provider.
  > Libellés dans les deux dictionnaires (`en` / `fr`). Ne rien afficher quand l'information manque (les providers sans snippets aujourd'hui).
  > **Patch notes complètes par version** : les CHANGELOG.md sont parsables (`BREAKING CHANGES` / `FEATURES` / `ENHANCEMENTS` / `BUG FIXES`), mais **mon avis** reste que c'est hors sujet ici. Ça mérite son propre projet (un « changelog explorer » multi-providers) ; ici on se limite à ce qui concerne la ressource affichée.

### Autres chantiers

- [ ] Ajouter une section prix qui viens du projet "terracost" (que je modifie) ou autres

- [ ] Corriger que quand on télécharge l'image, les icônes par défaut (quand il ne trouve pas l'icône inscrit dans le JSON de la ressource) ne s'affichent pas toujours.
  > **Note (partiellement traité)** : deux corrections ont été faites : (1) les cellules sans icône affichent désormais `default-icon.svg` au lieu de rien (`src/components/column.tsx`), (2) `download.tsx` attend que **toutes** les images soient chargées avant de lancer html2canvas. S'il reste des trous dans l'export, la cause suivante est `next/image` qui sert du WebP via l'`imgix` loader de `next.config.js` : html2canvas ne peut pas rasteriser une image cross-origin non taintée. Piste : inliner `default-icon.svg` en `data:` URI, ou passer les cellules en `<img>` simple pendant l'export.

- [ ] Voir si les catégories sont assez généralistes, s'il faut en rajouter ou en supprimer et autres ajustements par rapport aux autres providers + voir si je fais des catégories spécifiques par provider.
  > **Note / avis** : après avoir rempli AWS (60), GCP (36), OVH (20) et Scaleway (25), les 13 catégories tiennent la route sauf **deux trous nets** :
  > - **Sécurité & Identité** : IAM, KMS, Secrets Manager, WAF, ACM, Cognito, les policies Scaleway… sont aujourd'hui rangés dans `Management` (ou `Networking` pour WAF/ACM), ce qui rend la colonne Management fourre-tout. C'est l'ajout le plus rentable.
  > - **Supervision / Observabilité** : CloudWatch, Cloud Logging/Monitoring, Cockpit, les alertes OVH sont aussi dans `Management`.
  > À l'inverse `Virtual Desktop` est très Azure-centré (seulement WorkSpaces et Cloud Workstations ailleurs) et `Migration` ne concerne qu'Azure/AWS : je les garderais quand même, une catégorie peu peuplée ne coûte rien visuellement.
  > **Contre les catégories spécifiques par provider** : la taxonomie commune est justement ce qui permet de comparer deux clouds côte à côte, et la légende + les couleurs sont globales (`categoryData`). Si un provider a un service inclassable, un champ `tags?: string[]` sur `Item` serait préférable à une catégorie dédiée.
  > **Coût de l'ajout** : enum `Categories` + une couleur dans `categoryData` + les deux dictionnaires i18n + reclasser une trentaine de ressources. ~1h. Décision à prendre avant d'ajouter d'autres providers, pour ne pas reclasser deux fois.
  >
  > **À trancher : proposer deux modes de catégorisation dans l'interface ?**
  > - *Mode « unifié »* (actuel) : nos 13 catégories, identiques pour tous les providers → permet de comparer deux clouds côte à côte, une seule légende, une seule palette.
  > - *Mode « natif »* : les catégories du provider lui-même (celles du registre Terraform / de son site : « Compute », « Networking », « Machine Learning », « Developer Tools »…) → plus familier pour quelqu'un qui vient de la doc AWS ou GCP, mais la légende et les couleurs changent à chaque provider, et la comparaison inter-cloud disparaît.
  > Ce sont effectivement des taxonomies très proches (à ~80 %), les écarts portent surtout sur la sécurité/identité et l'observabilité — d'où l'intérêt de comparer les deux avant de figer nos catégories.
  > **Implémentation envisagée** : ajouter un champ optionnel `nativeCategory?: string` sur `Item` (rempli automatiquement, c'est la section indiquée par le registre Terraform), puis un sélecteur « Catégories : unifiées / natives » dans la barre d'outils qui change simplement la clé de regroupement et la légende. Ça évite de dupliquer les données et reste réversible. À faire **après** la décision sur Sécurité & Supervision, pas avant.

- [ ] Ajouter plus de logs dans l'application pour mieux comprendre ce qu'il se passe.
  > **Note / avis** : la base est posée (`src/lib/logger.ts`, niveau piloté par `NEXT_PUBLIC_LOG_LEVEL`, actif dans i18n, recherche, export et route admin). Ce qu'il reste à instrumenter, par ordre d'utilité : changement de provider, ouverture d'une fiche ressource (id + provider), échec de chargement d'icône (aujourd'hui silencieux via `onError`), lecture des snippets côté serveur dans `resource/[id]/page.tsx`, et l'API `/api/generate`. Attention à deux choses : ne rien logger côté client qui ressemble à une donnée personnelle, et garder `warn` par défaut en production (un `console.log` par cellule = 150 lignes au rendu).
  > Pour du vrai suivi d'erreurs en production, un logger maison ne suffira pas : Sentry (ou Vercel Log Drains) donnerait les stack traces côté client, ce que `console.*` ne remonte nulle part.

- [ ] Voir comment je peux automatiser la récupération et l'ajout des nouvelles ressources avec leurs données pour chaque provider (via Terraform, les sites officiels de chaque provider, etc.).
  > **Note / avis** : à séparer en deux problèmes, parce qu'ils n'ont pas la même solution.
  > **1. La liste des ressources → automatisable à 100 %.** La doc des providers Terraform est sur GitHub dans un format stable (`docs/resources/*.md` pour ovh/scaleway, `website/docs/r/*.html.markdown` pour hashicorp/*). Un script peut lister tous les fichiers d'un provider, en retirer ceux déjà présents dans notre dataset, et sortir un JSON directement consommable par `yarn add:resource --file`. C'est l'extension naturelle de `python/terraform-collector.py` (déjà multi-namespace depuis les derniers changements). Un workflow hebdomadaire pourrait ouvrir une issue « 12 nouvelles ressources AWS détectées ».
  > **2. Les conventions de nommage (`slug`, `length`, `restrictions`) → pas automatisable de façon fiable.** Terraform ne les expose pas. Azure a une table officielle scrapable (« Naming rules and restrictions for Azure resources » + les abréviations CAF), AWS et GCP documentent ça service par service, en prose. Réalistement : génération assistée (LLM sur la page de doc du service) puis relecture humaine, avec `yarn validate:data` comme garde-fou.
  > **Ordre conseillé** : (a) script de diff registre ↔ dataset, (b) issue automatique hebdomadaire, (c) pré-remplissage assisté des champs de nommage. Ne pas commiter automatiquement : une ressource mal classée est plus coûteuse qu'une ressource manquante.

- [ ] Ajouter d'autres langages d'IaC par provider (l'équivalent de Bicep/ARM pour Azure).
  > **Note** : la structure est déjà là (`bicepCode` / `armCode` sur `Item`, onglets conditionnés à `provider === 'azure'` dans `sidebar.tsx`). Candidats par provider : **AWS** → CloudFormation (YAML) et CDK (TypeScript) ; **GCP** → Config Connector (YAML k8s) ou gcloud CLI, Deployment Manager étant en fin de vie ; **OVH/Scaleway** → la CLI officielle (`ovhcloud` / `scw`), il n'existe pas de langage déclaratif maison ; **transverse** → Pulumi, OpenTofu (compatible Terraform), Crossplane, Ansible.
  > Deux décisions à prendre avant de coder : (1) généraliser `Item` en `snippets: { terraform?: string; bicep?: string; cloudformation?: string; ... }` plutôt que d'ajouter un champ par langage, (2) généraliser la lecture fichier de `resource/[id]/page.tsx` (aujourd'hui trois chemins en dur) pour balayer `public/<provider>/code/<langage>/<id>.<ext>`. Les onglets de la sidebar suivraient alors les langages réellement disponibles, sans `if` par provider.

- [ ] Ajouter des données pour d'autres providers.
  > **Note / suggestions par ordre d'intérêt** :
  > - **Européens / souverains** (cohérent avec OVH + Scaleway déjà présents) : Hetzner Cloud (provider TF `hetznercloud/hcloud`), Exoscale (`exoscale/exoscale`), Infomaniak, Clever Cloud, Outscale (`outscale/outscale`), IONOS.
  > - **Gros manquants du marché** : Oracle Cloud (`oracle/oci`), IBM Cloud (`IBM-Cloud/ibm`), Alibaba Cloud (`aliyun/alicloud`), Tencent Cloud.
  > - **Développeur / edge** : DigitalOcean (`digitalocean/digitalocean`), Vultr (`vultr/vultr`), Linode/Akamai (`linode/linode`), Cloudflare (`cloudflare/cloudflare`), Fly.io, Render.
  > - **Kubernetes / PaaS transverses** : Kubernetes lui-même, Nomad, Proxmox pour l'on-premise.
  > Tous ceux entre parenthèses ont un provider Terraform officiel, donc `yarn add:provider` + le collecteur de snippets fonctionnent directement. Commencer par Hetzner et DigitalOcean : petits catalogues (~20 ressources) et doc très propre.

- [ ] Ajouter les packs d'icônes pour AWS, Google Cloud, OVHcloud et Scaleway (`public/<provider>/icons/<Catégorie>/`), puis renseigner le champ `icon` des ressources. Aujourd'hui seul Azure a ses icônes ; les autres tombent sur `default-icon.svg`.

- [ ] Publier le TODO dans la documentation MkDocs, mais avec de vrais visuels.
  > **Note** : une liste de cases à cocher brute n'apporte rien de plus que le fichier `TODO.md` du dépôt. Ce qui vaudrait le coup : une page « Roadmap » avec (a) un diagramme Mermaid `gantt` ou `timeline` des chantiers (Mermaid est déjà activé dans MkDocs via `pymdownx.superfences`), (b) des cartes Material (`grid cards`) par chantier avec statut et effort estimé, (c) des badges d'état, et (d) éventuellement les compteurs réels (ressources par provider, erreurs de données) générés automatiquement depuis `yarn validate:data --json` au moment du build.
  > **Attention** : le TODO est en français alors que la doc est en anglais → soit on le traduit (page `roadmap.md` en anglais + `roadmap.fr.md` pour la version française), soit on l'assume comme page francophone. Et il faudra choisir une source unique : soit `TODO.md` est généré depuis la page de doc, soit l'inverse, sinon les deux vont diverger.

- [ ] Pouvoir brancher d'autres IA que OpenAI sur le chat des fiches ressources.
  > **Note** : la route `src/pages/api/generate.tsx` appelle l'API OpenAI en dur (URL, en-tête `Authorization`, format de stream) et le composant `chatbox.tsx` lit du SSE. Pour ouvrir à d'autres fournisseurs, il faut d'abord isoler un petit adaptateur (`src/lib/ai/<provider>.ts`) exposant `stream(prompt, messages)`, puis choisir l'implémentation via une variable `AI_PROVIDER`.
  > **Candidats** :
  > - **Anthropic (Claude)** : `https://api.anthropic.com/v1/messages`, en-têtes `x-api-key` + `anthropic-version`, stream SSE — le plus proche d'OpenAI en effort.
  > - **Google Gemini** : `generativelanguage.googleapis.com`, format de messages différent (`contents`/`parts`).
  > - **Mistral** : API compatible OpenAI, donc quasi gratuit à ajouter (juste l'URL de base et la clé) — bon argument « souveraineté » cohérent avec OVH/Scaleway dans le tableau.
  > - **Azure OpenAI** : même format qu'OpenAI mais URL par déploiement + en-tête `api-key`.
  > - **Ollama / LM Studio (local)** : `http://localhost:11434/api/chat`, aucune clé, utile pour développer sans coût ni fuite de données.
  > - **OpenRouter** : un seul point d'entrée compatible OpenAI pour des dizaines de modèles — la solution la plus rentable si l'objectif est « beaucoup de modèles » plutôt que « une intégration native par éditeur ».
  > **Variables à prévoir** : `AI_PROVIDER`, `AI_MODEL`, `AI_BASE_URL` (pour les APIs compatibles OpenAI et le local), et la clé propre à chaque fournisseur. Toutes **sans** préfixe `NEXT_PUBLIC_`.
  > **Attention** : le chat est désactivé par défaut (`ENABLE_CHAT = false`) et la route n'a ni quota ni limite de débit. Avant d'ouvrir ça en production, prévoir un rate limit, sinon la clé API est utilisable par n'importe quel visiteur.

- [ ] Écrire les bonnes pratiques du projet sous forme de *skills* Claude Code (`.claude/skills/`).
  > **Note** : aujourd'hui les conventions sont dans `CLAUDE.md` (chargé à chaque session) et dans `docs/contributing/`. Une skill est plus adaptée pour ce qui est *procédural* et pas nécessaire à chaque échange : elle n'est chargée que lorsque la tâche correspond, ce qui garde `CLAUDE.md` court.
  > **Candidats** :
  > - `yarn-workflow` : yarn uniquement (jamais `npm install`, qui créerait un `package-lock.json` divergent — il en reste d'ailleurs un commité dans le dépôt, à supprimer), `--frozen-lockfile` en CI, ce que fait `yarn check` avant de pousser, comment lire `yarn check:deps`, la règle des montées de version par paliers.
  > - `add-cloud-resource` : le parcours complet ajout d'une ressource (script, champs obligatoires, vérification des URLs Terraform sur GitHub avant de les écrire, `yarn validate:data`).
  > - `add-cloud-provider` : les 10 points d'intégration + les étapes manuelles restantes (icône, pack d'icônes, doc).
  > - `docs-and-i18n` : source unique en anglais, `*.fr.md` pour traduire, `mkdocs build --strict`, ne pas remettre de pied de page « Dernière mise à jour ».
  > **Attention** : une skill qui répète `CLAUDE.md` est du bruit. Le bon découpage est : `CLAUDE.md` = ce qui est vrai tout le temps (architecture, conventions), skills = les procédures pas-à-pas déclenchées par une tâche précise.

- [ ] Planifier la montée de version des dépendances (voir `yarn check:deps`) : Next 15 → 16, Tailwind 3 → 4, ESLint 8 → 9 (flat config). Paliers faits : Next 13 → 14.2.35 → 15.5.28 et React 18 → 19 (plus aucune vulnérabilité critique). Les 5 hautes restantes viennent de `braces`, sans correctif, et ne servent qu'au build et au lint (Tailwind, ESLint).

- [ ] Vérifier si `jspdf`, `@tiptap/*`, `axios`, `shiki`, `react-markdown` sont encore utilisés : plusieurs semblent être des reliquats. Les retirer supprimerait une bonne partie des alertes de sécurité.

## Fait

- [x] Ajouter la possibilité de changer la langue (français/anglais) dans l'application et dans la documentation.
  > App : `src/i18n/` + sélecteur dans le header, choix mémorisé dans le navigateur. Doc : plugin `mkdocs-static-i18n` (source unique en anglais, version FR servie sous `/fr/`, traduction page par page possible via `*.fr.md`).
- [x] Faire une interface admin pour voir s'il y a des bugs dans les données des providers (accessible via un mot de passe dans les variables d'environnement).
  > `/admin` + `ADMIN_PASSWORD`, règles partagées avec la CLI (`src/lib/data-audit.ts`, `yarn validate:data`).
- [x] Faire un script pour ajouter facilement de nouvelles ressources ou un nouveau provider.
  > `yarn add:resource` (interactif ou `--file`), `yarn add:provider` (10 fichiers modifiés d'un coup, `--dry-run` disponible).
