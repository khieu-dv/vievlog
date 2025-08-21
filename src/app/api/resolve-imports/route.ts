import {
    NextResponse
} from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { glob } from 'glob';

// --- Helper Functions ---

async function findModuleFile(basePath: string): Promise<string | null> {
    const extensions = ['.js', '.ts', '.jsx', '.tsx'];
    for (const ext of extensions) {
        const fullPath = `${basePath}${ext}`;
        try {
            await fs.access(fullPath);
            return fullPath;
        } catch {}
    }
    for (const ext of extensions) {
        const fullPath = path.join(basePath, `index${ext}`);
        try {
            await fs.access(fullPath);
            return fullPath;
        } catch {}
    }
    return null;
}

async function findTopLevelModule(modulePath: string): Promise<string | null> {
    const searchRoot = path.join(process.cwd(), 'src', 'js');
    const cleanedPath = modulePath.replace(/^(\.{2}\/|\.\/)+/, '');
    const allFiles = await glob(path.join(searchRoot, '**', '*.{js,ts,jsx,tsx}'));
    const normalizedCleanedPath = path.normalize(cleanedPath);
    for (const file of allFiles) {
        if (file.endsWith(`${normalizedCleanedPath}.js`) || file.endsWith(normalizedCleanedPath)) {
            return file;
        }
    }
    return null;
}

// --- Core Recursive Resolver ---

// This function now transforms exports instead of just inlining
async function resolveImportsRecursive(filePath: string, processedFiles: Set<string>, importContext: { defaultAs?: string, namedAs?: string[] }): Promise<string> {
    if (processedFiles.has(filePath)) {
        return `// Circular dependency for ${path.basename(filePath)} prevented.`;
    }
    processedFiles.add(filePath);

    let content = await fs.readFile(filePath, 'utf-8');

    // 1. Transform the exports of the current file's content
    if (importContext.defaultAs) {
        content = content.replace(/export\s+default\s+/, `const ${importContext.defaultAs} = `);
    }
    // Remove all other exports to avoid collisions and syntax errors
    content = content.replace(/export\s+(const|let|var|function|class)/g, '$1');
    // Remove `export { ... }` statements
    content = content.replace(/export\s+\{[^}]*\};?/g, '');

    // 2. Recursively resolve imports inside the current content
    const importRegex = /import\s+(?:(\w+)|(\{[\s\w,]+\}))\s+from\s+['"]((?:\.\/|\.\.\/)[^'"]+)['"];?/g;
    let processedContent = content;
    const matches = [...content.matchAll(importRegex)];

    for (const match of matches) {
        const importStatement = match[0];
        const defaultImportName = match[1];
        const namedImportBlock = match[2]; // We don't use this yet, but could for tree-shaking
        const relativeModulePath = match[3];
        
        const absoluteDependencyPath = path.resolve(path.dirname(filePath), relativeModulePath);
        const moduleFilePath = await findModuleFile(absoluteDependencyPath);

        if (moduleFilePath) {
            const dependencyContent = await resolveImportsRecursive(moduleFilePath, processedFiles, { defaultAs: defaultImportName });
            processedContent = processedContent.replace(importStatement, `
// --- Resolved: ${path.basename(moduleFilePath)} ---
${dependencyContent}
// --- End: ${path.basename(moduleFilePath)} ---
`);
        } else {
            processedContent = processedContent.replace(importStatement, `// Nested module not found: ${relativeModulePath}`);
        }
    }
    return processedContent;
}

// --- API Endpoint ---

export async function POST(request: Request) {
    try {
        const { code } = await request.json();
        if (typeof code !== 'string') {
            return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
        }

        let processedCode = code;
        const topLevelImportRegex = /import\s+(?:(\w+)|(\{[\s\w,]+\}))\s+from\s+['"]([^'"]+)['"];?/g;
        const topLevelMatches = [...processedCode.matchAll(topLevelImportRegex)];

        for (const match of topLevelMatches) {
            const importStatement = match[0];
            const defaultImportName = match[1];
            const namedImportBlock = match[2];
            const modulePath = match[3];

            if (!modulePath.startsWith('.')) continue;

            const moduleFilePath = await findTopLevelModule(modulePath);

            if (moduleFilePath) {
                const dependencyContent = await resolveImportsRecursive(moduleFilePath, new Set<string>(), { defaultAs: defaultImportName });
                processedCode = processedCode.replace(importStatement, `
// --- Resolved: ${path.basename(moduleFilePath)} ---
${dependencyContent}
// --- End: ${path.basename(moduleFilePath)} ---
`);
            } else {
                processedCode = processedCode.replace(importStatement, `// Top-level module not found: ${modulePath}`);
            }
        }

        return NextResponse.json({ processedCode });

    } catch (error) {
        console.error('Error resolving imports:', error);
        return NextResponse.json({ error: 'Failed to resolve imports' }, { status: 500 });
    }
}