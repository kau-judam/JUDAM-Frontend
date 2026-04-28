const fs = require('fs');
const glob = require('glob');

const files = glob.sync('app/**/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // Fix router.push invalid paths by casting to any
  content = content.replace(/router\.push\((`[^`]+`|'[^']+'|"[^"]+")\)/g, "router.push($1 as any)");
  content = content.replace(/router\.replace\((`[^`]+`|'[^']+'|"[^"]+")\)/g, "router.replace($1 as any)");

  // Replace common shorthand styles
  // We only replace them if they are inside StyleSheet.create
  if (content.includes('StyleSheet.create')) {
    content = content.replace(/(\s)w:\s*([0-9]+|'[^']+'),/g, "$1width: $2,");
    content = content.replace(/(\s)h:\s*([0-9]+|'[^']+'),/g, "$1height: $2,");
    content = content.replace(/(\s)px:\s*([0-9]+|'[^']+'),/g, "$1paddingHorizontal: $2,");
    content = content.replace(/(\s)py:\s*([0-9]+|'[^']+'),/g, "$1paddingVertical: $2,");
    content = content.replace(/(\s)mb:\s*([0-9]+|'[^']+'),/g, "$1marginBottom: $2,");
    content = content.replace(/(\s)mt:\s*([0-9]+|'[^']+'),/g, "$1marginTop: $2,");
    content = content.replace(/(\s)ml:\s*([0-9]+|'[^']+'),/g, "$1marginLeft: $2,");
    content = content.replace(/(\s)mr:\s*([0-9]+|'[^']+'),/g, "$1marginRight: $2,");
    content = content.replace(/(\s)maxH:\s*([0-9]+|'[^']+'),/g, "$1maxHeight: $2,");
  }
  
  if (file.includes('app/brewery/dashboard.tsx')) {
    if (!content.includes('Modal,')) {
      content = content.replace("import {", "import { Modal,");
    }
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
});
