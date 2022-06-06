# imagecli-wasm

`imagecli` compiled to WASM via WASI SDK. This doesn't expose any kind of interface - just the WASM file.

```sh
npm install --save @jspawn/imagecli-wasm
```

## Examples

### Node

**index.mjs**

```javascript
import * as fs from "fs/promises";
// https://nodejs.org/api/wasi.html
import { WASI } from "wasi";

const buf = await fs.readFile(
  "node_modules/@jspawn/imagecli-wasm/imagecli.wasm"
);
const mod = await WebAssembly.compile(buf);

const wasi = new WASI({
  // Create a blank image.
  args: ["imagecli", "-o", "blank.jpg", "-p", "new 100 100 (255, 255, 0)"],
  preopens: {
    ".": ".",
  },
});
const importObject = { wasi_snapshot_preview1: wasi.wasiImport };
const instance = await WebAssembly.instantiate(mod, importObject);

// Should be `0` on success.
const exitCode = wasi.start(instance);
```

Run with:

```sh
# Depending on your version of node, you may not need the experimental flags.
node --experimental-wasm-bigint --experimental-wasi-unstable-preview1 index.mjs
```
