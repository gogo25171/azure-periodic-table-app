# Languages

The interface and this documentation are available in **English** and
**French**.

## In the application

The language selector sits in the header (globe icon) and in the mobile menu.
The choice is stored in `localStorage` under `periodic-table.language` and
applied to the `lang` attribute of the page.

- Dictionaries: `src/i18n/dictionaries.ts`
- Provider and hooks: `src/i18n/LanguageContext.tsx`
- Initial language: `NEXT_PUBLIC_DEFAULT_LANGUAGE` (`en` by default), then the
  browser language, then the stored choice.

Using a translation inside a component:

```tsx
import { useTranslation } from '@/i18n/LanguageContext';

const t = useTranslation();

<h1>{t('table.title', { provider: 'Azure' })}</h1>;
```

Adding a key means adding it to the `en` dictionary — the reference type — and
then to `fr`. TypeScript fails the build when a translation is missing.
Placeholders use the `{name}` syntax.

!!! note "What is translated"
    The interface itself (header, toolbar, resource sheet labels, categories,
    admin dashboard) is translated. The provider data — resource names,
    descriptions and naming restrictions — stays in English because it mirrors
    the vendor documentation.

## In the documentation

The documentation uses
[mkdocs-static-i18n](https://ultrabug.github.io/mkdocs-static-i18n/) in
`suffix` mode:

- pages are written **once**, in English (`docs/**/*.md`);
- the French site is served under `/fr/` and falls back to the English content,
  so no page has to be duplicated;
- the navigation labels are translated in `mkdocs.yml` (`nav_translations`);
- a page can be genuinely translated by adding a sibling file with the `.fr.md`
  suffix, for example `docs/index.fr.md`.

The language switcher is added to the site header automatically.
