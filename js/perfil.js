document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) { 
        logoutBtn.addEventListener('click', function() {
            if (confirm('deseja realmente sair?')) {
                localStorage.removeItem('loggedInUser');
                window.location.href = "../index.html";
            }
        });
    }

    atualizarInfoUsuarioHeader();
    carregarPedidosRecentes();
    inicializarLottiePerfil();
    inicializarLottieUsuario();
});

function atualizarInfoUsuarioHeader() {
    const loggedInUserString = localStorage.getItem('loggedInUser');
    const headerComponent = document.querySelector('header-component');
    
    function tentarAtualizar() {
        if (headerComponent && headerComponent.shadowRoot) { 
            const userInfoSection = headerComponent.shadowRoot.querySelector('.user-info');
            
            if (userInfoSection) { 
                const userNameElement = userInfoSection.querySelector('h2');
                const userEmailElement = userInfoSection.querySelector('p');

                if (loggedInUserString) { 
                    try {
                        const loggedInUser = JSON.parse(loggedInUserString);
                        if (userNameElement) {
                            userNameElement.textContent = loggedInUser.fullName || "usuario";
                            console.log('Nome atualizado:', userNameElement.textContent);
                        }
                        if (userEmailElement) {
                            userEmailElement.textContent = loggedInUser.email || "email@exemplo.com";
                            console.log('Email atualizado:', userEmailElement.textContent);
                        }
                    } catch (e) { 
                        console.error("erro ao ler dados do usuario logado:", e);
                        if (userNameElement) userNameElement.textContent = "visitante";
                        if (userEmailElement) userEmailElement.textContent = "erro nos dados";
                    }
                } else {
                    if (userNameElement) userNameElement.textContent = "visitante";
                    if (userEmailElement) userEmailElement.textContent = "faca login para ver seus dados";
                }
            }
            return true;
        }
        return false;
    }

    if (!tentarAtualizar()) {
        const intervalId = setInterval(() => {
            if (tentarAtualizar()) {
                clearInterval(intervalId);
            }
        }, 200);
        setTimeout(() => clearInterval(intervalId), 3000);
    }
}

function carregarPedidosRecentes() {
    const containerPedidos = document.getElementById('lista-pedidos-recentes');
    if (!containerPedidos) {
        console.error('elemento "lista-pedidos-recentes" nao encontrado.');
        return;
    }
    containerPedidos.innerHTML = '<p>carregando seus ultimos pedidos...</p>';

    const pedidosString = localStorage.getItem('pedidosLocais');
    const pedidos = JSON.parse(pedidosString) || [];

    pedidos.sort(function(a, b) {
        return new Date(b.data) - new Date(a.data);
    });

    if (pedidos.length === 0) {
        containerPedidos.innerHTML = '<p>Você ainda não fez pedidos.</p>';
        return;
    }

    containerPedidos.innerHTML = '';

    const pedidosParaMostrar = pedidos.slice(0, 5);

    pedidosParaMostrar.forEach(function(pedido, index) {
        const pedidoCard = document.createElement('div');
        pedidoCard.classList.add('order-card');
        pedidoCard.dataset.pedidoId = pedido.id;
        
        pedidoCard.style.animationDelay = `${0.1 + (index * 0.05)}s`;

        let itensHtml = '<ul class="lista-items">';
        if (pedido.itens && pedido.itens.length > 0) {
            pedido.itens.forEach(function(item) {
                itensHtml += `<li>${item.nome || 'item desconhecido'} (qtd: ${item.quantity || 0})</li>`;
            });
        } else {
            itensHtml += '<li>nenhum item neste pedido.</li>';
        }
        itensHtml += '</ul>';

        const dataFormatada = pedido.data ? new Date(pedido.data).toLocaleDateString('pt-BR') : 'data indisponivel';
        const idCurto = pedido.id ? pedido.id.slice(-5) : 'n/a';
        const totalFormatado = typeof pedido.totalGeral === 'number' ? pedido.totalGeral.toFixed(2).replace('.', ',') : 'n/a';
        
        let statusClass = 'status-pendente';
        if (pedido.status && pedido.status.toLowerCase().includes('entregue') || pedido.status.toLowerCase().includes('confirmado')) {
            statusClass = 'status-entregue';
        } else if (pedido.status && pedido.status.toLowerCase().includes('cancelado')) {
            statusClass = 'status-cancelado';
        }

        pedidoCard.innerHTML = `
            <p>pedido #${idCurto} - r$ ${totalFormatado}</p>
            ${itensHtml}
            <p class="${statusClass}"> ${dataFormatada} - ${pedido.status || "status desconhecido"} </p>
        `;

        const btnDeletar = document.createElement('button');
        btnDeletar.textContent = 'cancelar pedido';
        btnDeletar.style.marginTop = '10px';
        btnDeletar.style.padding = '5px 10px';
        btnDeletar.style.backgroundColor = '#f44336';
        btnDeletar.style.color = 'white';
        btnDeletar.style.border = 'none';
        btnDeletar.style.borderRadius = '4px';
        btnDeletar.style.cursor = 'pointer';

        btnDeletar.addEventListener('click', function() {
            if (confirm(`tem certeza que deseja cancelar o pedido #${idCurto}?`)) { 
                let pedidosAtuais = JSON.parse(localStorage.getItem('pedidosLocais')) || [];
                
                pedidosAtuais = pedidosAtuais.filter(function(p) {
                    return p.id !== pedido.id;
                });
                localStorage.setItem('pedidosLocais', JSON.stringify(pedidosAtuais));
                
                alert('pedido cancelado.');
                carregarPedidosRecentes();
            }
        });

        pedidoCard.appendChild(btnDeletar);
        containerPedidos.appendChild(pedidoCard);
    });
}

function inicializarLottiePerfil() {
    if (typeof lottie === 'undefined') {
        console.warn('Lottie library not loaded. Profile animations will not work.');
        return;
    }

    const initializeLottieAnimation = (elementId, animationPath, speed = 1.5, loopOnHover = false) => {
        const element = document.querySelector(elementId);
        const button = element ? element.closest('.action-btn') : null;
        
        console.log(`Inicializando Lottie: ${elementId}, Path: ${animationPath}`);
        
        if (element && button) {
            try {
                const animation = lottie.loadAnimation({
                    container: element,
                    renderer: 'svg',
                    loop: false,
                    autoplay: false,
                    path: animationPath
                });

                animation.setSpeed(speed);
                animation.goToAndStop(0, true);

                console.log(`Animação Lottie carregada com sucesso para: ${elementId}`);

                button.addEventListener('mouseenter', () => {
                    console.log(`Hover iniciado em: ${elementId}`);
                    if (loopOnHover) {
                        animation.setLoop(true);
                        animation.play();
                    } else {
                        animation.play();
                    }
                });
                
                button.addEventListener('mouseleave', () => {
                    console.log(`Hover finalizado em: ${elementId}`);
                    if (loopOnHover) {
                        animation.setLoop(false);
                        animation.stop();
                        animation.goToAndStop(0, true);
                    } else {
                        animation.stop();
                        animation.goToAndStop(0, true);
                    }
                });
            } catch (error) {
                console.error(`Erro ao carregar animação Lottie para ${elementId}:`, error);
            }
        } else {
            console.warn(`Elemento não encontrado: ${elementId}`);
        }
    };

    initializeLottieAnimation('#list-lottie-perfil', '/assets/images/animatedicons/list-icon.json', 1.5, false);
    initializeLottieAnimation('#ofertas-lottie-perfil', '/assets/images/animatedicons/ofertas.json', 1.5, true);
    initializeLottieAnimation('#editar-lottie-perfil', '/assets/images/animatedicons/editar.json', 1.5, true);
    initializeLottieAnimation('#ajustes-lottie-perfil', '/assets/images/animatedicons/editar.json', 1.5, false);
    initializeLottieAnimation('#logout-lottie-perfil', '/assets/images/animatedicons/login-in.json', 1.5, false);
}

function inicializarLottieUsuario() {
    const headerComponent = document.querySelector('header-component');
    
    function tentarInicializarLottie() {
        if (headerComponent && headerComponent.shadowRoot) {
            const userProfileLottie = headerComponent.shadowRoot.querySelector('#user-profile-lottie');
            if (userProfileLottie) {
                console.log('Inicializando Lottie do usuário no header');
                initializeLottieAnimation('#user-profile-lottie', '/assets/images/animatedicons/user-profile-pic.json', 1.0, false);
                return true;
            }
        }
        return false;
    }
    
    if (!tentarInicializarLottie()) {
        const intervalId = setInterval(() => {
            if (tentarInicializarLottie()) {
                clearInterval(intervalId);
            }
        }, 200);
        setTimeout(() => clearInterval(intervalId), 3000);
    }
}
