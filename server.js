const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const port = process.env.PORT || 10000;

app.get('/scan-group', async (req, res) => {
    const maxMembers = 10;
    const startTime = Date.now();
    let found = false;
    let groupData = null;

    console.log("Iniciando busca por grupos abandonados...");

    // O loop tenta encontrar o grupo ideal por até 15 segundos
    while (!found && (Date.now() - startTime) < 15000) {
        // Gera um ID aleatório entre 1M e 18M (faixa de grupos antigos e novos)
        const randomId = Math.floor(Math.random() * (18000000 - 1000000)) + 1000000;

        try {
            // Chamada para a API do Roblox
            const response = await axios.get(`https://groups.roblox.com/v1/groups/${randomId}`, { timeout: 2000 });
            const data = response.data;

            // --- OS FILTROS DO RYAN ---
            const hasNoOwner = data.owner === null; // Sem proprietário
            const isPublic = data.publicEntryAllowed === true; // Grupo aberto
            const fewMembers = data.memberCount < maxMembers; // Menos de 10 membros
            const isNotLocked = !data.isLocked; // Grupo não está banido/travado

            if (hasNoOwner && isPublic && fewMembers && isNotLocked) {
                groupData = data;
                found = true;
                console.log(`Grupo encontrado! ID: ${randomId}`);
            }
        } catch (e) {
            // Se o grupo não existir (Erro 404), o loop continua silenciosamente
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
        // Se o tempo acabar e não achar, envia um erro para o main.js devolver os créditos
        res.status(404).json({ error: "Nenhum grupo encontrado nos filtros. Tente de novo!" });
    }
});

// Rota de teste para saber se está online
app.get('/', (req, res) => res.send("Servidor ROFREE Ativo e Filtrando!"));

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
