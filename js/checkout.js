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
    const cartString = localStorage.getItem('cart');
    const cart = JSON.parse(cartString) || [];

    const orderSummaryItemsEl = document.getElementById('order-summary-items');
    const orderSummaryTotalEl = document.getElementById('order-summary-total');
    const customerInfoSection = document.querySelector('.customer-info-section');
    const checkoutForm = document.getElementById('checkout-form');

    let totalGeral = 0;

    if (!orderSummaryItemsEl || !orderSummaryTotalEl || !customerInfoSection || !checkoutForm) {
        if(orderSummaryItemsEl) orderSummaryItemsEl.innerHTML = '<p>Erro ao carregar a página de checkout. Tente novamente.</p>';
        return;
    }

    if (cart.length === 0) {
        orderSummaryItemsEl.innerHTML = '<p style="text-align: center; padding: 20px 0;">Seu carrinho está vazio. Não há nada para finalizar.</p>';
        orderSummaryTotalEl.innerHTML = '';
        customerInfoSection.style.display = 'none';
        return;
    }

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
        }
    });
    summaryHTML += '</ul>';

    orderSummaryItemsEl.innerHTML = summaryHTML;
    orderSummaryTotalEl.innerHTML = `<h3>Total: R$ ${totalGeral.toFixed(2).replace('.', ',')}</h3>`;

    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(checkoutForm);
        const clienteInfo = Object.fromEntries(formData.entries());
        
        const pedidoParaEnviar = {
            clienteInfo: clienteInfo,
            itens: cart, 
            totalGeral: totalGeral 
        };

        const pedidosLocaisString = localStorage.getItem('pedidosLocais');
        const pedidosLocais = JSON.parse(pedidosLocaisString) || [];

        pedidoParaEnviar.id = `pedido_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        pedidoParaEnviar.data = new Date().toISOString();
        pedidoParaEnviar.status = "Confirmado";

        pedidosLocais.push(pedidoParaEnviar);
        localStorage.setItem('pedidosLocais', JSON.stringify(pedidosLocais));

        alert(`Pedido ${pedidoParaEnviar.id} confirmado com sucesso (localmente)!`);
        localStorage.removeItem('cart');
        window.location.href = '/pages/perfil.html';
    });
});
