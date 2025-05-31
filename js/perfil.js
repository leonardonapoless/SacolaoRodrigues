document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if(confirm('Deseja realmente sair?')) {
                window.location.href = "../index.html";
            }
        });
    }
    
    const cards = document.querySelectorAll('.order-card, .action-btn');
    if (cards) {
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
            });
        });
    }

    const videoButtons = document.querySelectorAll('.action-btn');
    if (videoButtons) {
        videoButtons.forEach(button => {
            const video = button.querySelector('video');
            if (!video) return;

            button.addEventListener('mouseenter', () => {
                video.play().catch(e => {});
            });

            button.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });
    }
    
    carregarPedidosRecentes();
});
async function carregarPedidosRecentes() {
    const containerPedidos = document.getElementById('lista-pedidos-recentes');
    if (!containerPedidos) {
        console.error('Elemento "lista-pedidos-recentes" não encontrado.');
        return;
    }

    containerPedidos.innerHTML = '<p>Carregando seus últimos pedidos...</p>';

    try {
        const response = await fetch('http://localhost:3000/api/pedidos');
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }
        const pedidos = await response.json();

        if (pedidos.length === 0) {
            containerPedidos.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
            return;
        }

        containerPedidos.innerHTML = '';

        pedidos.forEach(pedido => {
            const pedidoCard = document.createElement('div');
            pedidoCard.classList.add('order-card');
            // Guardar o ID completo do pedido no elemento para fácil acesso
            pedidoCard.dataset.pedidoId = pedido.id;


            let itensHtml = '<ul class="lista-items">';
            if (pedido.itens && Array.isArray(pedido.itens)) {
                pedido.itens.forEach(item => {
                    itensHtml += `<li>${item.nome || 'Item desconhecido'} (Qtd: ${item.quantity || 0})</li>`;
                });
            } else {
                itensHtml += '<li>Informações dos itens não disponíveis.</li>';
            }
            itensHtml += '</ul>';
            
            const dataPedido = pedido.data ? new Date(pedido.data).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric'
            }) : 'Data Indisponível';

            const pedidoIdDisplay = pedido.id ? pedido.id.substring(pedido.id.indexOf('_') + 1).substring(0, 5) : 'N/A'; // Apenas uma parte para exibição
            const totalGeralDisplay = typeof pedido.totalGeral === 'number' ? parseFloat(pedido.totalGeral).toFixed(2).replace('.', ',') : 'N/A';
            const statusPedido = pedido.status || "Status Desconhecido";
            let statusClass = 'status-pendente';
            if (statusPedido.toLowerCase() === 'entregue') {
                statusClass = 'status-entregue';
            } else if (statusPedido.toLowerCase() === 'cancelado') {
                statusClass = 'status-cancelado';
            }

            // Botão de Deletar
            const btnDeletar = document.createElement('button');
            btnDeletar.textContent = 'Cancelar Pedido'; // Ou "Deletar Pedido"
            btnDeletar.classList.add('btn-deletar-pedido'); // Adicione uma classe para estilização
            btnDeletar.style.marginTop = '10px'; // Estilo básico
            btnDeletar.style.padding = '5px 10px';
            btnDeletar.style.backgroundColor = '#f44336'; // Vermelho
            btnDeletar.style.color = 'white';
            btnDeletar.style.border = 'none';
            btnDeletar.style.borderRadius = '4px';
            btnDeletar.style.cursor = 'pointer';

            btnDeletar.onclick = async function() {
                const idCompletoPedido = pedido.id;
                if (confirm(`Tem certeza que deseja cancelar o pedido #${pedidoIdDisplay}?`)) {
                    try {
                        const deleteResponse = await fetch(`http://localhost:3000/api/pedidos/${idCompletoPedido}`, {
                            method: 'DELETE',
                        });
                        const resultadoDelete = await deleteResponse.json();
                        if (deleteResponse.ok) {
                            alert(resultadoDelete.message);            
                            pedidoCard.remove();                         
                        } else {
                            alert(`Erro ao deletar pedido: ${resultadoDelete.message}`);
                        }
                    } catch (err) {
                        console.error('Erro ao tentar deletar pedido:', err);
                        alert('Falha ao comunicar com o servidor para deletar o pedido.');
                    }
                }
            };

            pedidoCard.innerHTML = `
                <p>Pedido #${pedidoIdDisplay} - R$ ${totalGeralDisplay}</p>
                ${itensHtml}
                <p class="${statusClass}">
                    ${dataPedido} - ${statusPedido}
                </p>
            `;
            pedidoCard.appendChild(btnDeletar);
            containerPedidos.appendChild(pedidoCard);
        });

    } catch (error) {
        console.error("Erro ao carregar pedidos recentes:", error);
        containerPedidos.innerHTML = `<p>Não foi possível carregar seus pedidos: ${error.message}. Verifique se o servidor backend está rodando.</p>`;
    }
}