#!/bin/bash
set -euo pipefail

fn_git_clean() {
  git clean -xdf
  git checkout .
}

OUT_DIR="$PWD/out"
ROOT="$PWD"

mkdir -p "$OUT_DIR"

cd "$ROOT/lib/imagecli"
fn_git_clean
patch -p1 < ../../patches/imagecli.patch
cargo build --release --target wasm32-wasi
mkdir -p "$ROOT/dist"
mv target/wasm32-wasi/release/imagecli.wasm "$ROOT/dist/"
