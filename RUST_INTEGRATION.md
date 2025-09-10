# 🦀 Rust + Next.js Integration Guide

## Overview

This project integrates Rust with Next.js using WebAssembly (WASM) to leverage Rust's performance advantages for computationally intensive tasks while maintaining the excellent developer experience of Next.js.

## Architecture

```
vievlog/
├── rust-wasm/                 # Rust source code
│   ├── src/
│   │   └── lib.rs            # Main Rust library
│   ├── Cargo.toml            # Rust dependencies
│   └── target/               # Build artifacts
├── public/wasm/              # Compiled WASM files
├── src/lib/wasm-loader.ts    # TypeScript wrapper
└── src/components/examples/
    └── RustWasmDemo.tsx      # Demo component
```

## Features Implemented

### 🔢 Mathematical Operations
- **Addition**: Basic arithmetic operations
- **Fibonacci**: Efficient recursive computation
- **Array operations**: Sum, max finding

### 📝 Text Processing
- **String reversal**: Character manipulation
- **Word counting**: Text analysis
- **Slug generation**: URL-friendly string conversion
- **Text analysis**: Word count, reading time calculation

### 🚀 Performance Features
- **Heavy computation**: Benchmark testing with trigonometric operations
- **Hash functions**: Simple content verification
- **Data processing**: Complex object transformations

### 🔧 Utility Functions
- **Console logging**: Debug output from Rust
- **Error handling**: Proper error propagation
- **Type safety**: Full TypeScript integration

## Build Process

### Development
```bash
# Build Rust code
npm run build:rust

# Start development server
npm run dev
```

### Production
```bash
# Build everything (includes Rust compilation)
npm run build
```

## Usage Examples

### Basic Usage

```typescript
import { rustWasm } from '~/lib/wasm-loader';

// Initialize WASM module
await rustWasm.init();

// Use Rust functions
const greeting = rustWasm.greet("World");
const result = rustWasm.add(10, 20);
const fib = rustWasm.fibonacci(10);
```

### React Component Integration

```tsx
import { useEffect, useState } from 'react';
import { rustWasm } from '~/lib/wasm-loader';

export function MyComponent() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    rustWasm.init().then(() => setInitialized(true));
  }, []);

  const handleClick = () => {
    if (initialized) {
      const result = rustWasm.fibonacci(20);
      console.log('Fibonacci result:', result);
    }
  };

  return (
    <button onClick={handleClick} disabled={!initialized}>
      Calculate Fibonacci
    </button>
  );
}
```

### Text Analysis

```typescript
const text = "Lorem ipsum dolor sit amet...";
const analysis = rustWasm.analyzeText(text);

console.log(analysis);
// Output: {
//   wordCount: 123,
//   charCount: 567,
//   lineCount: 5,
//   readingTimeMinutes: 1
// }
```

### Performance Testing

```typescript
// Heavy computation benchmark
console.time('Rust computation');
const result = rustWasm.heavyComputation(1000000);
console.timeEnd('Rust computation');
```

## Development Workflow

### Adding New Rust Functions

1. **Add function to `rust-wasm/src/lib.rs`**:
```rust
#[wasm_bindgen]
pub fn my_new_function(input: &str) -> String {
    // Your Rust logic here
    format!("Processed: {}", input)
}
```

2. **Build WASM**:
```bash
npm run build:rust
```

3. **Add TypeScript wrapper in `src/lib/wasm-loader.ts`**:
```typescript
myNewFunction(input: string): string {
  const wasm = this.ensureInitialized();
  return wasm.my_new_function(input);
}
```

4. **Use in React components**:
```typescript
const result = rustWasm.myNewFunction("test");
```

### Debugging

- **Rust side**: Use `console_log!` macro for logging
- **TypeScript side**: Standard console.log works
- **WASM errors**: Check browser developer tools console

## Performance Considerations

### When to Use Rust/WASM

✅ **Good for:**
- Heavy mathematical computations
- String processing with large datasets
- Algorithms with complex logic
- Performance-critical operations
- CPU-intensive tasks

❌ **Not ideal for:**
- Simple DOM manipulations
- Network requests
- File I/O operations
- Small, simple calculations

### Performance Tips

1. **Minimize data marshalling**: Avoid frequent data transfer between JS and WASM
2. **Batch operations**: Process arrays/objects in bulk
3. **Use appropriate data types**: Choose efficient Rust types
4. **Profile before optimizing**: Measure actual performance gains

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (modern versions)
- **Edge**: Full support

## File Structure Details

### `rust-wasm/Cargo.toml`
Defines Rust dependencies and build configuration:
- `wasm-bindgen`: JavaScript interop
- `web-sys`: Web API bindings
- `js-sys`: JavaScript type bindings
- `serde`: Serialization support

### `src/lib/wasm-loader.ts`
TypeScript wrapper providing:
- WASM module initialization
- Type-safe function calls
- Error handling
- React hooks

### `next.config.js`
Next.js configuration for WASM:
- Webpack WASM support
- Async WebAssembly experiments
- CORS headers for WASM files

## Advanced Usage

### Complex Data Types

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct ComplexData {
    pub name: String,
    pub values: Vec<f64>,
    pub metadata: HashMap<String, String>,
}

#[wasm_bindgen]
pub fn process_complex_data(data: &JsValue) -> Result<JsValue, JsValue> {
    let input: ComplexData = serde_wasm_bindgen::from_value(data.clone())?;
    
    // Process the data
    let result = ComplexData {
        name: format!("Processed: {}", input.name),
        values: input.values.iter().map(|x| x * 2.0).collect(),
        metadata: input.metadata,
    };
    
    Ok(serde_wasm_bindgen::to_value(&result)?)
}
```

### Memory Management

```rust
// For working with large datasets
#[wasm_bindgen]
pub fn process_large_array(data: &[f64]) -> Vec<f64> {
    data.iter().map(|x| x.powi(2)).collect()
}
```

## Troubleshooting

### Common Issues

1. **WASM module not loading**:
   - Check browser console for CORS errors
   - Ensure WASM files are served correctly
   - Verify file paths

2. **Build errors**:
   - Update Rust toolchain: `rustup update`
   - Check wasm-pack version: `wasm-pack --version`
   - Clear build cache: `cargo clean`

3. **TypeScript errors**:
   - Rebuild WASM: `npm run build:rust`
   - Check type definitions
   - Verify import paths

### Debug Commands

```bash
# Check Rust installation
rustc --version

# Check wasm-pack
wasm-pack --version

# Clean and rebuild
cd rust-wasm && cargo clean && cd .. && npm run build:rust

# Verify WASM files
ls -la public/wasm/
```

## Future Enhancements

- [ ] Web Workers integration for background processing
- [ ] Streaming data processing
- [ ] Advanced cryptographic functions
- [ ] Image processing capabilities
- [ ] Machine learning inference
- [ ] Database query optimization

## Resources

- [Rust WASM Book](https://rustwasm.github.io/book/)
- [wasm-bindgen Guide](https://rustwasm.github.io/wasm-bindgen/)
- [Next.js WASM Documentation](https://nextjs.org/docs/advanced-features/using-webassembly)
- [MDN WebAssembly](https://developer.mozilla.org/docs/WebAssembly)