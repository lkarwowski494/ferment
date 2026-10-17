import fs from 'node:fs';
import path from 'node:path';

function getImports(file) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/from\s+['"](\.[^'"]+)['"]/g)];
  return matches.map(m => {
    let rel = m[1];
    let resolved = path.resolve(path.dirname(file), rel);
    for (let ext of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) {
      if (fs.existsSync(resolved + ext) && fs.statSync(resolved + ext).isFile()) return resolved + ext;
    }
    return null;
  }).filter(Boolean);
}

function scanDir(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  for (let f of fs.readdirSync(dir)) {
    let full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) files.push(...scanDir(full));
    else if (/\.(ts|tsx)$/.test(f)) files.push(full);
  }
  return files;
}

const files = [...scanDir('src'), ...scanDir('app')];
const graph = {};
for (let f of files) graph[f] = getImports(f);

let cycles = [];
function checkCycle(node, visited, stack) {
  visited[node] = true;
  stack[node] = true;
  for (let neighbor of (graph[node] || [])) {
    if (!visited[neighbor]) {
      checkCycle(neighbor, visited, stack);
    } else if (stack[neighbor]) {
      cycles.push([node, neighbor]);
    }
  }
  stack[node] = false;
}

let visited = {}, stack = {};
for (let f of files) {
  if (!visited[f]) checkCycle(f, visited, stack);
}

console.log('[check:cycles] Liczba cykli importów:', cycles.length);
if (cycles.length > 0) {
  for (let c of cycles) {
    console.error(`Cycle: ${path.basename(c[0])} -> ${path.basename(c[1])}`);
  }
  process.exit(1);
} else {
  console.log('[check:cycles] ✓ Brak cykli w drzewie modułów');
}
