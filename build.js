// build.js
const fs = require('fs');

// Lê o secret de process.env
const apiKey = process.env.SECRET_API_KEY || 'chave-padrao';
const inputFile = 'js/index.js'; 
const outputFile = 'dist/js/index.js'; 

// Lê o conteúdo do js/index.js
let content = fs.readFileSync(inputFile, 'utf8');

// Substitui o placeholder pelo valor do secret
content = content.replace('B_SECRET_KEY', apiKey);

// Cria a pasta dist se não existir
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Escreve o arquivo final
fs.writeFileSync(outputFile, content, 'utf8');

console.log('Build concluído com sucesso!');