const state = {
  allProducts: [],
  productsInCart: [],
  currentCategory: 'todos',
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
    setupEventListeners();
    updateActiveCategoryButton();
    filterAndDisplayProducts();
  } catch (error) {
    if (productContainer) {
        productContainer.innerHTML = '<p class="no-results">Erro ao carregar produtos.</p>';
    }
    console.error(error);
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
    const currentActiveBtn = categoryNav ? categoryNav.querySelector('.categoria-btn.active') : null;
    if (currentActiveBtn) {
        currentActiveBtn.classList.remove('active');
    }

    const newActiveBtn = categoryNav ? categoryNav.querySelector(`.categoria-btn[data-category="${state.currentCategory}"]`) : null;
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
      const card = productContainer.querySelector(`.product[data-id="${productId}"]`);
      if (card) {
          const quantitySpan = card.querySelector('.quantity');
          quantitySpan.textContent = product.quantity;
          if (delta !== 0) {
            quantitySpan.classList.add('updated');
            quantitySpan.addEventListener('animationend', () => {
                quantitySpan.classList.remove('updated');
                quantitySpan.style.transform = 'scale(1)';
            }, { once: true });
          }
      }
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
    const basePrice = `R$ ${priceObject.valor.toFixed(2).replace('.', ',')}`;
    const unitsWithSlash = ['kg', 'un', 'maço'];

    if (unitsWithSlash.includes(priceObject.unidade)) {
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
    productDiv.dataset.id = product.id;
    if (product.cor) { 
        productDiv.style.backgroundColor = product.cor;
    }
    productDiv.style.animationDelay = `${index * 0.07}s`;


    card.querySelector('.product-image').src = product.imagem;
    card.querySelector('.product-image').alt = product.nome;
    card.querySelector('.product-title').textContent = product.nome;
    card.querySelector('.price').textContent = formatPrice(product.preco);
    card.querySelector('.quantity').textContent = product.quantity;

    productContainer.appendChild(card);
  });
}


document.addEventListener('DOMContentLoaded', () => {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<p>Seu carrinho está vazio.</p>';
        cartTotalEl.textContent = '';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const itemEl = document.createElement('div');
        itemEl.classList.add('cart-item');
        itemEl.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span>${item.quantity} × R$ ${item.price.toFixed(2)}</span>
            <span>= R$ ${subtotal.toFixed(2)}</span>
        `;
        cartItemsEl.appendChild(itemEl);
    });

    cartTotalEl.textContent = `Total: R$ ${total.toFixed(2)}`;
});