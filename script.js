const state = {
  allProducts: [],
  productsInCart: [],
  currentCategory: 'frutas',
  searchTerm: '',
};

const productContainer = document.getElementById('product-container');
const categoryNav = document.querySelector('.categoria-nav');
const categoryMenu = categoryNav ? categoryNav.querySelector('.categoria-menu') : null;
const categoryBtns = categoryNav ? categoryNav.querySelectorAll('.categoria-btn') : [];
const cardTemplate = document.getElementById('product-card-template');
const categoryHamburguer = categoryNav ? categoryNav.querySelector('.hamburguer') : null;

const normalizeText = (text) => text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
  try {
    const productsData = await fetchProducts();
    state.allProducts = productsData.map(p => ({ ...p, quantity: 0 }));
    loadCartFromLocalStorage();
    setupEventListeners();
    updateActiveCategoryButton();
    filterAndDisplayProducts();
  } catch (error) {
    if (productContainer) {
        productContainer.innerHTML = '<p class="no-results">Erro ao carregar produtos.</p>';
    }
  }
}

async function fetchProducts() {
  const response = await fetch('produtos.json');
  if (!response.ok) throw new Error('Falha ao carregar produtos.json');
  return response.json();
}

function setupEventListeners() {
  document.addEventListener('header-search', (e) => {
    state.searchTerm = e.detail.term;
    filterAndDisplayProducts();
  });

  if (categoryBtns && categoryBtns.length > 0) {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
        state.currentCategory = btn.dataset.category;
        updateActiveCategoryButton();
        filterAndDisplayProducts();
        if (categoryMenu && categoryMenu.classList.contains('show')) {
            categoryMenu.classList.remove('show');
        }
        });
    });
  }

  if (categoryHamburguer && categoryMenu) {
    categoryHamburguer.addEventListener('click', () => {
        categoryMenu.classList.toggle('show');
    });
  }

  if (productContainer) {
    productContainer.addEventListener('click', (e) => {
        const button = e.target.closest('[data-action]');
        if (!button) return;

        const action = button.dataset.action;
        const card = button.closest('.product');
        if (!card) return;
        const productId = card.dataset.id;
        
        updateQuantity(productId, action === 'add' ? 1 : -1);
    });
  }
}

function updateActiveCategoryButton() {
    if (!categoryNav) return;
    const currentActiveBtn = categoryNav.querySelector('.categoria-btn.active');
    if (currentActiveBtn) {
        currentActiveBtn.classList.remove('active');
    }

    const newActiveBtn = categoryNav.querySelector(`.categoria-btn[data-category="${state.currentCategory}"]`);
    if (newActiveBtn) {
        newActiveBtn.classList.add('active');
    }
}

function updateQuantity(productId, delta) {
  const product = state.allProducts.find(p => p.id === productId);
  if (!product) return;

  const oldQuantity = product.quantity;
  product.quantity = Math.max(0, product.quantity + delta);

  if (oldQuantity !== product.quantity) {
      if (productContainer) {
        const card = productContainer.querySelector(`.product[data-id="${productId}"]`);
        if (card) {
            const quantitySpan = card.querySelector('.quantity');
            if (quantitySpan) quantitySpan.textContent = product.quantity;
            if (delta !== 0 && quantitySpan) {
              quantitySpan.classList.add('updated');
              quantitySpan.addEventListener('animationend', () => {
                  quantitySpan.classList.remove('updated');
              }, { once: true });
            }
        }
      }
      saveCartToLocalStorage();
  }
}

function saveCartToLocalStorage() {
  const cartItems = state.allProducts
    .filter(product => product.quantity > 0)
    .map(product => ({
      id: product.id,
      nome: product.nome,
      preco: product.preco,
      imagem: product.imagem,
      quantity: product.quantity,
      cor: product.cor
    }));
  localStorage.setItem('cart', JSON.stringify(cartItems));
}

function loadCartFromLocalStorage() {
    const cartFromStorageString = localStorage.getItem('cart');
    const cartFromStorage = JSON.parse(cartFromStorageString) || [];
    if (state.allProducts && state.allProducts.length > 0) {
        cartFromStorage.forEach(cartItem => {
            const productInState = state.allProducts.find(p => p.id === cartItem.id);
            if (productInState) {
                productInState.quantity = cartItem.quantity;
            }
        });
    }
}

function filterAndDisplayProducts() {
  if (!productContainer) return;
  let filteredProducts = state.allProducts;

  if (state.currentCategory !== 'todos') {
    filteredProducts = filteredProducts.filter(p => p.categoria === state.currentCategory);
  }

  if (state.searchTerm.trim() !== '') {
    const normalizedSearch = normalizeText(state.searchTerm);
    filteredProducts = filteredProducts.filter(p => normalizeText(p.nome).includes(normalizedSearch));
  }

  renderProducts(filteredProducts);
}

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

function renderProducts(productsToRender) {
  if (!productContainer || !cardTemplate) return;
  productContainer.innerHTML = '';

  if (productsToRender.length === 0) {
    productContainer.innerHTML = '<p class="no-results">Nenhum produto encontrado.</p>';
    return;
  }

  productsToRender.forEach((product, index) => {
    const card = cardTemplate.content.cloneNode(true);
    
    const productDiv = card.querySelector('.product');
    if (productDiv) {
        productDiv.dataset.id = product.id;
        if (product.cor) { 
            productDiv.style.backgroundColor = product.cor;
        }
        productDiv.style.animationDelay = `${index * 0.07}s`;
    }

    const productImageEl = card.querySelector('.product-image');
    if (productImageEl) {
        productImageEl.src = product.imagem;
        productImageEl.alt = product.nome;
    }
    
    const productTitleEl = card.querySelector('.product-title');
    if (productTitleEl) productTitleEl.textContent = product.nome;
    
    const priceEl = card.querySelector('.price');
    if (priceEl) priceEl.textContent = formatPrice(product.preco);

    const quantityEl = card.querySelector('.quantity');
    if (quantityEl) quantityEl.textContent = product.quantity;

    productContainer.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');

    if (!cartItemsEl || !cartTotalEl) {
        return;
    }

    const cartForDisplayString = localStorage.getItem('cart');
    const cartForDisplay = JSON.parse(cartForDisplayString) || [];

    if (cartForDisplay.length === 0) {
        cartItemsEl.innerHTML = '<p>Seu carrinho está vazio.</p>';
        if(cartTotalEl) cartTotalEl.textContent = '';
        return;
    }

    let total = 0;
    cartItemsEl.innerHTML = '';

    cartForDisplay.forEach(item => {
        if (item && item.preco && typeof item.preco.valor === 'number' && typeof item.quantity === 'number') {
            const subtotal = item.preco.valor * item.quantity;
            total += subtotal;

            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            itemEl.innerHTML = `
                <div class="cart-item-details">
                    <img src="/${item.imagem}" alt="${item.nome}" class="cart-item-image">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.nome}</span>
                        <span class="cart-item-quantity-price">${item.quantity} × ${formatPrice(item.preco)}</span>
                    </div>
                </div>
                <span class="cart-item-subtotal">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            `;
            cartItemsEl.appendChild(itemEl);
        }
    });

    if(cartTotalEl) cartTotalEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    
    const cartSection = document.querySelector('.cart-section');
    if (cartSection && !document.getElementById('checkout-btn')) {
        const checkoutButtonContainer = document.createElement('div');
        checkoutButtonContainer.style.textAlign = 'right';
        checkoutButtonContainer.style.marginTop = '20px';
        
        const checkoutButton = document.createElement('button');
        checkoutButton.textContent = 'Finalizar Compra';
        checkoutButton.id = 'checkout-btn';
        checkoutButton.classList.add('submit-btn'); 
        checkoutButton.style.padding = '10px 20px';
        checkoutButton.style.fontSize = '1.2rem';
        checkoutButton.style.cursor = 'pointer';
        checkoutButton.style.width = 'auto'; 
        
        checkoutButton.onclick = () => {
            if (window.router) {
                window.router.goTo('/checkout');
            } else {
                window.location.href = '/pages/checkout.html';
            }
        };
        
        checkoutButtonContainer.appendChild(checkoutButton);
        cartSection.appendChild(checkoutButtonContainer);
    }
});