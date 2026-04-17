const fs = require('fs');
const path = require('path');

const contentDir = path.join(process.cwd(), 'content');
const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(contentDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Regex to match anything inside <body>...</body>
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    content = bodyMatch[1];
  }

  // Remove any stray <script> tags just in case (though body usually contains them)
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`Successfully cleaned up HTML in ${file}`);
});
