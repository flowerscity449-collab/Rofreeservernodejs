const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const port = process.env.PORT || 10000;

app.get('/scan-group', async (req, res) => {
    const startTime = Date.now();
    let found = false;
    let groupData = null;

    // O servidor vai "caçar" por até 25 segundos antes de dar timeout
    while (!found && (Date.now() - startTime) < 25000) {
        // Geramos IDs em faixas onde grupos costumam ser abandonados (5M a 18M)
        const randomId = Math.floor(Math.random() * (18000000 - 5000000)) + 5000000;

        try {
            // Requisição ultra rápida para o Roblox
            const response = await axios.get(`https://groups.roblox.com/v1/groups/${randomId}`, { timeout: 1200 });
            const data = response.data;

            // --- LÓGICA DE FILTRAGEM INTELIGENTE ---
            const isAbandoned = data.owner === null; // Sem dono
            const isJoinable = data.publicEntryAllowed === true; // Entrada livre
            const isSmall = data.memberCount > 0 && data.memberCount < 10; // Poucos membros (mas não 0 para evitar bugs)
            const isClean = !data.isLocked; // Não está banido

            if (isAbandoned && isJoinable && isSmall && isClean) {
                groupData = data;
                found = true;
                console.log(`✅ Grupo Alvo Encontrado: ${randomId}`);
            }
        } catch (e) {
            // Se o ID não existir ou a API do Roblox der erro, ele pula pro próximo na hora
            continue;
        }
    }

    if (found) {
        res.json({
            id: groupData.id,
            name: groupData.name,
            members: groupData.memberCount
        });
    } else {
        // Se a busca demorar muito, avisamos o site para tentar de novo sem cobrar créditos extras
        res.status(408).json({ error: "A busca demorou demais. Tente novamente!" });
    }
});

app.listen(port, () => console.log(`Caçador ROFREE ativo na porta ${port}`));
