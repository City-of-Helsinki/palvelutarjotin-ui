# Menu fixtures for testing

Menus were read from production headless CMS with `menuIdentifiersOnly: false`,
written to JSON files using field name filtering to reduce the amount of data,
and wrapped with:
```typescript
import { LanguageCodeEnum } from './types';
import type { MenuQuery } from './types';

const menu: MenuQuery = {
  <JSON data>
};

export default menu;
```

Also converted the enum values to make type checking pass:
 - `code: "FI"` → `code: LanguageCodeEnum.Fi`
 - `code: "EN"` → `code: LanguageCodeEnum.En`
 - `code: "SV"` → `code: LanguageCodeEnum.Sv`

## Field filtering

The fields needed for testing were:
 - "" (whole object)
 - "0", "1", "2", ... (array indices as strings)
 - "__typename"
 - "code"
 - "connectedNode"
 - "id"
 - "language"
 - "menu"
 - "menuItems"
 - "node"
 - "nodes"
 - "slug"
 - "translations"
 - "uri"

This can be easily used in a `replacer` function given to `JSON.stringify`
so it only accepts these fields.