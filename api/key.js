export default async function handler(req, res) {
    const apiKey = process.env.SECRET_API_KEY;
  
    if (!apiKey) {
      return res.status(500).json({ error: "API key não configurada" });
    }
  
    if (!resposta.ok) {
      return res.status(resposta.status).json({ error: "Erro na API externa" });
    }
  
    const dados = await resposta.json();
  
    // Envia pro frontend apenas os dados (sem expor a chave)
    res.status(200).json(dados);
  }
  