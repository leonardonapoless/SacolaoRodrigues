function formatPrice(priceObject) {
  if (
    typeof priceObject?.valor !== "number" ||
    typeof priceObject?.unidade !== "string"
  ) {
    return "Preço Indisponível";
  }
  const basePrice = `R$ ${priceObject.valor.toFixed(2).replace(".", ",")}`;
  const unitsWithSlash = ["kg", "un", "maço"];
  if (unitsWithSlash.includes(priceObject.unidade.toLowerCase())) {
    return `${basePrice}/${priceObject.unidade}`;
  } else {
    return `${basePrice} ${priceObject.unidade}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cartString = localStorage.getItem("cart");
  const cart = JSON.parse(cartString) || [];

  const orderSummaryItemsEl = document.getElementById("order-summary-items");
  const orderSummaryTotalEl = document.getElementById("order-summary-total");
  const customerInfoSection = document.querySelector(".customer-info-section");
  const checkoutForm = document.getElementById("checkout-form");
  
  const cartLottieIcon = document.getElementById("cart-lottie-icon");
  if (cartLottieIcon && typeof lottie !== 'undefined') {
    lottie.loadAnimation({
      container: cartLottieIcon,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/images/animatedicons/cart.json'
    });
  }
  
  const deliveryLottieIcon = document.getElementById("delivery-lottie-icon");
  if (deliveryLottieIcon && typeof lottie !== 'undefined') {
    lottie.loadAnimation({
      container: deliveryLottieIcon,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/images/animatedicons/entregaepagamento.json'
    });
  }

  let totalGeral = 0;

  if (
    !orderSummaryItemsEl ||
    !orderSummaryTotalEl ||
    !customerInfoSection ||
    !checkoutForm
  ) {
    if (orderSummaryItemsEl)
      orderSummaryItemsEl.innerHTML =
        "<p>Erro ao carregar a página de checkout. Tente novamente.</p>";
    return;
  }

  if (cart.length === 0) {
    orderSummaryItemsEl.innerHTML =
      '<div class="empty-cart-message">Seu carrinho está vazio.</div>';
    orderSummaryTotalEl.innerHTML = "";
    customerInfoSection.style.display = "none";
    
    const checkoutMainContent = document.querySelector('.checkout-main-content');
    if (checkoutMainContent) {
      checkoutMainContent.classList.add('empty-cart');
    }
    return;
  }

  let summaryHTML = "<ul>";

  cart.forEach((item, index) => {
    if (
      item &&
      item.preco &&
      typeof item.preco.valor === "number" &&
      typeof item.quantity === "number"
    ) {
      const subtotal = item.preco.valor * item.quantity;
      totalGeral += subtotal;
      summaryHTML += `
                <li>
                    <span class="item-name">${item.nome} (${item.quantity} &times; ${formatPrice(item.preco)})</span>
                    <span class="item-subtotal">R$ ${subtotal.toFixed(2).replace(".", ",")}</span>
                    <button class="remove-item-btn" onclick="removeItemFromCart(${index})" title="Remover item">
                        <i class="fas fa-times"></i>
                    </button>
                </li>`;
    }
  });
  summaryHTML += "</ul>";

  orderSummaryItemsEl.innerHTML = summaryHTML;
  orderSummaryTotalEl.innerHTML = `<h3>Total: R$ ${totalGeral.toFixed(2).replace(".", ",")}</h3>`;

  window.removeItemFromCart = function(index) {
    if (confirm('Tem certeza que deseja remover este item do carrinho?')) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      
      updateOrderSummary();
    }
  };

  function updateOrderSummary() {
    const checkoutMainContent = document.querySelector('.checkout-main-content');
    
    if (cart.length === 0) {
      orderSummaryItemsEl.innerHTML = 
        '<div class="empty-cart-message">Seu carrinho está vazio.<br>Não há nada para finalizar.</div>';
      orderSummaryTotalEl.innerHTML = "";
      customerInfoSection.style.display = "none";
      
      if (checkoutMainContent) {
        checkoutMainContent.classList.add('empty-cart');
      }
      return;
    }
    
    if (checkoutMainContent) {
      checkoutMainContent.classList.remove('empty-cart');
    }

    let summaryHTML = "<ul>";
    let newTotalGeral = 0;

    cart.forEach((item, index) => {
      if (
        item &&
        item.preco &&
        typeof item.preco.valor === "number" &&
        typeof item.quantity === "number"
      ) {
        const subtotal = item.preco.valor * item.quantity;
        newTotalGeral += subtotal;
        summaryHTML += `
                  <li>
                      <span class="item-name">${item.nome} (${item.quantity} &times; ${formatPrice(item.preco)})</span>
                      <span class="item-subtotal">R$ ${subtotal.toFixed(2).replace(".", ",")}</span>
                      <button class="remove-item-btn" onclick="removeItemFromCart(${index})" title="Remover item">
                          <i class="fas fa-times"></i>
                      </button>
                  </li>`;
      }
    });
    summaryHTML += "</ul>";

    orderSummaryItemsEl.innerHTML = summaryHTML;
    orderSummaryTotalEl.innerHTML = `<h3>Total: R$ ${newTotalGeral.toFixed(2).replace(".", ",")}</h3>`;
    totalGeral = newTotalGeral;
  }

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(checkoutForm);
    const clienteInfo = Object.fromEntries(formData.entries());

    const pedidoParaEnviar = {
      clienteInfo: clienteInfo,
      itens: cart,
      totalGeral: totalGeral,
    };

    const pedidosLocaisString = localStorage.getItem("pedidosLocais");
    const pedidosLocais = JSON.parse(pedidosLocaisString) || [];

    pedidoParaEnviar.id = `pedido_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    pedidoParaEnviar.data = new Date().toISOString();
    pedidoParaEnviar.status = "Confirmado";

    pedidosLocais.push(pedidoParaEnviar);
    localStorage.setItem("pedidosLocais", JSON.stringify(pedidosLocais));

    alert(`Pedido ${pedidoParaEnviar.id} confirmado com sucesso (localmente)!`);
    localStorage.removeItem("cart");
    window.location.href = "/pages/perfil.html";
  });
});