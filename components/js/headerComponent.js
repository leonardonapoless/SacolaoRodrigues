const headerTemplate = document.createElement('template');

class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const variant = this.getAttribute('variant');
        this.shadowRoot.innerHTML = this.getStyles(variant) + this.getHTML(variant);
        this.addEventListeners(variant);
    }

    getStyles(variant) {
        let variantStyles = '';
        if (variant === 'perfil') {
            variantStyles = `
                .header-grid {
                    grid-template-columns: auto 1fr; /* Logo | Direita */
                    justify-content: space-between;
                    padding: 0 30px;
                }
                .logo-container-perfil {
                    padding: 10px 0;
                }
                .logo-container-perfil .logo-sacolao {
                    max-width: 200px; 
                    padding-top: 0;
                }
            `;
        }

        return `
            <style>
                :host {
                    display: block;
                    position: relative;
                    z-index: 1000;
                }
                a {
                    text-decoration: none;
                    color: inherit;
                    display: contents; 
                }
                button {
                    border: none;
                    background-color: transparent;
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                }
                img {
                    display: block;
                }
                .header-grid {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    max-width: 1250px;
                    margin: 0 auto;
                    padding: 0 60px;
                    background-color: transparent;
                }
                .header-left-box, .header-right-box {
                    height: 70px;
                    padding: 0 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 60px;
                    background-color: #79946F;
                    border: 6px solid #000;
                    gap: 25px;
                }
                .header-left-box {
                    box-shadow: -3px -4px 0px 2px #000, 6px 14px 12.5px 2px rgba(0, 0, 0, 0.25);
                    justify-self: start;
                }
                .header-right-box {
                    box-shadow: 3px -4px 0px 2px #000, 6px 14px 12.5px 2px rgba(0, 0, 0, 0.25);
                    justify-self: end;
                }
                .header-left-box img, .header-right-box img {
                    max-width: 60px;
                    padding: 8px;
                }
                .search-section { position: relative; }
                #search-popup-desktop {
                    position: absolute;
                    top: 120%;
                    right: -10px;
                    background-color: #f8f8f8;
                    border: 3px solid #565555;
                    border-radius: 25px;
                    padding: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    z-index: 100;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px) translateX(120px);
                    transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
                    min-width: 250px;
                }
                #search-popup-desktop.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0) translateX(120px);
                }
                .search-bar-popup {
                    width: 100%; 
                    padding: 8px 15px; 
                    border: none;
                    border-radius: 20px; 
                    font-size: 1.6rem; 
                    background-color: #f8f8f8;
                    box-sizing: border-box;
                }
                .search-bar-popup:focus {
                    outline: none;
                }
                .logo-container { margin-top: 30px; justify-self: center; }
                .logo-sacolao { max-width: 300px; padding-top: 20px; }
                .menu-mobile { display: none; }

                ${variantStyles}

                @media (max-width: 768px) {
                    .header-grid { display: none; }
                    :host([variant="perfil"]) .header-grid { display: none; }

                    .menu-mobile {
                        display: flex; flex-direction: column; align-items: center;
                        width: 100%; position: relative; z-index: 20;
                        margin-top: 5px; margin-bottom: 5px; gap: 10px;
                    }
                    .logo-container { width: 90%; order: -1; margin: 0 auto; padding: 10px 0; }
                    :host([variant="perfil"]) .logo-container { margin-top: 5px; }

                    .menu-hamburguer-drawer {
                        display: block; background-color: #d6a9a1; border: 3px solid #000;
                        border-radius: 25px; padding: 10px 20px; font-size: 1.8rem;
                        font-weight: bold; cursor: pointer;
                        box-shadow: 3px 7px 12.5px 2px rgba(0, 0, 0, 0.25);
                        width: 90%;
                    }
                    .opcao-menu {
                        display: flex; flex-direction: column; align-items: center;
                        overflow: hidden; max-height: 0; opacity: 0;
                        transition: max-height 0.6s ease, opacity 0.6s ease;
                        pointer-events: none; gap: 10px;
                        background-color: #79946F; border-radius: 20px;
                        width: 80%; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                        padding: 0 15px;
                    }
                    .opcao-menu.show { max-height: 500px; opacity: 1; pointer-events: auto; padding: 15px; }
                    .opcao-btn {
                        background: none;
                        border: none;
                        cursor: pointer;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        padding: 10px;
                        font-family: 'Limelight', normal;
                        font-size: 1.8rem;
                        color: white;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
                        border-radius: 15px;
                        text-decoration: none;
                    }
                    .opcao-btn:hover {
                        background-color: rgba(255,255,255,0.1);
                    }
                    .opcao-btn img {
                        width: 32px;
                        height: 32px;
                    }
                    .search-section-mobile { position: relative; width: 100%; }
                    #search-popup-mobile {
                        position: absolute; top: 110%; left: 50%;
                        background-color: #f8f8f8; border: 3px solid #565555;
                        border-radius: 25px; padding: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); z-index: 101;
                        opacity: 0; visibility: hidden; width: 90%;
                        transform: translateX(-50%) translateY(-10px);
                        transition: all 0.3s ease;
                    }
                    #search-popup-mobile.show {
                        opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0);
                    }
                }
            </style>
        `;
    }

    getHTML(variant) {
        const isPerfilPage = variant === 'perfil';

        const desktopLeftBox = isPerfilPage ? '' : `
            <div class="header-left-box">
                <a href="/pages/listas.html" title="Lista de Compras">
                    <img src="/assets/images/list-icon.png" alt="Minhas Listas">
                </a>
                <a href="/pages/ofertas.html" title="Ofertas">
                    <img src="/assets/images/ofertas.png" alt="Promoções">
                </a>
                <div class="search-section">
                    <button id="search-btn-desktop" class="search-toggle-btn" title="Buscar Produto">
                        <img src="/assets/images/search-icon.png" alt="Buscar">
                    </button>
                    <div id="search-popup-desktop">
                        <input type="text" id="search-desktop-input" class="search-bar-popup" placeholder="Buscar produto...">
                    </div>
                </div>
            </div>
        `;

        const desktopLogoContainer = isPerfilPage ? `
            <div class="logo-container-perfil">
                <a href="/index.html">
                    <img class="logo-sacolao" src="/assets/images/logo.png" alt="Logo Sacolão Rodrigues">
                </a>
            </div>
        ` : `
            <div class="logo-container">
                <a href="/index.html">
                    <img class="logo-sacolao" src="/assets/images/logo.png" alt="Logo Sacolão Rodrigues">
                </a>
            </div>
        `;
        
        const desktopRightBox = `
            <div class="header-right-box">
                ${isPerfilPage ? '' : `
                <a href="/pages/perfil.html" title="Meu Perfil">
                    <img src="/assets/images/profile.png" alt="Meu Perfil">
                </a>`}
                <a href="/pages/carrinho.html" title="Carrinho">
                    <img src="/assets/images/cart-icon.png" alt="Carrinho">
                </a>
            </div>
        `;

        const mobileMenuOptions = isPerfilPage ? `
            <a href="/index.html" class="opcao-btn" title="Voltar para Loja">
                <span>Voltar para Loja</span>
            </a>
            <a href="/pages/carrinho.html" class="opcao-btn" title="Carrinho">
                 <img src="/assets/images/cart-icon.png" alt="Carrinho">
                 <span>Carrinho</span>
            </a>
        ` : `
            <div class="search-section-mobile">
                <button class="opcao-btn search-toggle-btn-mobile" title="Buscar Produto">
                    <img src="/assets/images/Search.png" alt="Buscar">
                    <span>Buscar</span>
                </button>
                <div id="search-popup-mobile">
                    <input type="text" id="search-mobile-input" class="search-bar-popup" placeholder="Buscar produto...">
                </div>
            </div>
            <a href="/pages/listas.html" class="opcao-btn" title="Lista de Compras">
                <img src="/assets/images/MyLists.png" alt="Minhas Listas">
                <span>Minhas Listas</span>
            </a>
            <a href="/pages/ofertas.html" class="opcao-btn" title="Promoções">
                <img src="/assets/images/OnSale.png" alt="Promoções">
                <span>Ofertas</span>
            </a>
            <a href="/pages/perfil.html" class="opcao-btn" title="Meu Perfil">
                <img src="/assets/images/profile.png" alt="Meu Perfil">
                <span>Meu Perfil</span>
            </a>
            <a href="/pages/carrinho.html" class="opcao-btn" title="Carrinho">
                 <img src="/assets/images/cart-icon.png" alt="Carrinho">
                 <span>Carrinho</span>
            </a>
        `;

        return `
            <div class="header-grid">
                ${isPerfilPage ? desktopLogoContainer : desktopLeftBox}
                ${isPerfilPage ? '' : desktopLogoContainer}
                ${desktopRightBox}
            </div>
            <div class="menu-mobile">
                <div class="logo-container">
                    <a href="/index.html">
                        <img class="logo-sacolao" src="/assets/images/logo.png" alt="Logo Sacolão Rodrigues">
                    </a>
                </div>
                <button class="menu-hamburguer-drawer">☰ Menu</button>
                <div class="opcao-menu">
                    ${mobileMenuOptions}
                </div>
            </div>
        `;
    }

    addEventListeners(variant) {
        const shadow = this.shadowRoot;
        const isPerfilPage = variant === 'perfil';

        const hamburguerBtn = shadow.querySelector('.menu-hamburguer-drawer');
        const mobileMenu = shadow.querySelector('.opcao-menu');
        
        if (hamburguerBtn && mobileMenu) {
            hamburguerBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('show');
            });
        }
        
        const searchBtnDesktop = shadow.querySelector('#search-btn-desktop');
        const searchPopupDesktop = shadow.querySelector('#search-popup-desktop');
        const searchInputDesktop = shadow.querySelector('#search-desktop-input');
        
        if (!isPerfilPage && searchBtnDesktop && searchPopupDesktop && searchInputDesktop) {
            const toggleDesktopSearch = (e) => {
                e.stopPropagation();
                searchPopupDesktop.classList.toggle('show');
                if (searchPopupDesktop.classList.contains('show')) {
                    setTimeout(() => searchInputDesktop.focus(), 0);
                }
            };
            searchBtnDesktop.addEventListener('click', toggleDesktopSearch);
            searchPopupDesktop.addEventListener('click', e => e.stopPropagation());
        }

        const searchBtnMobile = shadow.querySelector('.search-toggle-btn-mobile');
        const searchPopupMobile = shadow.querySelector('#search-popup-mobile');
        const searchInputMobile = shadow.querySelector('#search-mobile-input');

        if (!isPerfilPage && searchBtnMobile && searchPopupMobile && searchInputMobile) {
            const toggleMobileSearch = (e) => {
                e.stopPropagation();
                searchPopupMobile.classList.toggle('show');
                 if (searchPopupMobile.classList.contains('show')) {
                    setTimeout(() => searchInputMobile.focus(), 0);
                }
            }
            searchBtnMobile.addEventListener('click', toggleMobileSearch);
            searchPopupMobile.addEventListener('click', e => e.stopPropagation());
        }

        document.addEventListener('click', (e) => {
            if (searchPopupDesktop && searchPopupDesktop.classList.contains('show') && !searchPopupDesktop.contains(e.target) && e.target !== searchBtnDesktop && (searchBtnDesktop && !searchBtnDesktop.contains(e.target)) ) {
                searchPopupDesktop.classList.remove('show');
            }
            if (searchPopupMobile && searchPopupMobile.classList.contains('show') && !searchPopupMobile.contains(e.target) && e.target !== searchBtnMobile && (searchBtnMobile && !searchBtnMobile.contains(e.target))) {
                searchPopupMobile.classList.remove('show');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (searchPopupDesktop && searchPopupMobile) {
                if (e.key === 'Escape' || e.key === 'Esc') {
                    searchPopupDesktop.classList.remove('show');
                    searchPopupMobile.classList.remove('show');
                }
            }

            if (!isPerfilPage && e.key === '/' && searchBtnDesktop && searchInputDesktop ) {
                const activeEl = document.activeElement;
                const isDesktopSearchInputActive = activeEl === searchInputDesktop;
                
                if (getComputedStyle(searchBtnDesktop).display === 'none' && !isDesktopSearchInputActive) {
                    return;
                }

                if (isDesktopSearchInputActive) {
                    return; 
                }

                const isTypingElsewhere = (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
                if (isTypingElsewhere) {
                    return;
                }
                
                e.preventDefault();
                if (searchPopupDesktop.classList.contains('show')) {
                    searchPopupDesktop.classList.remove('show');
                } else {
                    searchPopupDesktop.classList.add('show');
                    setTimeout(() => searchInputDesktop.focus(), 0);
                }
            }
        });

        if (!isPerfilPage && searchInputDesktop && searchInputMobile) {
            const handleSearchInput = (event) => {
                this.dispatchEvent(new CustomEvent('header-search', {
                    detail: { term: event.target.value },
                    bubbles: true,
                    composed: true
                }));
            };
            searchInputDesktop.addEventListener('input', handleSearchInput);
            searchInputMobile.addEventListener('input', handleSearchInput);
        }
    }
}

customElements.define('header-component', Header);