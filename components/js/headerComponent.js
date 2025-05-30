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
                    grid-template-columns: auto 1fr auto;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 40px; 
                    gap: 30px;
                }
                .logo-container-perfil {
                    padding: 0;
                    justify-self: start;
                }
                .logo-container-perfil .logo-sacolao {
                    max-width: 180px; 
                    display: block;
                }
                .header-right-box {
                    height: auto;
                    padding: 8px 15px; 
                    border-width: 4px;
                    gap: 15px; 
                    justify-self: end; 
                    margin-left: 0; 
                }
                .header-right-box img {
                    max-width: 28px; 
                    height: 28px;
                    padding: 0;
                }
                .user-info { 
                  text-align: center;
                  margin: 0; 
                  animation: fadeIn 0.5s ease-in-out;
                  align-self: center;
                  justify-self: center;
                }
                .avatar img {
                  width: 80px; 
                  height: 80px;
                  border-radius: 50%;
                  object-fit: cover;
                  border: 3px solid #4CAF50;
                  transition: transform 0.3s ease;
                  margin: 0 auto 8px auto;
                }
                .avatar img:hover {
                  transform: scale(1.05);
                }
                .user-info h2 {
                  margin: 0.5rem 0 0.3rem;
                  color: #333;
                  font-size: 1.5rem; 
                }
                .user-info p {
                  color: #666;
                  margin: 0;
                  font-size: 1rem; 
                }
            `;
        }

        return `
            <style>

                * {
                    font-family: 'Jetbrains Mono', monospace;
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                html {
                    font-size: 62.5%;
                }

                body {
                    background-color: #f1f0d9;
                }

                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                :host {
                    display: block;
                    position: relative;
                    z-index: 1000;
                    
                }
                :host([variant="perfil"]) {
                    margin-bottom: 15px;
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
                    position: absolute; top: 120%; right: -10px;
                    background-color: #f8f8f8; border: 3px solid #565555; border-radius: 25px;
                    padding: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); z-index: 100;
                    opacity: 0; visibility: hidden; transform: translateY(-10px) translateX(120px);
                    transition: opacity 0.3s ease, visibility 0s linear 0.3s, transform 0.3s ease; min-width: 250px;
                }
                #search-popup-desktop.show {
                    opacity: 1; visibility: visible; transform: translateY(0) translateX(120px);
                    transition: opacity 0.3s ease, visibility 0s linear 0s, transform 0.3s ease;
                }
                .search-bar-popup {
                    width: 100%; padding: 8px 15px; border: none; border-radius: 20px;
                    font-size: 1.6rem; background-color: #f8f8f8; box-sizing: border-box;
                }
                .search-bar-popup:focus { outline: none; }
                .logo-container { margin-top: 30px; justify-self: center; }
                .logo-sacolao { max-width: 300px; padding-top: 20px; }
                
                .menu-mobile { display: none; }

                ${variantStyles}

                @media (max-width: 768px) {
                    .header-grid { display: none !important; } 
                    
                    .menu-mobile {
                        display: flex; 
                        flex-direction: column; 
                        align-items: center;
                        width: 100%; 
                        position: relative; 
                        z-index: 20;
                        margin-top: 5px; 
                        margin-bottom: 5px; 
                        gap: 10px;
                        box-sizing: border-box;
                    }
                    
                    .menu-mobile .logo-container {
                        width: 90%; order: -1; margin: 0 auto; padding: 10px 0;
                        display: flex; justify-content: center;
                    }
                    .menu-mobile .logo-container .logo-sacolao {
                         max-width: 180px;
                         height: auto;
                    }

                    .menu-hamburguer-drawer {
                        font-family: 'Limelight', normal;
                        display: block; 
                        background-color: #d6a9a1; 
                        border: 4px solid #000;
                        border-radius: 30px; padding: 10px 20px; font-size: 1.8rem;
                        font-weight: bold; 
                        text-shadow: -4px 2px 5px rgba(0, 0, 0, 0.25);
                        font-size: 1.6rem;
                        cursor: pointer;
                        box-shadow: 3px 7px 12.5px 2px rgba(0, 0, 0, 0.25);
                        width: 90%; 
                        text-align: center;
                        box-shadow: 3px 7px 12.5px 2px rgba(0, 0, 0, 0.25), 0px 3px 0px 2px #000;
                    }
                    .opcao-menu { 
                        display: flex; 
                        flex-direction: column; 
                        align-items: center;
                        overflow: hidden; 
                        max-height: 0; 
                        opacity: 0; 
                        visibility: hidden;
                        transition: max-height 0.6s ease, opacity 0.6s ease, visibility 0s linear 0.6s;
                        pointer-events: none;
                        gap: 10px; 
                        background-color: #d6a9a1; 
                        border: 4px solid #000;
                        border-radius: 30px; padding: 10px 20px; font-size: 1.8rem;
                        width: 80%; 
                        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                        padding: 0 15px; 
                        box-sizing: border-box; 
                        margin-top: 0;
                    }
                    .opcao-menu.show {
                        max-height: 500px; opacity: 1; visibility: visible; pointer-events: auto;
                        padding: 15px;
                        transition: max-height 0.6s ease, opacity 0.6s ease, visibility 0s linear 0s;
                    }

                    :host([variant="perfil"]) .menu-mobile {
                        padding: 0;
                    }
                    .perfil-mobile-top-row {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        width: 80%;
                        padding: 8px 15px;
                        box-sizing: border-box;
                        gap: 70px;
                    }
                    :host([variant="perfil"]) .menu-mobile .logo-container-perfil {
                        margin: 0; 
                        padding: 0;
                        flex-shrink: 0;
                    }
                    :host([variant="perfil"]) .menu-mobile .logo-container-perfil .logo-sacolao {
                        max-width: 100px; 
                        height: auto;
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info {
                        margin: 0;
                        margin-left: -20px;
                        padding-top: 20px;
                        animation: none; 
                        display: flex;
                        flex-direction: row; 
                        align-items: center; 
                        gap: 8px; 
                        flex-grow: 1; 
                        justify-content: flex-start; 
                        text-align: left;
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info .avatar {
                        margin:0;
                        flex-shrink: 0;
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info .avatar img {
                        width: 60px; 
                        height: 60px;
                        border-width: 2px;
                        margin:0;
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info .user-text-details {
                        text-align: left;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info h2 {
                        font-size: 1rem; 
                        margin: 0;
                        color: #333;
                        line-height: 1.1;
                        padding-bottom: 4px;
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info p {
                        font-size: 0.85rem; 
                        margin: 0;
                        color: #555;
                        line-height: 1.1;
                    }
                    :host([variant="perfil"]) .menu-mobile .menu-hamburguer-drawer {
                        width: 90%; 
                        margin-top: 10px;
                    }
                     :host([variant="perfil"]) .menu-mobile .opcao-menu {
                        width: 80%;
                        margin-top: 0px;
                    }
                    
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
                        box-sizing: border-box; 
                        line-height: normal;
                        justify-content: flex-start; 
                        text-align: left;
                    }
                    .opcao-btn:hover { background-color: rgba(255,255,255,0.1); }
                    .opcao-btn img { width: 32px; height: 32px; flex-shrink: 0; }
                    .opcao-btn span { flex-grow: 1; }

                    #search-popup-mobile { 
                        position: absolute; top: 110%; left: 50%;
                        background-color: #f8f8f8; border: 3px solid #565555; border-radius: 25px;
                        padding: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 101;
                        opacity: 0; visibility: hidden; width: 90%;
                        transform: translateX(-50%) translateY(-10px); transition: all 0.3s ease;
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

        const desktopLeftBox = `
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

        const desktopLogoContainer = `
            <div class="${isPerfilPage ? 'logo-container-perfil' : 'logo-container'}">
                <a href="/index.html">
                    <img class="logo-sacolao" src="/assets/images/logo.png" alt="Logo Sacolão Rodrigues">
                </a>
            </div>
        `;

        const userInfoSection = `
            <section class="user-info">
                <div class="avatar">
                    <img src="/assets/images/user-profile-pic.png" alt="Foto do usuário">
                </div>
                <div class="user-text-details">
                    <h2>Nome do Usuário</h2>
                    <p>email@usuario.com</p>
                </div>
            </section>
        `;

        const desktopRightBox = `
            <div class="header-right-box">
                ${isPerfilPage ? '' : `
                <a href="/pages/cadastro.html" title="Criar Conta">
                    <img src="/assets/images/log-in.png" alt="Cadastro">
                </a>
                <a href="/pages/perfil.html" title="Meu Perfil">
                    <img src="/assets/images/profile.png" alt="Meu Perfil">
                </a>`}
                <a href="/pages/carrinho.html" title="Carrinho">
                    <img src="/assets/images/cart-icon.png" alt="Carrinho">
                </a>
            </div>
        `;

        let mobileMenuOptionsForThisPage = '';
        if (isPerfilPage) {
            mobileMenuOptionsForThisPage = `
                <a href="/pages/listas.html" class="opcao-btn" title="Minhas Listas">
                    <img src="/assets/images/list-icon.png" alt="Minhas Listas">
                    <span>Minhas Listas</span>
                </a>
                <a href="/pages/ofertas.html" class="opcao-btn" title="Minhas Ofertas">
                    <img src="/assets/images/ofertas.png" alt="Minhas Ofertas">
                    <span>Minhas Ofertas</span>
                </a>
                <a href="/pages/ajustes.html" class="opcao-btn" title="Ajustes">
                    <img src="/assets/images/ajustes-icon.png" alt="Ajustes">
                    <span>Ajustes</span>
                </a>
                <button id="logout-btn-mobile" class="opcao-btn" title="Sair">
                    <img src="/assets/images/log-in.png" alt="Sair">
                    <span>Sair</span>
                </button>
            `;
        } else {
            mobileMenuOptionsForThisPage = `
                <a href="/pages/listas.html" class="opcao-btn" title="Minhas Listas">
                    <img src="/assets/images/list-icon.png" alt="Minhas Listas">
                    <span>Minhas Listas</span>
                </a>
                <a href="/pages/ofertas.html" class="opcao-btn" title="Minhas Ofertas">
                    <img src="/assets/images/ofertas.png" alt="Minhas Ofertas">
                    <span>Minhas Ofertas</span>
                </a>
                <a href="/pages/perfil.html" class="opcao-btn" title="Perfil">
                    <img src="/assets/images/profile.png" alt="Perfil">
                    <span>Perfil</span>
                </a>
                <a href="/pages/ajustes.html" class="opcao-btn" title="Ajustes">
                    <img src="/assets/images/ajustes-icon.png" alt="Ajustes">
                    <span>Ajustes</span>
                </a>
                <button id="logout-btn-mobile" class="opcao-btn" title="Sair">
                    <img src="/assets/images/log-in.png" alt="Sair">
                    <span>Sair</span>
                </button>
            `;
        }

        let headerGridDesktopContent = '';
        if (isPerfilPage) {
            headerGridDesktopContent = `
                ${desktopLogoContainer}
                ${userInfoSection}
                ${desktopRightBox}
            `;
        } else {
            headerGridDesktopContent = `
                ${desktopLeftBox}
                ${desktopLogoContainer}
                ${desktopRightBox}
            `;
        }

        let menuMobileContent = '';
        if (isPerfilPage) {
            menuMobileContent = `
                <div class="perfil-mobile-top-row">
                    ${desktopLogoContainer}
                    ${userInfoSection}
                </div>
                <button class="menu-hamburguer-drawer">☰ Menu</button>
                <div class="opcao-menu">
                    ${mobileMenuOptionsForThisPage}
                </div>
            `;
        } else {
            menuMobileContent = `
                <div class="logo-container">
                    <a href="/index.html">
                        <img class="logo-sacolao" src="/assets/images/logo.png" alt="Logo Sacolão Rodrigues">
                    </a>
                </div>
                <button class="menu-hamburguer-drawer">☰ Menu</button>
                <div class="opcao-menu">
                    ${mobileMenuOptionsForThisPage}
                </div>
            `;
        }

        return `
            <div class="header-grid">
                ${headerGridDesktopContent}
            </div>
            <div class="menu-mobile">
                ${menuMobileContent}
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

        const logoutButtonMobile = shadow.querySelector('#logout-btn-mobile');
        if (logoutButtonMobile) {
            logoutButtonMobile.addEventListener('click', () => {
            });
        }

        const searchBtnDesktop = shadow.querySelector('#search-btn-desktop');
        const searchPopupDesktop = shadow.querySelector('#search-popup-desktop');
        const searchInputDesktop = shadow.querySelector('#search-desktop-input');

        if (searchBtnDesktop && searchPopupDesktop && searchInputDesktop) {
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

        if (searchBtnMobile && searchPopupMobile && searchInputMobile) {
            searchBtnMobile.addEventListener('click', (e) => {
                e.stopPropagation();
                searchPopupMobile.classList.toggle('show');
                if (searchPopupMobile.classList.contains('show')) {
                    setTimeout(() => searchInputMobile.focus(), 0);
                }
            });
            searchPopupMobile.addEventListener('click', e => e.stopPropagation());
        }

        document.addEventListener('click', (e) => {
            const searchPopupDesktopEl = shadow.querySelector('#search-popup-desktop');
            const searchBtnDesktopEl = shadow.querySelector('#search-btn-desktop');
            if (searchPopupDesktopEl && searchPopupDesktopEl.classList.contains('show') && !searchPopupDesktopEl.contains(e.target) && e.target !== searchBtnDesktopEl && (searchBtnDesktopEl && !searchBtnDesktopEl.contains(e.target))) {
                searchPopupDesktopEl.classList.remove('show');
            }

            const searchPopupMobileEl = shadow.querySelector('#search-popup-mobile');
            const searchBtnMobileEl = shadow.querySelector('.search-toggle-btn-mobile');
            if (searchPopupMobileEl && searchPopupMobileEl.classList.contains('show') && !searchPopupMobileEl.contains(e.target) && searchBtnMobileEl && e.target !== searchBtnMobileEl && !searchBtnMobileEl.contains(e.target)) {
                searchPopupMobileEl.classList.remove('show');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                const searchPopupDesktopEl = shadow.querySelector('#search-popup-desktop');
                const searchPopupMobileEl = shadow.querySelector('#search-popup-mobile');
                if (searchPopupDesktopEl && searchPopupDesktopEl.classList.contains('show')) {
                    searchPopupDesktopEl.classList.remove('show');
                }
                if (searchPopupMobileEl && searchPopupMobileEl.classList.contains('show')) {
                    searchPopupMobileEl.classList.remove('show');
                }
            }

            const searchBtnDesktopEl = shadow.querySelector('#search-btn-desktop');
            const searchInputDesktopEl = shadow.querySelector('#search-desktop-input');
            if (e.key === '/' && searchBtnDesktopEl && searchInputDesktopEl) {
                const desktopLeftBoxExists = shadow.querySelector('.header-left-box');
                if (!desktopLeftBoxExists && !isPerfilPage && !(isPerfilPage && shadow.querySelector('.header-grid .search-section'))) return;

                const activeEl = document.activeElement;
                const isDesktopSearchButtonVisible = getComputedStyle(searchBtnDesktopEl).display !== 'none';
                const isDesktopSearchInputActive = activeEl === searchInputDesktopEl;

                if (!isDesktopSearchButtonVisible || isDesktopSearchInputActive) {
                    return;
                }
                const isTypingElsewhere = (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');
                if (isTypingElsewhere) {
                    return;
                }
                e.preventDefault();
                const searchPopupDesktopEl = shadow.querySelector('#search-popup-desktop');
                if (searchPopupDesktopEl.classList.contains('show')) {
                    searchPopupDesktopEl.classList.remove('show');
                } else {
                    searchPopupDesktopEl.classList.add('show');
                    setTimeout(() => searchInputDesktopEl.focus(), 0);
                }
            }
        });

        const searchInputDesktopEl = shadow.querySelector('#search-desktop-input');
        const searchInputMobileEl = shadow.querySelector('#search-mobile-input');

        if (searchInputDesktopEl) {
            const handleSearchInput = (event) => {
                this.dispatchEvent(new CustomEvent('header-search', {
                    detail: { term: event.target.value },
                    bubbles: true, composed: true
                }));
            };
            searchInputDesktopEl.addEventListener('input', handleSearchInput);
            if (searchInputMobileEl) searchInputMobileEl.addEventListener('input', handleSearchInput);
        }
    }
}

customElements.define('header-component', Header);