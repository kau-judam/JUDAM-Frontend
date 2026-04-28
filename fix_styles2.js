const fs = require('fs');
const glob = require('glob');

const files = glob.sync('app/**/*.tsx');
files.push('components/recipe-card.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // map of shorthands to standard names
  const map = {
    'w': 'width',
    'h': 'height',
    'px': 'paddingHorizontal',
    'py': 'paddingVertical',
    'mb': 'marginBottom',
    'mt': 'marginTop',
    'ml': 'marginLeft',
    'mr': 'marginRight',
    'maxH': 'maxHeight',
  };

  if (content.includes('StyleSheet.create')) {
    Object.keys(map).forEach(key => {
      const regex = new RegExp(`([{,\\s])\\s*${key}:\\s*([^,}\\n]+)`, 'g');
      content = content.replace(regex, `$1 ${map[key]}: $2`);
    });
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
