const state = {
  allProducts: [],
  productsInCart: [],
  currentCategory: 'frutas',
  searchTerm: '',
};

const productContainer = document.getElementById('product-container');
const categoryBtns = document.querySelectorAll('.categoria-btn');
const cardTemplate = document.getElementById('product-card-template');

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
    productContainer.innerHTML = '<p class="no-results">Erro ao carregar produtos.</p>';
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
    });
  });

  productContainer.addEventListener('click', (e) => {
    const button = e.target.closest('[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const card = button.closest('.product');
    const productId = card.dataset.id;
    
    updateQuantity(productId, action === 'add' ? 1 : -1);
  });
}

function updateActiveCategoryButton() {
    const currentActiveBtn = document.querySelector('.categoria-btn.active');
    if (currentActiveBtn) {
        currentActiveBtn.classList.remove('active');
    }

    const newActiveBtn = document.querySelector(`.categoria-btn[data-category="${state.currentCategory}"]`);
    if (newActiveBtn) {
        newActiveBtn.classList.add('active');
    }
}

function updateQuantity(productId, delta) {
  const product = state.allProducts.find(p => p.id === productId);
  if (!product) return;

  product.quantity = Math.max(0, product.quantity + delta);
  filterAndDisplayProducts();
}

function filterAndDisplayProducts() {
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
  productContainer.innerHTML = '';

  if (productsToRender.length === 0) {
    productContainer.innerHTML = '<p class="no-results">Nenhum produto encontrado.</p>';
    return;
  }

  productsToRender.forEach(product => {
    const card = cardTemplate.content.cloneNode(true);
    
    const productDiv = card.querySelector('.product');
    productDiv.dataset.id = product.id;
    productDiv.style.backgroundColor = product.cor;

    card.querySelector('.product-image').src = product.imagem;
    card.querySelector('.product-image').alt = product.nome;
    card.querySelector('.product-title').textContent = product.nome;
    card.querySelector('.price').textContent = formatPrice(product.preco);
    card.querySelector('.quantity').textContent = product.quantity;

    productContainer.appendChild(card);
  });
}