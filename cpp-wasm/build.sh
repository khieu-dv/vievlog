#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building C++ WASM Data Structures and Algorithms...${NC}"

# Check if emscripten is available
if ! command -v emcc &> /dev/null; then
    echo -e "${RED}Error: Emscripten not found. Please install and activate emscripten.${NC}"
    echo -e "${YELLOW}Installation instructions: https://emscripten.org/docs/getting_started/downloads.html${NC}"
    exit 1
fi

# Create build directory
mkdir -p build
mkdir -p dist

echo -e "${YELLOW}Configuring build with CMake...${NC}"

# Configure with CMake for Emscripten
emcmake cmake -B build -S . \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_CXX_STANDARD=17

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: CMake configuration failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Building with make...${NC}"

# Build the project
emmake make -C build -j$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)

if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}Build completed successfully!${NC}"

# Check if output files exist
if [ -f "dist/cpp-wasm.js" ]; then
    echo -e "${GREEN}Output file: dist/cpp-wasm.js${NC}"
    echo -e "${GREEN}File size: $(du -h dist/cpp-wasm.js | cut -f1)${NC}"
else
    echo -e "${YELLOW}Warning: Output file not found at expected location${NC}"
    echo -e "${YELLOW}Looking for build outputs...${NC}"
    find build -name "*.js" -o -name "*.wasm" | head -10
fi

# Copy to project directories
echo -e "${YELLOW}Copying files to project directories...${NC}"
mkdir -p ../src/wasm/cpp
mkdir -p ../public/wasm/cpp

if [ -f "dist/cpp-wasm.js" ]; then
    cp dist/cpp-wasm.js ../src/wasm/cpp/cpp-wasm.js
    cp dist/cpp-wasm.js ../public/wasm/cpp/cpp-wasm.js
    echo -e "${GREEN}Files copied to ../src/wasm/cpp/ and ../public/wasm/cpp/${NC}"
fi

echo -e "${BLUE}C++ WASM build process completed!${NC}"