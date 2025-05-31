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
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Produtos no carrinho para checkout:', cart);

    const orderSummaryItemsEl = document.getElementById('order-summary-items');
    const orderSummaryTotalEl = document.getElementById('order-summary-total');
    const customerInfoSection = document.querySelector('.customer-info-section');
    const checkoutForm = document.getElementById('checkout-form');

    if (!orderSummaryItemsEl || !orderSummaryTotalEl || !customerInfoSection || !checkoutForm) {
        if(orderSummaryItemsEl) orderSummaryItemsEl.innerHTML = '<p>Erro ao carregar a página de checkout. Tente novamente.</p>';
        return;
    }

    if (cart.length === 0) {
        orderSummaryItemsEl.innerHTML = '<p style="text-align: center; padding: 20px 0;">Seu carrinho está vazio.</p>';
        orderSummaryTotalEl.innerHTML = '';
        customerInfoSection.style.display = 'none';
        return;
    }

    let summaryHTML = '<ul>';
    let totalGeral = 0;

    cart.forEach(item => {
        const subtotal = item.preco.valor * item.quantity;
        totalGeral += subtotal;
        summaryHTML += `
            <li>
                <span class="item-name">${item.nome} (${item.quantity} &times; ${formatPrice(item.preco)})</span>
                <span class="item-subtotal">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            </li>`;
    });
    summaryHTML += '</ul>';

    orderSummaryItemsEl.innerHTML = summaryHTML;
    orderSummaryTotalEl.innerHTML = `<h3>Total: R$ ${totalGeral.toFixed(2).replace('.', ',')}</h3>`;

    checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(checkoutForm);
        const orderData = Object.fromEntries(formData.entries());
        
        console.log('Dados do Pedido:', orderData);
        console.log('Itens do Carrinho:', cart);
        
        alert('Pedido confirmado com sucesso!');
        localStorage.removeItem('cart');
        window.location.href = '/index.html';
    });
});