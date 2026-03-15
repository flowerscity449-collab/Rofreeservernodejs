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

    // Ele vai tentar por até 4.5 segundos antes de desistir
    while (!found && (Date.now() - startTime) < 4500) {
        // IDs na faixa de 5M a 15M costumam ter muitos grupos abandonados
        const randomId = Math.floor(Math.random() * (15000000 - 5000000)) + 5000000;

        try {
            const response = await axios.get(`https://groups.roblox.com/v1/groups/${randomId}`, { timeout: 1000 });
            const data = response.data;

            // Filtro Ryan: Sem dono, entrada liberada e poucos membros
            if (!data.owner && data.publicEntryAllowed === true && data.memberCount <= maxMembers) {
                groupData = data;
                found = true;
            }
        } catch (e) {
            // Ignora erros de ID inexistente e continua
        }
    }

    if (found) {
        res.json({ id: groupData.id, name: groupData.name });
    } else {
        // Caso não ache nada no tempo limite, envia um ID que sabemos que está vazio (reserva)
        res.json({ id: 1234567, name: "Tente novamente!" }); 
    }
});

app.listen(port, () => console.log(`ROFREE Online na porta ${port}`));
