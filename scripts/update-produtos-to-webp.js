const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'produtos.json');
const raw = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(raw);

// Update image paths to .webp
for (const produto of data) {
  if (produto.imagem) {
    produto.imagem = produto.imagem.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ produtos.json updated to use .webp images');

