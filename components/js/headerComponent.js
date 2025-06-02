const headerTemplate = document.createElement('template');

class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const variant = this.getAttribute('variant') || 'default';
        this.shadowRoot.innerHTML = this.getStyles(variant) + this.getHTML(variant);
        this.addEventListeners(variant);
        this.shadowRoot.host.style.opacity = '0';
        requestAnimationFrame(() => {
            this.shadowRoot.host.style.transition = 'opacity 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) 0.1s';
            this.shadowRoot.host.style.opacity = '1';
        });
    }

    getStyles(variant) {
        let variantStyles = '';
        if (variant === 'perfil') {
            variantStyles = `
                .header-grid {
                    margin-top: 30px;
                    grid-template-columns: auto 1fr auto;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 30px; 
                    gap: 20px;
                }
                .logo-container-perfil {
                    margin-left: -33px;
                    padding: 0;
                    justify-self: start;
                    transform: translateX(-15px);
                    opacity: 0;
                    animation: slideInFromLeft 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.3s forwards;
                }
                .logo-container-perfil .logo-sacolao {
                    max-width: 150px; 
                    display: block;
                }
                .header-right-box {
                    height: auto;
                    padding: 8px 20px; 
                    border-width: 4px;
                    justify-self: end; 
                    margin-left: 0; 
                    margin-bottom: -20px;
                    transform: translateX(15px);
                    opacity: 0;
                    animation: slideInFromRight 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.3s forwards;
                }
                .header-right-box a img {
                    max-width: 28px; 
                    height: 28px;
                    padding: 0;
                    margin-left: -3px;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .header-right-box a:hover img {
                    transform: scale(1.15);
                }
                .user-info { 
                    text-align: center;
                    margin: 0; 
                    margin-left: -50px;
                    animation: fadeInUser 0.8s cubic-bezier(0.39, 0.575, 0.565, 1) 0.5s backwards;
                    align-self: center;
                    justify-self: center;
                }
                .avatar img {
                    width: 80px; 
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid #4CAF50;
                    transition: transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
                    margin: 0 auto 8px auto;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .avatar img:hover {
                  transform: scale(1.08);
                  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
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
        } else if (variant === 'checkout') { /* CSS VARIANTE DO CHECKOUT*/
            variantStyles = `
                .header-grid.checkout-variant {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 25px;
                }
                .logo-container-checkout .logo-sacolao {
                    max-width: 200px; 
                    height: auto;
                    display: block;
                }

                .checkout-title {
                    text-align: center;
                    color: #000;
                    font-size: 2em;
                    margin-left: -30px;
                    margin-top: 50px;
                    margin-bottom: 10px;
                    font-weight: 600;
                    text-shadow: -2.5px 0px 3px rgba(0, 0, 0, 0.15);
                }

                .actions-container-checkout {
                    box-shadow: 3px -4px 0px 2px #000, 6px 14px 12.5px 2px rgba(0, 0, 0, 0.25);
                    justify-self: end;
                    transform: translateX(30px);
                    opacity: 0;
                    animation: slideInFromRight 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;       
                }

                .actions-container-checkout {
                    height: 70px;
                    padding: 0 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 60px;
                    background-color: #79946F;
                    border: 6px solid #000;
                    gap: 25px;
                    transition: box-shadow 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
                }    
                
                .actions-container-checkout a img {
                    height: 45px;
                    padding: 4px;
                    border-radius: 50%;
                    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
                }
                .actions-container-checkout a:hover img {
                    transform: scale(1.1);
                }
                .menu-mobile.checkout-variant {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    padding: 8px 15px;
                    border-bottom: 1px solid #eaeaea;
                    box-sizing: border-box;
                    background-color: #fdfdfd;
                }
                .menu-mobile.checkout-variant .logo-container-checkout .logo-sacolao {
                    max-width: 130px;
                }
                .menu-mobile.checkout-variant .actions-container-checkout a img {
                     max-width: 30px;
                     height: 30px;
                }
                :host([variant="checkout"]) .header-grid:not(.checkout-variant),
                :host([variant="checkout"]) .menu-mobile:not(.checkout-variant) {
                    display: none !important;
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
                @keyframes fadeInUser {
                  from { opacity: 0; transform: translateY(15px) scale(0.95); }
                  to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes slideInFromLeft {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInFromRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleUp {
                    from { transform: scale(0.9); opacity: 0;}
                    to { transform: scale(1); opacity: 1;}
                }
                @keyframes mobileMenuButtonAppear {
                    from { opacity: 0; transform: translateY(15px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                :host {
                    display: block;
                    position: relative;
                    z-index: 1000;
                }
                :host([variant="perfil"]) {
                    margin-bottom: 15px;
                }
                 :host([variant="checkout"]) {
                    margin-bottom: 0; 
                }
                a {
                    text-decoration: none;
                    color: inherit;
                    display: inline-flex; 
                    align-items: center; 
                    justify-content: center;
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
                    transition: box-shadow 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                .header-left-box {
                    box-shadow: -3px -4px 0px 2px #000, 6px 14px 12.5px 2px rgba(0, 0, 0, 0.25);
                    justify-self: start;
                    transform: translateX(-30px);
                    opacity: 0;
                    animation: slideInFromLeft 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
                }
                .header-right-box {
                    box-shadow: 3px -4px 0px 2px #000, 6px 14px 12.5px 2px rgba(0, 0, 0, 0.25);
                    justify-self: end;
                    transform: translateX(30px);
                    opacity: 0;
                    animation: slideInFromRight 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
                }
                 .header-left-box:hover, .header-right-box:hover {
                    box-shadow: 0px 0px 0px 3px #000, 8px 18px 18px 3px rgba(0, 0, 0, 0.3);
                 }
                .header-left-box img, .header-right-box a img {
                    max-width: 60px;
                    padding: 8px;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .header-left-box a:hover img, .header-right-box a:hover img,
                .header-left-box button:hover img {
                    transform: scale(1.12);
                }
                .search-section { position: relative; }
                 .search-section button img {
                    max-width: 60px;
                    padding: 8px;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                 }
                 .search-section button:hover img {
                    transform: scale(1.12);
                 }
                #search-popup-desktop {
                    position: absolute; top: 120%; right: -10px;
                    background-color: #f8f8f8; border: 3px solid #565555; border-radius: 25px;
                    padding: 12px 15px; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25); z-index: 100;
                    opacity: 0; visibility: hidden; transform: translateY(-15px) translateX(120px) scale(0.9);
                    transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), visibility 0s linear 0.3s, transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1); min-width: 260px;
                }
                #search-popup-desktop.show {
                    opacity: 1; visibility: visible; transform: translateY(0) translateX(120px) scale(1);
                    transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), visibility 0s linear 0s, transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
                }
                .search-bar-popup {
                    width: 100%; padding: 10px 18px; border: none; border-radius: 20px;
                    font-size: 1.6rem; background-color: #f8f8f8; box-sizing: border-box;
                }
                .search-bar-popup:focus { outline: none; }
                .logo-container { 
                    margin-top: 30px; 
                    justify-self: center;
                    opacity: 0;
                    transform: scale(0.85);
                    animation: scaleUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.4s forwards;
                }
                .logo-sacolao { max-width: 300px; padding-top: 20px; }
                .menu-mobile { display: none; }

                ${variantStyles}

                @media (max-width: 768px) {
                    :host(:not([variant="checkout"])) .header-grid { display: none !important; } 
                    :host([variant="checkout"]) .header-grid:not(.checkout-variant) { display: none !important; }
                    :host([variant="checkout"]) .menu-mobile:not(.checkout-variant) { display: none !important; }


                    .menu-mobile {
                        display: flex; 
                        flex-direction: column; 
                        align-items: center;
                        width: 100%; 
                        position: relative; 
                        z-index: 20;
                        margin-top: 5px; 
                        margin-bottom: 5px; 
                        gap: 12px;
                        box-sizing: border-box;
                        padding: 0 5%;
                    }
                    :host([variant="checkout"]) .menu-mobile.checkout-variant {
                        display: flex !important;
                    }
                    :host(:not([variant="checkout"])) .menu-mobile.checkout-variant {
                        display: none !important;
                    }

                    .menu-mobile .logo-container {
                        width: 100%; order: -1; margin: 0 auto; padding: 10px 0;
                        display: flex; justify-content: center;
                        opacity: 0;
                        transform: translateY(-20px) scale(0.9);
                        animation: mobileMenuButtonAppear 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) 0.1s forwards;
                    }
                     :host([variant="perfil"]) .menu-mobile .logo-container {
                        animation-delay: 0s;
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
                        border-radius: 30px; padding: 12px 25px; font-size: 1.8rem;
                        font-weight: bold; 
                        text-shadow: -4px 2px 5px rgba(0, 0, 0, 0.25);
                        cursor: pointer;
                        box-shadow: 3px 7px 12.5px 2px rgba(0, 0, 0, 0.25), 0px 3px 0px 2px #000;
                        width: 100%; 
                        text-align: center;
                        transition: background-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                        opacity: 0;
                        transform: translateY(-20px) scale(0.9);
                        animation: mobileMenuButtonAppear 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) 0.2s forwards;
                    }
                     :host([variant="perfil"]) .menu-mobile .menu-hamburguer-drawer {
                        animation-delay: 0.25s;
                     }
                    .menu-hamburguer-drawer:hover {
                        background-color: #c9938b;
                         box-shadow: 4px 9px 16px 2px rgba(0, 0, 0, 0.3), 0px 4px 0px 2px #000;
                         transform: translateY(-2px) scale(1.0);
                    }
                     .menu-hamburguer-drawer:active {
                        transform: translateY(0px) scale(0.97);
                     }
                    .opcao-menu { 
                        display: flex; 
                        flex-direction: column; 
                        align-items: center;
                        overflow: hidden; 
                        max-height: 0; 
                        opacity: 0; 
                        visibility: hidden;
                        transform-origin: top center;
                        transform: translateY(-20px) scaleY(0.92);
                        transition: max-height 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.05s, visibility 0s linear 0.6s, transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), padding-top 0.5s cubic-bezier(0.23,1,0.32,1) 0.05s, padding-bottom 0.5s cubic-bezier(0.23,1,0.32,1) 0.05s;
                        pointer-events: none;
                        gap: 18px; 
                        background-color: #d6a9a1; 
                        border: 4px solid #000;
                        border-radius: 30px; 
                        font-size: 1.8rem;
                        width: 90%; 
                        box-shadow: 0 8px 20px rgba(0,0,0,0.25);
                        padding: 0 20px; 
                        box-sizing: border-box; 
                        margin-top: 0;
                    }
                    .opcao-menu.show {
                        max-height: 500px; opacity: 1; visibility: visible; pointer-events: auto;
                        padding: 25px 20px;
                        transform: translateY(0) scaleY(1);
                    }
                    :host([variant="perfil"]) .menu-mobile {
                        padding: 0 10%;
                    }
                    .perfil-mobile-top-row {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        width: 100%;
                        padding: 8px 0;
                        box-sizing: border-box;
                        gap: 15px;
                        opacity: 0;
                        transform: translateY(-20px);
                        animation: mobileMenuButtonAppear 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) 0.05s forwards;
                    }
                    :host([variant="perfil"]) .menu-mobile .logo-container-perfil {
                        margin: 0; 
                        padding: 0;
                        flex-shrink: 0;
                        transform: none; opacity: 1; animation: none;
                    }
                    :host([variant="perfil"]) .menu-mobile .logo-container-perfil .logo-sacolao {
                        max-width: 100px; 
                        height: auto;
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info {
                        margin: 0;
                        padding-top: 0;
                        animation: none; 
                        display: flex;
                        flex-direction: row; 
                        align-items: center; 
                        gap: 10px; 
                        flex-grow: 1; 
                        justify-content: flex-start; 
                        text-align: left;
                         transform: none; opacity: 1;
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
                        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info .avatar img:hover {
                        transform: scale(1.08);
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
                        width: 100%; 
                        margin-top: 10px;
                    }
                     :host([variant="perfil"]) .menu-mobile .opcao-menu {
                        width: 100%;
                        margin-top: 0px;
                    }
                    .opcao-btn {
                        background: none; 
                        border: none; 
                        cursor: pointer; 
                        width: auto;
                        display: inline-flex; 
                        align-items: center; 
                        justify-content: center;
                        padding: 10px;
                        border-radius: 50%;
                        text-decoration: none; 
                        box-sizing: border-box; 
                        line-height: normal;
                        opacity: 0;
                        transform: translateY(15px) scale(0.85);
                        transition: background-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
                    }
                     .opcao-btn span {
                        display: none;
                     }
                    .opcao-menu.show .opcao-btn {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    .opcao-menu.show .opcao-btn:nth-child(1) { transition-delay: 0.12s, 0.12s, 0.12s; }
                    .opcao-menu.show .opcao-btn:nth-child(2) { transition-delay: 0.19s, 0.19s, 0.19s; }
                    .opcao-menu.show .opcao-btn:nth-child(3) { transition-delay: 0.26s, 0.26s, 0.26s; }
                    .opcao-menu.show .opcao-btn:nth-child(4) { transition-delay: 0.33s, 0.33s, 0.33s; }
                    .opcao-menu.show .opcao-btn:nth-child(5) { transition-delay: 0.40s, 0.40s, 0.40s; }
                    .opcao-btn:hover { 
                        background-color: rgba(255,255,255,0.2); 
                        transform: translateY(0) scale(1.12);
                    }
                    .opcao-btn img { width: 30px; height: 30px; flex-shrink: 0; }
                    #search-popup-mobile { 
                        position: absolute; top: 110%; left: 50%;
                        background-color: #f8f8f8; border: 3px solid #565555; border-radius: 25px;
                        padding: 12px 15px; box-shadow: 0 6px 15px rgba(0,0,0,0.25); z-index: 101;
                        opacity: 0; visibility: hidden; width: 90%;
                        transform: translateX(-50%) translateY(-15px) scale(0.95); 
                        transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), visibility 0s linear 0.3s, transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
                    }
                    #search-popup-mobile.show {
                        opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0) scale(1);
                         transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), visibility 0s linear 0s, transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
                    }
                }
                 @media (min-width: 769px) {
                    :host([variant="checkout"]) .menu-mobile {
                        display: none !important;
                    }
                     :host([variant="checkout"]) .header-grid.checkout-variant {
                         display: flex !important;
                     }
                }
            </style>
        `;
    }

    getHTML(variant) {
        const isPerfilPage = variant === 'perfil';
        const isCheckoutPage = variant === 'checkout';

        if (isCheckoutPage) {
            return `
                <div class="header-grid checkout-variant">
                    <div class="logo-container-checkout">
                        <a href="/index.html">
                            <img class="logo-sacolao" src="/assets/images/logo.png" alt="Logo Sacolão Rodrigues">
                        </a>
                    </div>
                    <h1 class="checkout-title">Finalizar Compra</h1>
                    <div class="actions-container-checkout">
                        <a href="/pages/perfil.html" title="Meu Perfil">
                            <img src="/assets/images/profile.png" alt="Meu Perfil">
                        </a>
                    </div>
                </div>
                <div class="menu-mobile checkout-variant">
                     <div class="logo-container-checkout">
                        <a href="/index.html">
                            <img class="logo-sacolao" src="/assets/images/logo.png" alt="Logo Sacolão Rodrigues">
                        </a>
                    </div>
                    <div class="actions-container-checkout">
                        <a href="/pages/perfil.html" title="Meu Perfil">
                            <img src="/assets/images/profile.png" alt="Meu Perfil">
                        </a>
                    </div>
                </div>
            `;
        }

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
                <a href="/pages/checkout.html" title="Carrinho">
                    <img src="/assets/images/cart-icon.png" alt="Carrinho">
                </a>
            </div>
        `;

        let mobileMenuOptionsForThisPage = '';
        if (isPerfilPage) {
            mobileMenuOptionsForThisPage = `
                <a href="/pages/listas.html" class="opcao-btn" title="Minhas Listas">
                    <img src="/assets/images/list-icon.png" alt="Minhas Listas">
                </a>
                <a href="/pages/ofertas.html" class="opcao-btn" title="Minhas Ofertas">
                    <img src="/assets/images/ofertas.png" alt="Minhas Ofertas">
                </a>
                <a href="/pages/ajustes.html" class="opcao-btn" title="Ajustes">
                    <img src="/assets/images/ajustes-icon.png" alt="Ajustes">
                </a>
                <button id="logout-btn-mobile" class="opcao-btn" title="Sair">
                    <img src="/assets/images/log-in.png" alt="Sair">
                </button>
            `;
        } else { 
            mobileMenuOptionsForThisPage = `
                <!-- <a href="/pages/listas.html" class="opcao-btn" title="Minhas Listas">
                    <img src="/assets/images/list-icon.png" alt="Minhas Listas">
                </a> !--> 
                <a href="/pages/ofertas.html" class="opcao-btn" title="Minhas Ofertas">
                    <img src="/assets/images/ofertas.png" alt="Minhas Ofertas">
                </a>
                 <a href="/pages/perfil.html" class="opcao-btn" title="Perfil">
                    <img src="/assets/images/profile.png" alt="Perfil">
                </a>
                 <a href="/pages/checkout.html" class="opcao-btn" title="Carrinho">
                    <img src="/assets/images/cart-icon.png" alt="Carrinho">
                </a>
                <div class="search-section">
                     <button id="search-btn-mobile-menu" class="opcao-btn search-toggle-btn-mobile" title="Buscar Produto">
                        <img src="/assets/images/search-icon.png" alt="Buscar">
                    </button>
                </div>
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
                 <div id="search-popup-mobile">
                    <input type="text" id="search-mobile-input" class="search-bar-popup" placeholder="Buscar produto...">
                </div>
            `;
        }
        
        return `
            <div class="header-grid ${isPerfilPage ? 'perfil-variant' : ''} ${isCheckoutPage ? 'checkout-variant' : ''}">
                ${headerGridDesktopContent}
            </div>
            <div class="menu-mobile ${isPerfilPage ? 'perfil-variant' : ''} ${isCheckoutPage ? 'checkout-variant' : ''}">
                ${menuMobileContent}
            </div>
        `;
    }

    addEventListeners(variant) {
        const shadow = this.shadowRoot;
        const isPerfilPage = variant === 'perfil';
        const isCheckoutPage = variant === 'checkout';

        if (!isCheckoutPage) {
            const hamburguerBtn = shadow.querySelector('.menu-hamburguer-drawer');
            const mobileMenu = shadow.querySelector('.opcao-menu');

            if (hamburguerBtn && mobileMenu) {
                hamburguerBtn.addEventListener('click', () => {
                    mobileMenu.classList.toggle('show');
                    const searchPopupMobile = shadow.querySelector('#search-popup-mobile');
                    if (searchPopupMobile && searchPopupMobile.classList.contains('show') && !mobileMenu.classList.contains('show')) {
                        searchPopupMobile.classList.remove('show');
                    }
                });
            }
        }
        
        const logoutButtonMobile = shadow.querySelector('#logout-btn-mobile');
        if (logoutButtonMobile) {
            logoutButtonMobile.addEventListener('click', () => {
                if (confirm('Deseja realmente sair?')) {
                    window.location.href = "/index.html";
                }
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
                    setTimeout(() => searchInputDesktop.focus(), 50);
                }
            };
            searchBtnDesktop.addEventListener('click', toggleDesktopSearch);
            searchPopupDesktop.addEventListener('click', e => e.stopPropagation());
        }
        
        const searchBtnMobileMenu = shadow.querySelector('#search-btn-mobile-menu');
        const searchPopupMobile = shadow.querySelector('#search-popup-mobile');
        const searchInputMobile = shadow.querySelector('#search-mobile-input');

        if (searchBtnMobileMenu && searchPopupMobile && searchInputMobile) {
            searchBtnMobileMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                searchPopupMobile.classList.toggle('show');
                const mobileMenu = shadow.querySelector('.opcao-menu');
                if (mobileMenu && mobileMenu.classList.contains('show')) {
                    mobileMenu.classList.remove('show');
                }
                if (searchPopupMobile.classList.contains('show')) {
                    setTimeout(() => searchInputMobile.focus(), 50);
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
            const searchBtnMobileMenuEl = shadow.querySelector('#search-btn-mobile-menu');
             if (searchPopupMobileEl && searchPopupMobileEl.classList.contains('show') && !searchPopupMobileEl.contains(e.target) && searchBtnMobileMenuEl && e.target !== searchBtnMobileMenuEl && !searchBtnMobileMenuEl.contains(e.target)) {
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
                    setTimeout(() => searchInputDesktopEl.focus(), 50);
                }
            }
        });

        const searchInputDesktopEl = shadow.querySelector('#search-desktop-input');
        const searchInputMobileEl = shadow.querySelector('#search-mobile-input');

        if (searchInputDesktopEl || searchInputMobileEl) {
            const handleSearchInput = (event) => {
                this.dispatchEvent(new CustomEvent('header-search', {
                    detail: { term: event.target.value },
                    bubbles: true, composed: true
                }));
            };
            if(searchInputDesktopEl) searchInputDesktopEl.addEventListener('input', handleSearchInput);
            if (searchInputMobileEl) searchInputMobileEl.addEventListener('input', handleSearchInput);
        }
    }
}

customElements.define('header-component', Header);