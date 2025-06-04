// quando a pagina de perfil terminar de carregar
document.addEventListener('DOMContentLoaded', function() {
    // acha o botao de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) { 
		// se o botao existir
        logoutBtn.addEventListener('click', function() { // quando clicar nele
            if (confirm('deseja realmente sair?')) { // pergunta se tem certeza
                localStorage.removeItem('loggedInUser'); // tira o usuario da "sessao" (localStorage)
                window.location.href = "../index.html"; // volta pra pagina inicial
            }
        });
    }

    // animacao dos botoes com video (pra dar play/pause quando passa o mouse)
    document.querySelectorAll('.action-btn').forEach(button => {
        const video = button.querySelector('video');
        if (!video) return; // se nao tiver video, nao faz nada
        button.addEventListener('mouseenter', () => video.play().catch(e => {
		// nao faz nada se der erro no play 
		}));
        button.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
    });
    
    atualizarInfoUsuarioHeader(); // chama a funcao pra mostrar nome/email do usuario no header
    carregarPedidosRecentes(); // chama a funcao pra mostrar os ultimos pedidos
});

// funcao pra mostrar nome e email do usuario no header da pagina de perfil
function atualizarInfoUsuarioHeader() {
    const loggedInUserString = localStorage.getItem('loggedInUser'); // pega o usuario logado
    const headerComponent = document.querySelector('header-component'); // pega o componente do header

    // funcao interna pra tentar atualizar (porque o header pode demorar um pouco pra carregar)
    function tentarAtualizar() {
        if (headerComponent && headerComponent.shadowRoot) { 
			// se o header e o conteudo dele (shadowRoot) existirem
            const userInfoSection = headerComponent.shadowRoot.querySelector('.user-info'); 
			// acha a parte de info do usuario no header
            
            if (userInfoSection) { 
				// se achou a secao de info
                const userNameElement = userInfoSection.querySelector('h2'); // onde vai o nome
                const userEmailElement = userInfoSection.querySelector('p'); // onde vai o email

                if (loggedInUserString) { 
					// se tem usuario logado
                    try {
                        const loggedInUser = JSON.parse(loggedInUserString); // transforma o texto de volta em objeto
                        if (userNameElement) userNameElement.textContent = loggedInUser.fullName || "usuario";
                        if (userEmailElement) userEmailElement.textContent = loggedInUser.email || "email@exemplo.com";
                    } catch (e) { 
						// se der erro ao ler os dados
                        console.error("erro ao ler dados do usuario logado:", e);
                        if (userNameElement) userNameElement.textContent = "visitante";
                        if (userEmailElement) userEmailElement.textContent = "erro nos dados";
                    }
                } else {
					// se nao tem usuario logado
                    if (userNameElement) userNameElement.textContent = "visitante";
                    if (userEmailElement) userEmailElement.textContent = "faca login para ver seus dados";
                }
            }
            return true; // conseguiu tentar (ou nao precisava)
        }
        return false; // header nao estava pronto
    }

    // se nao conseguiu atualizar de primeira, tenta de novo depois 
    if (!tentarAtualizar()) {
        const intervalId = setInterval(() => {
            if (tentarAtualizar()) { // se conseguir
                clearInterval(intervalId); // para de tentar
            }
        }, 200); // tenta a cada 200 milissegundos
        setTimeout(() => clearInterval(intervalId), 3000); // para de tentar depois de 3 segundos (pra nao ficar tentando pra sempre "loop infinito")
    }
}

// funcao pra carregar e mostrar os ultimos pedidos feitos
function carregarPedidosRecentes() {
    const containerPedidos = document.getElementById('lista-pedidos-recentes'); // onde os pedidos vao aparecer
    if (!containerPedidos) {
        console.error('elemento "lista-pedidos-recentes" nao encontrado.');
        return;
    }
    containerPedidos.innerHTML = '<p>carregando seus ultimos pedidos...</p>'; // mensagem enquanto carrega

    const pedidosString = localStorage.getItem('pedidosLocais'); // pega os pedidos do localStorage
    const pedidos = JSON.parse(pedidosString) || []; // se nao tiver, usa lista vazia

    // ordena os pedidos pela data, do mais novo pro mais velho
    pedidos.sort(function(a, b) {
        return new Date(b.data) - new Date(a.data); // compara as datas
    });

    // se nao tiver nenhum pedido
    if (pedidos.length === 0) {
        containerPedidos.innerHTML = '<p>Você ainda não fez pedidos.</p>';
        return;
    }

    containerPedidos.innerHTML = ''; // limpa a mensagem de "carregando"

    const pedidosParaMostrar = pedidos.slice(0, 5); // pega so os 5 primeiros (mais recentes)

    // pra cada pedido que vai mostrar
    pedidosParaMostrar.forEach(function(pedido) {
        const pedidoCard = document.createElement('div'); // cria um card pro pedido
        pedidoCard.classList.add('order-card'); // adiciona a classe pra estilizar
        pedidoCard.dataset.pedidoId = pedido.id; // guarda o id do pedido no card

        // monta a lista de itens do pedido
        let itensHtml = '<ul class="lista-items">';
        if (pedido.itens && pedido.itens.length > 0) {
            pedido.itens.forEach(function(item) {
                itensHtml += `<li>${item.nome || 'item desconhecido'} (qtd: ${item.quantity || 0})</li>`;
            });
        } else {
            itensHtml += '<li>nenhum item neste pedido.</li>';
        }
        itensHtml += '</ul>';

        // formata a data, id e total pra mostrar na tela
        const dataFormatada = pedido.data ? new Date(pedido.data).toLocaleDateString('pt-BR') : 'data indisponivel';
        const idCurto = pedido.id ? pedido.id.slice(-5) : 'n/a'; // pega so os ultimos 5 chars do id
        const totalFormatado = typeof pedido.totalGeral === 'number' ? pedido.totalGeral.toFixed(2).replace('.', ',') : 'n/a';
        
        // define a classe css pro status do pedido (pra cor)
        let statusClass = 'status-pendente'; // padrao
        if (pedido.status && pedido.status.toLowerCase().includes('entregue') || pedido.status.toLowerCase().includes('confirmado')) {
            statusClass = 'status-entregue';
        } else if (pedido.status && pedido.status.toLowerCase().includes('cancelado')) {
            statusClass = 'status-cancelado';
        }

        // coloca as informacoes dentro do card do pedido
        pedidoCard.innerHTML = `
            <p>pedido #${idCurto} - r$ ${totalFormatado}</p>
            ${itensHtml}
            <p class="${statusClass}"> ${dataFormatada} - ${pedido.status || "status desconhecido"} </p>
        `;

        // cria o botao de cancelar pedido
        const btnDeletar = document.createElement('button');
        btnDeletar.textContent = 'cancelar pedido';
        // estilos pro botao 
        btnDeletar.style.marginTop = '10px';
        btnDeletar.style.padding = '5px 10px';
        btnDeletar.style.backgroundColor = '#f44336'; // vermelho
        btnDeletar.style.color = 'white';
        btnDeletar.style.border = 'none';
        btnDeletar.style.borderRadius = '4px';
        btnDeletar.style.cursor = 'pointer';

        // quando clicar no botao de cancelar
        btnDeletar.addEventListener('click', function() {
            if (confirm(`tem certeza que deseja cancelar o pedido #${idCurto}?`)) { 
				// pergunta se tem certeza
                let pedidosAtuais = JSON.parse(localStorage.getItem('pedidosLocais')) || []; 
				// pega a lista de novo
                
				// cria uma lista nova sem o pedido que foi cancelado
                pedidosAtuais = pedidosAtuais.filter(function(p) {
                    return p.id !== pedido.id; // mantem so os que tem id diferente
                });
                localStorage.setItem('pedidosLocais', JSON.stringify(pedidosAtuais)); // salva a lista atualizada
                
                alert('pedido cancelado localmente.');
                carregarPedidosRecentes(); // recarrega a lista de pedidos na tela pra atualizar
            }
        });

        pedidoCard.appendChild(btnDeletar); // adiciona o botao no card
        containerPedidos.appendChild(pedidoCard); // adiciona o card na tela
    });
}
