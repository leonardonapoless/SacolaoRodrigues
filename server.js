const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; 

const pedidosDBPath = path.join(__dirname, 'pedidos.json');
app.use(cors());
app.use(express.json()); 

function lerPedidos() {
    try {
        if (fs.existsSync(pedidosDBPath)) {
            const data = fs.readFileSync(pedidosDBPath);
            return JSON.parse(data);
        }
        return []; 
    } catch (error) {
        console.error("Erro ao ler pedidos.json:", error);
        return []; 
    }
}
function salvarPedidos(pedidos) {
    try {
        fs.writeFileSync(pedidosDBPath, JSON.stringify(pedidos, null, 2));
    } catch (error) {
        console.error("Erro ao salvar pedidos.json:", error);
    }
}

app.post('/api/pedidos', (req, res) => {
    const novoPedido = req.body; 
    
    if (!novoPedido || !novoPedido.itens || !novoPedido.clienteInfo) {
        return res.status(400).json({ message: 'Dados do pedido incompletos.' });
    }

    const pedidos = lerPedidos();
    
    novoPedido.id = `pedido_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    novoPedido.data = new Date().toISOString();
    novoPedido.status = "Em processamento";

    pedidos.push(novoPedido);
    salvarPedidos(pedidos);

    console.log('Novo pedido recebido:', novoPedido);
    res.status(201).json({ message: 'Pedido recebido com sucesso!', pedido: novoPedido });
});

app.get('/api/pedidos', (req, res) => {
    const pedidos = lerPedidos();
    res.json(pedidos.slice(-5).reverse());
});

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
});

app.delete('/api/pedidos/:id', (req, res) => {
    const pedidoIdParaDeletar = req.params.id;
    let pedidos = lerPedidos(); 

    const pedidoIndex = pedidos.findIndex(p => p.id === pedidoIdParaDeletar);

    if (pedidoIndex === -1) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    pedidos.splice(pedidoIndex, 1); 
    salvarPedidos(pedidos); 

    console.log('Pedido deletado:', pedidoIdParaDeletar);
    res.status(200).json({ message: 'Pedido deletado com sucesso!', idDeletado: pedidoIdParaDeletar });
});