        // Simple Express backend that proxies prompts to OpenAI and returns generated HTML
        const express = require('express');
        const fetch = require('node-fetch');
        const cors = require('cors');
        require('dotenv').config();
        const app = express();
        const PORT = process.env.PORT || 4000;

        app.use(cors());
        app.use(express.json({limit: '1mb'}));

        app.get('/', (req, res) => res.send('AI Site Builder Backend'));

        app.post('/generate', async (req, res) => {
          try {
            const { prompt, styleHints } = req.body || {};
            if (!prompt) return res.status(400).json({ error: 'prompt required' });
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) return res.status(500).json({ error: 'OpenAI API key not configured. Copy .env.example to .env and add OPENAI_API_KEY' });

            // Construct a system + user prompt to ask OpenAI to return a full HTML page.
            const system = "You are an assistant that outputs a single complete HTML5 document. Respond ONLY with valid HTML. Do NOT include explanation.";
            const user = `Create a complete, modern, responsive single-page website that matches this brief:

${prompt}

Optional style hints: ${styleHints || 'none'}

Return a single HTML document (<!doctype html> ...).`;

            const body = {
              model: "gpt-5", 
              messages: [
                { role: "system", content: system },
                { role: "user", content: user }
              ],
              max_tokens: 2500,
              temperature: 0.8
            };

            const r = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
              },
              body: JSON.stringify(body)
            });

            if (!r.ok) {
              const txt = await r.text();
              return res.status(502).json({ error: 'OpenAI error', details: txt });
            }
            const json = await r.json();
            const html = json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
            if (!html) return res.status(502).json({ error: 'no html returned from model', raw: json });
            res.json({ html });
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: String(err) });
          }
        });

        app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
