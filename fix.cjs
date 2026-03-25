const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(file))) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
let count = 0;

files.forEach(f => {
  let original = fs.readFileSync(f, 'utf8');
  let c = original;
  
  // Replace: fetch(${import.meta.env.VITE_API_URL}/some-endpoint.php"
  // With:    fetch(`${import.meta.env.VITE_API_URL}/some-endpoint.php`
  c = c.replace(/fetch\(\$\{import\.meta\.env\.VITE_API_URL\}\/([^"']+?)["']/g, 'fetch(`${import.meta.env.VITE_API_URL}/$1`');
  
  // Replace: API_URL = ${import.meta...}/"
  // With:    API_URL = import.meta.env...
  // (In case the previous regex didn't catch api.js perfectly)
  c = c.replace(/=\s*\$\{import\.meta\.env\.VITE_API_URL\}\/["']/g, '= import.meta.env.VITE_API_URL;');

  if (c !== original) {
    fs.writeFileSync(f, c, 'utf8');
    count++;
    console.log('Fixed:', path.basename(f));
  }
});

console.log('Total files repaired:', count);
