const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Tạo temporary HTML files từ MDX content
const contentDir = path.join(process.cwd(), 'src/content');
const tempDir = path.join(process.cwd(), 'temp-search');

function createTempHtmlFiles() {
  // Tạo temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  // Đọc tất cả MDX files
  function processDirectory(dir, relativePath = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        const newRelativePath = path.join(relativePath, file);
        fs.mkdirSync(path.join(tempDir, newRelativePath), { recursive: true });
        processDirectory(filePath, newRelativePath);
      } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Extract title and content
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : file.replace(/\.mdx?$/, '');
        
        // Remove frontmatter and convert basic markdown to HTML
        const cleanContent = content
          .replace(/^---[\s\S]*?---\s*/, '') // Remove frontmatter
          .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>') // H1
          .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>') // H2
          .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>') // H3
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
          .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
          .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
          .replace(/```[\s\S]*?```/g, '<pre><code>Code block</code></pre>') // Code blocks
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .map(line => line.startsWith('<') ? line : `<p>${line}</p>`)
          .join('\n');

        // Tạo HTML file với metadata cho URL routing
        const relativePath = path.relative(contentDir, filePath);
        const urlPath = `/docs/${relativePath.replace(/\.mdx?$/, '').replace(/\\/g, '/')}`;
        
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="pagefind-url" content="${urlPath}">
</head>
<body data-pagefind-body>
    ${cleanContent}
</body>
</html>`;

        const outputPath = path.join(tempDir, path.dirname(relativePath), file.replace(/\.mdx?$/, '.html'));
        fs.writeFileSync(outputPath, htmlContent);
        console.log(`Created: ${outputPath}`);
      }
    });
  }

  processDirectory(contentDir);
}

function runPagefind() {
  try {
    execSync(`npx pagefind --site ${tempDir} --output-path public/_pagefind --force-language en`, {
      stdio: 'inherit'
    });
    console.log('Pagefind indexing completed!');
  } catch (error) {
    console.error('Pagefind failed:', error.message);
  }
}

function cleanup() {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true });
    console.log('Cleaned up temporary files');
  }
}

// Main execution
console.log('Building search index from MDX content...');
createTempHtmlFiles();
runPagefind();
cleanup();