function formatPrice(priceObject) {
    if (typeof priceObject?.valor !== 'number' || typeof priceObject?.unidade !== 'string') {
        return "Preço Indisponível";
    }
    const basePrice = `R$ ${priceObject.valor.toFixed(2).replace('.', ',')}`;
    const unitsWithSlash = ['kg', 'un', 'maço'];
    if (unitsWithSlash.includes(priceObject.unidade.toLowerCase())) {
        return `${basePrice}/${priceObject.unidade}`;
    } else {
        return `${basePrice} ${priceObject.unidade}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Checkout page loaded.");
    const cartString = localStorage.getItem('cart');
    console.log("Cart string from localStorage:", cartString);

    const cart = JSON.parse(cartString) || [];
    console.log('Produtos no carrinho para checkout:', cart);

    const orderSummaryItemsEl = document.getElementById('order-summary-items');
    const orderSummaryTotalEl = document.getElementById('order-summary-total');
    const customerInfoSection = document.querySelector('.customer-info-section');
    const checkoutForm = document.getElementById('checkout-form');

    let totalGeral = 0;

    if (!orderSummaryItemsEl || !orderSummaryTotalEl || !customerInfoSection || !checkoutForm) {
        console.error('Um ou mais elementos do DOM do checkout não foram encontrados.');
        if(orderSummaryItemsEl) orderSummaryItemsEl.innerHTML = '<p>Erro ao carregar a página de checkout. Tente novamente.</p>';
        return;
    }

    if (cart.length === 0) {
        console.log("Cart is empty, displaying empty message.");
        orderSummaryItemsEl.innerHTML = '<p style="text-align: center; padding: 20px 0;">Seu carrinho está vazio. Não há nada para finalizar.</p>';
        orderSummaryTotalEl.innerHTML = '';
        customerInfoSection.style.display = 'none';
        return;
    }

    console.log("Cart has items, building summary...");
    let summaryHTML = '<ul>';

    cart.forEach(item => {
        if (item && item.preco && typeof item.preco.valor === 'number' && typeof item.quantity === 'number') {
            const subtotal = item.preco.valor * item.quantity;
            totalGeral += subtotal;
            summaryHTML += `
                <li>
                    <span class="item-name">${item.nome} (${item.quantity} &times; ${formatPrice(item.preco)})</span>
                    <span class="item-subtotal">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                </li>`;
        } else {
            console.warn("Item inválido no carrinho, pulando:", item);
        }
    });
    summaryHTML += '</ul>';

    orderSummaryItemsEl.innerHTML = summaryHTML;
    orderSummaryTotalEl.innerHTML = `<h3>Total: R$ ${totalGeral.toFixed(2).replace('.', ',')}</h3>`;

    checkoutForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(checkoutForm);
        const clienteInfo = Object.fromEntries(formData.entries());
        
        const pedidoParaEnviar = {
            clienteInfo: clienteInfo,
            itens: cart, 
            totalGeral: totalGeral 
        };

        console.log('Enviando pedido para o backend:', pedidoParaEnviar);

        try {
            const response = await fetch('http://localhost:3000/api/pedidos', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedidoParaEnviar),
            });

            const resultado = await response.json();
            console.log("Resposta completa do backend:", resultado);
            console.log("Status da resposta do backend:", response.status, "Response OK:", response.ok);


            if (response.ok) {
                let pedidoIdInfo = "N/A";
                if (resultado && resultado.pedido && resultado.pedido.id) {
                    pedidoIdInfo = resultado.pedido.id;
                } else {
                    console.warn("ID do pedido não encontrado na resposta do backend, mas a resposta foi OK. Resposta:", resultado);
                }
                alert(`Pedido ${pedidoIdInfo} confirmado com sucesso!`);
                localStorage.removeItem('cart');
                console.log("Redirecionando para /pages/perfil.html");
                window.location.href = '/pages/perfil.html'; 
            } else {
                console.error("Erro ao enviar pedido - backend respondeu com status não OK:", resultado);
                alert(`Erro ao enviar pedido: ${resultado.message || `Status ${response.status}`}`);
            }
        } catch (error) {
            console.error('Erro ao conectar com o backend ou processar resposta:', error);
            alert('Não foi possível conectar ao servidor ou processar a resposta do pedido. Verifique sua conexão ou tente mais tarde.');
        }
    });
});