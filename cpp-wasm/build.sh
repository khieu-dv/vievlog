#!/bin/bash

# Build script for compiling C++ to WebAssembly using Emscripten

echo "Building C++ to WebAssembly..."

# Create output directory if it doesn't exist
mkdir -p ../src/wasm/cpp

# Compile C++ to WASM
emcc math_utils.cpp \
  -o ../src/wasm/cpp/math_utils.js \
  -s WASM=1 \
  -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME="MathUtils" \
  -s ENVIRONMENT=web \
  -s SINGLE_FILE=0 \
  --bind \
  -O3

# Copy to public directory for web access
mkdir -p ../public/wasm/cpp
cp ../src/wasm/cpp/math_utils.js ../public/wasm/cpp/
cp ../src/wasm/cpp/math_utils.wasm ../public/wasm/cpp/

echo "Build completed successfully!"
echo "Generated files:"
echo "  - ../src/wasm/cpp/math_utils.js"
echo "  - ../src/wasm/cpp/math_utils.wasm"
echo "  - ../public/wasm/cpp/math_utils.js"
echo "  - ../public/wasm/cpp/math_utils.wasm"