const express = require('express');
const app = express();
const port = process.env.PORT || 10000; // O Render usa portas altas no plano free

// ... resto do seu código ...

app.listen(port, () => {
  console.log(`ROFREE rodando na porta ${port}`);
});

app.use(cors()); // Permite que seu site ROFREE acesse esta API

app.get('/scan-group', async (req, res) => {
    const startId = req.query.startId || 1000000;
    
    // O Bot tenta checar 5 IDs por vez para não ser bloqueado
    for (let i = 0; i < 5; i++) {
        let currentId = parseInt(startId) + Math.floor(Math.random() * 1000);
        
        try {
            const response = await axios.get(`https://groups.roblox.com/v1/groups/${currentId}`);
            const group = response.data;

            // CRITÉRIOS DO ROFREE:
            // 1. Proprietário é null (Ninguém)
            // 2. Menos de 10 membros
            // 3. O grupo não está trancado (público para entrar)
            if (group.owner === null && group.memberCount < 10 && group.isPublicEntryAllowed) {
                return res.json({
                    success: true,
                    id: group.id,
                    name: group.name,
                    members: group.memberCount,
                    owner: "Ninguém"
                });
            }
        } catch (error) {
            // Se o ID não existir, ele pula para o próximo
            continue;
        }
    }
    
    res.json({ success: false, message: "Ainda procurando... Tente de novo!" });
});

app.listen(3000, () => console.log("API ROFREE rodando na porta 3000"));
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors()); // Permite que seu site ROFREE acesse esta API

app.get('/scan-group', async (req, res) => {
    const startId = req.query.startId || 1000000;
    
    // O Bot tenta checar 5 IDs por vez para não ser bloqueado
    for (let i = 0; i < 5; i++) {
        let currentId = parseInt(startId) + Math.floor(Math.random() * 1000);
        
        try {
            const response = await axios.get(`https://groups.roblox.com/v1/groups/${currentId}`);
            const group = response.data;

            // CRITÉRIOS DO ROFREE:
            // 1. Proprietário é null (Ninguém)
            // 2. Menos de 10 membros
            // 3. O grupo não está trancado (público para entrar)
            if (group.owner === null && group.memberCount < 10 && group.isPublicEntryAllowed) {
                return res.json({
                    success: true,
                    id: group.id,
                    name: group.name,
                    members: group.memberCount,
                    owner: "Ninguém"
                });
            }
        } catch (error) {
            // Se o ID não existir, ele pula para o próximo
            continue;
        }
    }
    
    res.json({ success: false, message: "Ainda procurando... Tente de novo!" });
});

app.listen(3000, () => console.log("API ROFREE rodando na porta 3000"));
