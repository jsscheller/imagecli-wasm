const assert = require("assert");
const path = require("path");
const fs = require("fs/promises");
const { WASI } = require("wasi");

const OUT_DIR = path.join(__dirname, "out");

before(async function () {
  await fs.mkdir(OUT_DIR, { recursive: true });
});

describe("basic", function () {
  it("should generate blank PNG", async function () {
    const code = await callMain([
      "-o",
      "out/blank.png",
      "-p",
      "new 100 100 (255, 255, 0)",
    ]);
    assert.equal(code, 0);
  });

  it("should generate blank JPG", async function () {
    const code = await callMain([
      "-o",
      "out/blank.jpg",
      "-p",
      "new 100 100 (255, 255, 0)",
    ]);
    assert.equal(code, 0);
  });
});

let _cachedMod;
async function callMain(args) {
  if (!_cachedMod) {
    const buf = await fs.readFile("dist/imagecli.wasm");
    _cachedMod = await WebAssembly.compile(buf);
  }

  const wasi = new WASI({
    args: ["imagecli"].concat(args),
    preopens: {
      ".": __dirname,
    },
  });
  const importObject = { wasi_snapshot_preview1: wasi.wasiImport };
  const instance = await WebAssembly.instantiate(_cachedMod, importObject);

  return wasi.start(instance);
}
