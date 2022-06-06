FROM rust:1.61

RUN rustup target add wasm32-wasi
RUN git config --global --add safe.directory '*'
