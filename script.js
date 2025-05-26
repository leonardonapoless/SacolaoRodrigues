let produtos = {};
let categoriaAtual = 'frutas';
let searchTerm = '';

const container   = document.getElementById('product-container');
const carrinhoEl  = document.getElementById('carrinho');
const listaCarrinho = document.getElementById('lista-carrinho');
const categoryBtns = document.querySelectorAll('.categoria-btn');

document.addEventListener('DOMContentLoaded', () => {
  fetch('produtos.json')
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(json => {
      produtos = json;
      setupCategories();
      renderProducts(categoriaAtual);
    })
    .catch(() => {
      container.innerHTML = '<p class="no-results">Erro ao carregar produtos.</p>';
    });


  document.addEventListener('header-search', e => {
    searchTerm = e.detail.term;
    renderProducts(categoriaAtual);
  });

  container.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const match = btn.dataset.action;  
    const idx    = btn.dataset.index;
    if (!match || idx == null) return;
    alterarQuantidade(categoriaAtual, Number(idx), match === 'add' ? 1 : -1);
  });
});

function setupCategories() {
  categoryBtns.forEach(btn => {
    const cat = btn.textContent.toLowerCase();
    btn.classList.toggle('active', cat === categoriaAtual);
    btn.addEventListener('click', () => {
      categoriaAtual = cat;
      searchTerm = '';
      document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      carrinhoEl.style.display = 'none';
      renderProducts(cat);
    });
  });
}

function renderProducts(cat) {
  container.innerHTML = '';
  const list = produtos[cat] || [];
  const termos = searchTerm.split(/\s+/).filter(Boolean);
  const filtered = list.filter(p =>
    termos.every(t => p.nome.toLowerCase().includes(t))
  );

  const toShow = termos.length ? filtered : list;

  if (!toShow.length) {
    container.innerHTML = '<p class="no-results">Nenhum produto encontrado.</p>';
    return;
  }

  toShow.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product';
    card.style.backgroundColor = p.cor;
    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <div class="product-title">${p.nome}</div>
      <div class="price">${p.preco}</div>
      <div class="quantity-controls">
        <button data-action="sub" data-index="${i}">-</button>
        <span id="quant-${cat}-${i}">${p.quantidade}</span>
        <button data-action="add" data-index="${i}">+</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function alterarQuantidade(cat, index, delta) {
  const prod = produtos[cat][index];
  prod.quantidade = Math.max(0, prod.quantidade + delta);
  document.getElementById(`quant-${cat}-${index}`).textContent = prod.quantidade;
  atualizarCarrinho();
}

function mostrarCarrinho() {
  listaCarrinho.innerHTML = '';
  for (const cat in produtos) {
    produtos[cat].forEach(p => {
      if (p.quantidade > 0) {
        const li = document.createElement('li');
        li.textContent = `${p.nome} - Quantidade: ${p.quantidade}`;
        listaCarrinho.appendChild(li);
      }
    });
  }
  carrinhoEl.style.display = 'block';
}

function atualizarCarrinho() {
  if (carrinhoEl.style.display === 'block') {
    mostrarCarrinho();
  }
}
