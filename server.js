const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// Porta dinâmica para o Render
const port = process.env.PORT || 10000;

app.get('/scan-group', async (req, res) => {
    // Filtros que vêm do seu main.js
    const maxMembers = parseInt(req.query.maxMembers) || 10;
    
    let found = false;
    let attempts = 0;
    let groupData = null;

    // Tentamos achar um grupo válido por no máximo 4 segundos para não travar
    while (!found && attempts < 15) {
        attempts++;
        // Gera um ID aleatório (ajuste o range se quiser grupos mais novos ou velhos)
        const randomId = Math.floor(Math.random() * (15000000 - 1000000)) + 1000000;

        try {
            const response = await axios.get(`https://groups.roblox.com/v1/groups/${randomId}`);
            const data = response.data;

            // REGRAS DO RYAN: Sem dono, aberto e poucos membros
            if (!data.owner && data.publicEntryAllowed === true && data.memberCount <= maxMembers) {
                groupData = data;
                found = true;
            }
        } catch (error) {
            // Se o ID não existir, ele pula para o próximo
            continue;
        }
    }

    if (found) {
        res.json({
            id: groupData.id,
            name: groupData.name,
            memberCount: groupData.memberCount
        });
    } else {
        // Se não achar em 15 tentativas, manda um ID reserva para não dar erro
        res.status(404).json({ error: "Nenhum grupo vazio encontrado agora. Tente de novo!" });
    }
});

app.get('/', (req, res) => {
    res.send("Servidor ROFREE Ativo!");
});

app.listen(port, () => {
    console.log(`API ROFREE rodando na porta ${port}`);
});
