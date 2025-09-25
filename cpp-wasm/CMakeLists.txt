cmake_minimum_required(VERSION 3.16)
project(cpp_wasm_data_structures)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Emscripten-specific settings
if(EMSCRIPTEN)
    set(CMAKE_EXECUTABLE_SUFFIX ".js")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -O3 -s WASM=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s ALLOW_MEMORY_GROWTH=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s EXPORT_NAME='CppWasmModule'")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s MODULARIZE=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s SINGLE_FILE=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} --bind")
endif()

# Include directories
include_directories(src)

# Data Structures source files
set(DATA_STRUCTURES_SOURCES
    src/data_structures/arrays.cpp
    src/data_structures/linked_lists.cpp
    src/data_structures/stacks.cpp
    src/data_structures/queues.cpp
    src/data_structures/trees.cpp
    src/data_structures/hash_tables.cpp
    src/data_structures/heaps.cpp
    src/data_structures/graphs.cpp
)

# Algorithms source files
set(ALGORITHMS_SOURCES
    src/algorithms/sorting.cpp
    src/algorithms/searching.cpp
    src/algorithms/graph_algorithms.cpp
    src/algorithms/dynamic_programming.cpp
)

# Math utilities source file
set(MATH_SOURCES
    src/math.cpp
)

# All source files
set(ALL_SOURCES
    ${DATA_STRUCTURES_SOURCES}
    ${ALGORITHMS_SOURCES}
    ${MATH_SOURCES}
    src/bindings.cpp
)

# Create the executable
add_executable(cpp_wasm_data_structures ${ALL_SOURCES})

# Link libraries if needed
if(NOT EMSCRIPTEN)
    # For native compilation (testing)
    find_package(Threads REQUIRED)
    target_link_libraries(cpp_wasm_data_structures Threads::Threads)
endif()

# Set output directory
set_target_properties(cpp_wasm_data_structures PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/dist"
)

# Custom target for building with Emscripten
if(EMSCRIPTEN)
    add_custom_command(TARGET cpp_wasm_data_structures POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy
            "${CMAKE_CURRENT_SOURCE_DIR}/dist/cpp_wasm_data_structures.js"
            "${CMAKE_CURRENT_SOURCE_DIR}/dist/cpp-wasm.js"
        COMMENT "Copying output to cpp-wasm.js"
    )
endif()