# ox_lib JS/TS wrapper

Not all ox_lib functions found in Lua are supported, the ones that are will have a JS/TS example
on the documentation.

Currently, all the available functions for JS/TS can be found under the `resource` folder in  
ox_lib.

## Installation

```yaml
# With npm
npm install @platinumscripts/ps_lib
```

## Usage

You can either import the lib from client or server files or deconstruct the object and import only certain functions
you may require.

```ts
import lib from "@platinumscripts/ps_lib/client";
```

```ts
import lib from "@platinumscripts/ps_lib/server";
```

```ts
import { checkDependency } from "@platinumscripts/ps_lib/shared";
```

## Documentation

[View documentation](https://overextended.github.io/docs/ps_lib)
