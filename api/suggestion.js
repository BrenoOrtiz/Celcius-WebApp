export default async function handler(req, res) {
    const apiKey = process.env.SECRET_API_KEY;
    const { city } = req.query;
  
    if (!apiKey) {
      return res.status(500).json({ error: "API key não configurada" });
    }
  
    if (!city) {
      return res.status(400).json({ error: "Cidade não fornecida" });
    }
  
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${encodeURIComponent(city)}`);
  
      if (!response.ok) {
        return res.status(response.status).json({ error: "Erro na API externa" });
      }
  
      const suggestions = await response.json();
      res.status(200).json(suggestions);
    } catch (err) {
      console.error("Erro no backend:", err);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
  