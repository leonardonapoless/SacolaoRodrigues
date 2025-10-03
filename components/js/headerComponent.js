const headerTemplate = document.createElement("template");

class Header extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const variant = this.getAttribute("variant") || "default";
    this.shadowRoot.innerHTML = this.getStyles(variant) + this.getHTML(variant);
    this.addEventListeners(variant);

    this.shadowRoot.host.style.opacity = "0";
    requestAnimationFrame(() => {
      this.shadowRoot.host.style.transition =
        "opacity 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) 0.1s";
      this.shadowRoot.host.style.opacity = "1";
    });

    if (variant === "perfil") {
      this.tryUpdateUserInfoForProfileHeader();
    }

    this.initializeCartLottieAnimations();
    
    if (variant === "checkout") {
      setTimeout(() => {
        this.initializeCheckoutLottieAnimations();
      }, 200);
    }

    this.addCursorHoverSupport();
  }

  tryUpdateUserInfoForProfileHeader() {
    const loggedInUserString = localStorage.getItem("loggedInUser");
    const userInfoSection = this.shadowRoot.querySelector(".user-info");

    if (!userInfoSection) {
      console.warn("headercomponent: secao .user-info nao encontrada.");
      return;
    }

    const userNameElement = userInfoSection.querySelector("h2");
    const userEmailElement = userInfoSection.querySelector("p");

    if (loggedInUserString) {
      try {
        const loggedInUser = JSON.parse(loggedInUserString);
        if (userNameElement)
          userNameElement.textContent = loggedInUser.fullName || "Usuário";
        if (userEmailElement)
          userEmailElement.textContent =
            loggedInUser.email || "email@exemplo.com";
      } catch (e) {
        console.error(
          "headercomponent: erro ao ler dados do usuario logado:",
          e,
        );
        if (userNameElement) userNameElement.textContent = "Visitante";
        if (userEmailElement) userEmailElement.textContent = "erro nos dados";
      }
    } else {
      if (userNameElement) userNameElement.textContent = "Visitante";
      if (userEmailElement)
        userEmailElement.textContent = "Faça login para ver seus dados.";
    }
  }

  initializeCartLottieAnimations() {
    if (typeof lottie === 'undefined') {
      console.warn('Lottie library not loaded. Animations will not work.');
      return;
    }

    const initializeLottieAnimation = (elementId, animationPath, speed = 1.5, isMobile = false) => {
      const element = this.shadowRoot.querySelector(elementId);
      if (element) {
        const animation = lottie.loadAnimation({
          container: element,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: animationPath
        });

        animation.setSpeed(speed);
        animation.goToAndStop(0, true);

        if (isMobile) {
          element.addEventListener('click', () => {
            animation.play();
          });
        } else {
          element.addEventListener('mouseenter', () => {
            animation.play();
          });
          
          element.addEventListener('mouseleave', () => {
            animation.stop();
            animation.goToAndStop(0, true);
          });
        }
      }
    };

    initializeLottieAnimation('#cart-lottie-desktop', '/assets/images/animatedicons/cart.json');
    initializeLottieAnimation('#cart-lottie-mobile', '/assets/images/animatedicons/cart.json', 1.5, true);
    initializeLottieAnimation('#list-lottie-desktop', '/assets/images/animatedicons/list-icon.json');
    initializeLottieAnimation('#list-lottie-mobile', '/assets/images/animatedicons/list-icon.json', 1.5, true);
    
    this.initializeOfertasAnimation();
    
    initializeLottieAnimation('#search-lottie-desktop', '/assets/images/animatedicons/search-icon.json');
    initializeLottieAnimation('#profile-lottie-desktop', '/assets/images/animatedicons/profile.json');
    initializeLottieAnimation('#profile-lottie-mobile', '/assets/images/animatedicons/profile.json', 1.5, true);
    initializeLottieAnimation('#login-lottie-desktop', '/assets/images/animatedicons/login-in.json');
    initializeLottieAnimation('#login-lottie-mobile', '/assets/images/animatedicons/login-in.json', 1.5, true);
    initializeLottieAnimation('#logout-lottie-mobile', '/assets/images/animatedicons/login-in.json', 1.5, true);
    initializeLottieAnimation('#user-profile-lottie', '/assets/images/animatedicons/user-profile-pic.json', 1.0);
    initializeLottieAnimation('#ajustes-lottie-mobile', '/assets/images/animatedicons/editar.json', 1.5, true);
  }

  initializeCheckoutLottieAnimations() {
    if (typeof lottie === 'undefined') {
      console.warn('Lottie library not loaded. Checkout animations will not work.');
      return;
    }

    const initializeCheckoutLottie = (elementId, animationPath, speed = 1.5, isMobile = false) => {
      const element = this.shadowRoot.querySelector(elementId);
      if (element) {
        console.log(`Inicializando ícone Lottie: ${elementId}`);
        const animation = lottie.loadAnimation({
          container: element,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: animationPath
        });

        animation.setSpeed(speed);
        animation.goToAndStop(0, true);

        if (isMobile) {
          element.addEventListener('click', () => {
            animation.play();
          });
        } else {
          element.addEventListener('mouseenter', () => {
            animation.play();
          });
          
          element.addEventListener('mouseleave', () => {
            animation.stop();
            animation.goToAndStop(0, true);
          });
        }
      } else {
        console.warn(`Elemento não encontrado: ${elementId}`);
      }
    };

    initializeCheckoutLottie('#profile-lottie-checkout-desktop', '/assets/images/animatedicons/profile.json');
    initializeCheckoutLottie('#profile-lottie-checkout-mobile', '/assets/images/animatedicons/profile.json', 1.5, true);
  }

  initializeOfertasAnimation() {
    if (typeof lottie === 'undefined') {
      console.warn('Lottie library not loaded. Ofertas animations will not work.');
      return;
    }

    const initializeOfertasLottie = (elementId, isMobile = false) => {
      const element = this.shadowRoot.querySelector(elementId);
      if (element) {
        const animation = lottie.loadAnimation({
          container: element,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          path: '/assets/images/animatedicons/ofertas.json'
        });

        animation.setSpeed(1.5);
        animation.goToAndStop(0, true);

        if (isMobile) {
          element.addEventListener('click', () => {
            animation.play();
          });
        } else {
          element.addEventListener('mouseenter', () => {
            animation.setLoop(true);
            animation.play();
          });
          
          element.addEventListener('mouseleave', () => {
            animation.setLoop(false);
            animation.stop();
            animation.goToAndStop(0, true);
          });
        }
      }
    };

    initializeOfertasLottie('#ofertas-lottie-desktop');
    initializeOfertasLottie('#ofertas-lottie-mobile', true);
    initializeOfertasLottie('#ofertas-lottie-mobile-default', true);
  }

  addCursorHoverSupport() {
    const selectors = 'a, button, img, [id*="lottie"], .logo-container, .logo-container-perfil, .logo-container-checkout, .logo-sacolao, .opcao-btn, .header-icon, [role="button"]';
    const events = {
      mouseenter: 'cursor-hover-enter',
      mouseleave: 'cursor-hover-leave',
      mousedown: 'cursor-click',
      mouseup: 'cursor-release'
    };

    this.shadowRoot.querySelectorAll(selectors).forEach(el => {
      Object.entries(events).forEach(([event, customEvent]) => {
        el.addEventListener(event, () => document.dispatchEvent(new CustomEvent(customEvent)));
      });
    });
  }

  getStyles(variant) {
    let variantStyles = "";

    if (variant === "perfil") {
      variantStyles = `
                :host([variant="perfil"]) .header-grid {
                    margin-top: 30px;
                    grid-template-columns: auto 1fr auto;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 30px;
                    gap: 20px;
                }
                :host([variant="perfil"]) .logo-container-perfil {
                    margin-left: 5px;
                    padding: 0;
                    justify-self: start;
                    transform: translateX(0) scale(0.9);
                    opacity: 0;
                    animation: slideInFromLeft 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
                }
                :host([variant="perfil"]) .logo-container-perfil .logo-sacolao {
                    max-width: 100px;
                    height: auto;
                    display: block;
                }
                :host([variant="perfil"]) .header-right-box {
                    height: 80px;
                    padding: 8px 20px;
                    border-width: 4px;
                    justify-self: end;
                    margin: 0;
                    transform: translateX(15px) scale(0.9);
                    opacity: 0;
                    animation: slideInFromRight 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
                }
                :host([variant="perfil"]) .header-right-box a img {
                    max-width: 45px;
                    height: 45px;
                    padding: 0;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                :host([variant="perfil"]) .header-right-box a:hover img { transform: scale(1.12); }

                :host([variant="perfil"]) .user-info {
                    text-align: center;
                    margin: 0 auto;
                    animation: fadeInUser 0.8s cubic-bezier(0.39, 0.575, 0.565, 1) 0.5s backwards;
                    align-self: center;
                    justify-self: center;
                }
                :host([variant="perfil"]) .avatar img {
                    width: 80px; height: 80px; border-radius: 50%; object-fit: cover;
                    border: 3px solid #4CAF50;
                    transition: transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
                    margin: 0 auto 8px auto;
					box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                :host([variant="perfil"]) .avatar img:hover { transform: scale(1.08); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
                :host([variant="perfil"]) .avatar div[id*="lottie"] {
                    width: 80px !important; 
                    height: 80px !important; 
                    border-radius: 50%; 
                    border: 3px solid #4CAF50;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    transition: transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
                    margin: 0 auto 8px auto;
                }
                :host([variant="perfil"]) .avatar:hover div[id*="lottie"] { 
                    transform: scale(1.08); 
                    box-shadow: 0 6px 12px rgba(0,0,0,0.15); 
                }
                :host([variant="perfil"]) .user-info h2 { margin: 0.5rem 0 0.3rem; color: #333; font-size: 2rem; font-family: 'JetBrains Mono', monospace; }
                :host([variant="perfil"]) .user-info p { color: #666; margin: 0; font-size: 1.4rem; font-family: 'JetBrains Mono', monospace; }

                @media (max-width: 768px) {
                    :host([variant="perfil"]) .header-grid { display: none !important; }
                    :host([variant="perfil"]) .menu-mobile.perfil-variant {
                        display: flex !important;
                        flex-direction: column; align-items: center; width: 100%;
                        padding: 0 10%; box-sizing: border-box; margin-top: 5px; margin-bottom: 5px; gap: 12px;
                    }
                    :host([variant="perfil"]) .header-grid.perfil-variant {
                        max-width: 10%;
                        margin: 0 auto;
                    }
                    
                    @media (max-width: 768px) {
                        :host([variant="perfil"]) .menu-mobile {
                            display: block !important;
                        }
                        :host([variant="perfil"]) .header-grid {
                            display: none !important;
                        }
                        :host([variant="perfil"]) .perfil-mobile-top-row {
                            display: grid !important;
                            grid-template-columns: auto 1fr !important;
                            align-items: center !important;
                            gap: 15px !important;
                            width: 100% !important;
                            padding: 8px 0 !important;
                            opacity: 1 !important;
                            transform: none !important;
                            animation: none !important;
                        }
                        :host([variant="perfil"]) .perfil-mobile-top-row .user-info {
                            display: grid !important;
                            grid-template-columns: auto 1fr !important;
                            align-items: center !important;
                            gap: 10px !important;
                            justify-self: end !important;
                            text-align: right !important;
                            opacity: 1 !important;
                            visibility: visible !important;
                            min-height: 60px !important;
                        }
                        :host([variant="perfil"]) .perfil-mobile-top-row .user-info .avatar {
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        }
                        :host([variant="perfil"]) .perfil-mobile-top-row .user-info .avatar div[id*="lottie"] {
                            width: 60px !important;
                            height: 60px !important;
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        }
                        :host([variant="perfil"]) .perfil-mobile-top-row .user-info .user-text-details {
                            display: flex !important;
                            flex-direction: column !important;
                            justify-content: center !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        }
                        :host([variant="perfil"]) .perfil-mobile-top-row .user-info h2,
                        :host([variant="perfil"]) .perfil-mobile-top-row .user-info p {
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                            color: #333 !important;
                        }
                    }
                    :host([variant="perfil"]) .header-grid .perfil-mobile-top-row {
                        display: grid !important; grid-template-columns: auto 1fr; align-items: center; gap: 15px;
                        width: 100%; padding: 8px 0; box-sizing: border-box;
                        opacity: 1 !important; transform: none !important;
                        animation: none !important;
                    }
                    :host([variant="perfil"]) .menu-mobile .logo-container-perfil {
                        margin: 0; padding: 0; transform: none; opacity: 1; animation: none;
                        justify-self: start;
                    }
                    :host([variant="perfil"]) .menu-mobile .logo-container-perfil .logo-sacolao {
                        max-width: 70px;
                        height: auto;
                        padding: 8px 0;
                        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06));
                        transform: perspective(800px) rotateX(0deg) rotateY(0deg);
                    }
                    
                    :host([variant="perfil"]) .menu-mobile .logo-container-perfil:hover .logo-sacolao {
                        transform: perspective(800px) rotateX(-2deg) rotateY(-1deg) scale(1.02);
                        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08)) 
                                drop-shadow(0 0 8px rgba(121, 148, 111, 0.1));
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info {
                        margin: 0; animation: none; display: grid !important; grid-template-columns: auto 1fr; align-items: center;
                        gap: 10px; justify-self: end; text-align: right;
                        transform: none; opacity: 1 !important; visibility: visible !important;
                        min-height: 60px;
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info .avatar { margin:0; justify-self: start; display: block !important; visibility: visible !important; }
                    :host([variant="perfil"]) .menu-mobile .user-info .avatar img { width: 60px; height: 60px; border-width: 2px; margin:0; }
                    :host([variant="perfil"]) .menu-mobile .user-info .avatar div[id*="lottie"] {
                        width: 60px !important; 
                        height: 60px !important; 
                        border-radius: 50%; 
                        border: 2px solid #4CAF50;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                        margin: 0;
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info .user-text-details { text-align: right; display: flex !important; flex-direction: column; justify-content: center; justify-self: end; visibility: visible !important; }
                    :host([variant="perfil"]) .menu-mobile .user-info h2 { font-size: 1.3rem; margin: 0; line-height: 1.1; padding-bottom: 4px; font-family: 'JetBrains Mono', monospace; display: block !important; visibility: visible !important; opacity: 1 !important; color: #333 !important; }
                    :host([variant="perfil"]) .menu-mobile .user-info p { font-size: 1.1rem; margin: 0; line-height: 1.1; font-family: 'JetBrains Mono', monospace; display: block !important; visibility: visible !important; opacity: 1 !important; color: #666 !important; }
                    :host([variant="perfil"]) .menu-mobile .menu-hamburguer-drawer {
                    width: 100%;
                    margin-top: 10px;
                    animation-delay: 0.25s;
                    font-family: 'Limelight', normal;
                    font-size: 1.8rem;
                    font-weight: bold;
                    text-shadow: -4px 2px 5px rgba(0, 0, 0, 0.25);
					}
                    :host([variant="perfil"]) .menu-mobile .opcao-menu { width: 100%; margin-top: 0px; }
                }
            `;
    }
    else if (variant === "checkout") {
      variantStyles = `

                :host([variant="checkout"]) .header-grid.checkout-variant {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 20px 25px 10px 25px; max-width: 1250px; margin: 0 auto;
                }
                :host([variant="checkout"]) .logo-container-checkout {
                    opacity: 0;
                    transform: translateX(-30px) scale(0.9);
                    animation: slideInFromLeft 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
                }
                :host([variant="checkout"]) .logo-container-checkout .logo-sacolao {
                    max-width: 100px;
                    height: auto;
                    display: block;
                    padding: 15px 0;
                    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
                    transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
                }
                
                :host([variant="checkout"]) .logo-container-checkout:hover .logo-sacolao {
                    transform: perspective(1000px) rotateX(-3deg) rotateY(-1deg) scale(1.03);
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12)) 
                            drop-shadow(0 0 15px rgba(121, 148, 111, 0.15));
                    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                :host([variant="checkout"]) .checkout-title {
                    text-align: center; 
                    color: #000; 
                    font-size: 2.2em; 
                    font-weight: 700;
                    margin: 0; 
                    text-shadow: -3px 2px 4px rgba(0, 0, 0, 0.2), 0 0 20px rgba(121, 148, 111, 0.3); 
                    flex-grow: 1;
                    opacity: 0;
                    transform: translateY(-25px) scale(0.9);
                    animation: fadeInUser 1s cubic-bezier(0.39, 0.575, 0.565, 1) 0.4s forwards;
                    letter-spacing: 1px;
                }
                
                :host([variant="checkout"]) .checkout-title:hover {
                    transform: scale(1.02);
                    text-shadow: -3px 2px 6px rgba(0, 0, 0, 0.25), 0 0 25px rgba(121, 148, 111, 0.4);
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
                :host([variant="checkout"]) .actions-container-checkout {
                    box-shadow: 3px -4px 0px 2px #000, 6px 14px 12.5px 2px rgba(0, 0, 0, 0.25);
                    height: 80px; padding: 0 25px; display: flex; align-items: center; justify-content: center;
                    border-radius: 60px; background-color: #79946F; border: 6px solid #000;
                    gap: 20px; transition: box-shadow 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
                    opacity: 0;
                    transform: translateX(30px) scale(0.9);
                    animation: slideInFromRight 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
                }
                :host([variant="checkout"]) .actions-container-checkout a img {
                    max-width: 45px; height: 45px; padding: 0;
                    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
                }
                :host([variant="checkout"]) .actions-container-checkout:hover {
                    box-shadow: 0px 0px 0px 3px #000, 8px 18px 18px 3px rgba(0, 0, 0, 0.3);
                }
                :host([variant="checkout"]) .actions-container-checkout a:hover img { transform: scale(1.1); }

                @media (max-width: 768px) {
                    :host([variant="checkout"]) .header-grid.checkout-variant { display: none !important; }
                    :host([variant="checkout"]) .menu-mobile.checkout-variant {
                        display: flex !important;
                        flex-direction: row; justify-content: space-between; align-items: center;
                        width: 100%; padding: 8px 15px; border-bottom: 1px solid #eaeaea;
                        box-sizing: border-box;
                        margin-top: 5px; margin-bottom: 5px; gap: 12px;
                        background-color: #f1f0d9;
                    }
                    :host([variant="checkout"]) .menu-mobile.checkout-variant .logo-container-checkout {
                        opacity: 0;
                        transform: translateX(-20px) scale(0.9);
                        animation: slideInFromLeft 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.1s forwards;
                    }
                    :host([variant="checkout"]) .menu-mobile.checkout-variant .logo-container-checkout .logo-sacolao {
                        max-width: 70px;
                        height: auto;
                        padding: 8px 0;
                        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06));
                        transform: perspective(800px) rotateX(0deg) rotateY(0deg);
                    }
                    
                    :host([variant="checkout"]) .menu-mobile.checkout-variant .logo-container-checkout:hover .logo-sacolao {
                        transform: perspective(800px) rotateX(-2deg) rotateY(1deg) scale(1.01);
                        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08)) 
                                drop-shadow(0 0 8px rgba(121, 148, 111, 0.1));
                    }
                    :host([variant="checkout"]) .menu-mobile.checkout-variant .actions-container-checkout {
                        background-color: #79946F;
                        border: 4px solid #000;
                        border-radius: 30px;
                        height: 50px;
                        padding: 0 15px;
                        display: flex; align-items: center; justify-content: center;
                        gap: 15px;
                        transition: box-shadow 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
                        opacity: 0;
                        transform: translateX(20px) scale(0.9);
                        animation: slideInFromRight 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.1s forwards;
                    }
                    :host([variant="checkout"]) .menu-mobile.checkout-variant .actions-container-checkout a img {
                        max-width: 28px; height: 28px; padding: 0;
                        transition: transform 0.2s ease-out;
                    }
                    :host([variant="checkout"]) .menu-mobile.checkout-variant .actions-container-checkout:hover {
                        box-shadow: 0px 0px 0px 2px #000, 4px 8px 8px 2px rgba(0, 0, 0, 0.3);
                    }
                    :host([variant="checkout"]) .menu-mobile.checkout-variant .actions-container-checkout a:hover img {
                        transform: scale(1.1);
                    }
                    :host([variant="checkout"]) .checkout-title {
                        display: none;
                    }
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
                    cursor: none !important;
                }
                
                *:hover, *:active, *:focus {
                    cursor: none !important;
                }

				@keyframes fadeInUser { from { opacity: 0; transform: translateY(15px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes slideInFromLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes slideInFromRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes scaleUp { from { transform: scale(0.9); opacity: 0;} to { transform: scale(1); opacity: 1;} }
                @keyframes mobileMenuButtonAppear { from { opacity: 0; transform: translateY(15px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }

                :host {
                    display: block;
                    position: relative;
                    z-index: 1000;
                }
                :host([variant="perfil"]) { margin-bottom: 15px; }
                :host([variant="checkout"]) { margin-bottom: 0; }

                a { text-decoration: none; color: inherit; display: inline-flex; align-items: center; justify-content: center; }
                button { border: none; background-color: transparent; cursor: pointer; padding: 0; display: flex; align-items: center; }
                img { display: block; }

                .header-grid {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    max-width: 1250px;
                    margin: 0 auto;
                    padding: 50px 60px;
                    background-color: transparent;
                }

				.header-left-box, .header-right-box {
                    height: 80px;
                    padding: 0 25px;
                    display: flex; align-items: center; justify-content: center;
                    border-radius: 60px;
                    background-color: #79946F;
                    border: 6px solid #000;
                    gap: 20px;
                    transition: box-shadow 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
                }
                .header-left-box {
                    box-shadow: -3px -4px 0px 2px #000, 6px 14px 12.5px 2px rgba(0, 0, 0, 0.25);
                    justify-self: start;
                    transform: translateX(-30px); opacity: 0;
                    animation: slideInFromLeft 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
                }
                .header-right-box {
                    box-shadow: 3px -4px 0px 2px #000, 6px 14px 12.5px 2px rgba(0, 0, 0, 0.25);
                    justify-self: end;
                    transform: translateX(30px); opacity: 0;
                    animation: slideInFromRight 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards;
                }
                .header-left-box:hover, .header-right-box:hover {
                    box-shadow: 0px 0px 0px 3px #000, 8px 18px 18px 3px rgba(0, 0, 0, 0.3);
                }

				.header-left-box img, .header-right-box a img {
                    max-width: 45px;
                    height: 45px;
                    padding: 0;
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .header-left-box a:hover img, .header-right-box a:hover img,
                .header-left-box button:hover img {
                    transform: scale(1.12);
                }

                div[id*="lottie"] {
                    display: block !important;
                    visibility: visible !important;
                }

                .search-section { position: relative; }
                .search-section button img { max-width: 60px; padding: 8px; }
                #search-popup-desktop {
                    position: absolute; top: 140%; right: -10px;
                    background-color: #f8f8f8; border: 3px solid #565555; border-radius: 50px;
                    padding: 12px 15px; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25); z-index: 100;
                    opacity: 0; visibility: hidden; transform: translateY(-15px) translateX(120px) scale(0.9);
                    transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), visibility 0s linear 0.3s, transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
                    min-width: 260px;
                }
                #search-popup-desktop.show {
                    opacity: 1; visibility: visible; transform: translateY(0) translateX(120px) scale(1);
                    transition-delay: 0s;
                }
                .search-bar-popup {
                    width: 100%; padding: 10px 18px;
					border: none;
					font-size: 1.6rem; background-color: #f8f8f8; box-sizing: border-box;
                }
                .search-bar-popup:focus { outline: none; }

                .logo-container, .logo-container-perfil {
                    margin-top: 10px;
                    justify-self: center;
                    opacity: 0; transform: scale(0.85);
                    animation: scaleUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.4s forwards;
                }
                .logo-sacolao {
                    max-width: 130px;
                    height: auto;
                    padding: 15px 0;
                    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
                    transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
                }
                
                .logo-container:hover .logo-sacolao,
                .logo-container-perfil:hover .logo-sacolao {
                    transform: perspective(500px) rotateX(-5deg) rotateY(2deg) scale(1.01);
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12)) 
                            drop-shadow(0 0 15px rgba(121, 148, 111, 0.15));
                    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }


                .menu-mobile { display: none; }

                @media (max-width: 768px) {
                    :host(:not([variant="checkout"])) .header-grid { display: none !important; }

                    /* mostra e ajusta o header mobile (default e perfil) */
                    :host(:not([variant="checkout"])) .menu-mobile {
                        display: flex !important; /* faz ele aparecer */
                        flex-direction: column; align-items: center; width: 100%; /* um item embaixo do outro, no centro */
                        position: relative; z-index: 20; /* pra ficar a frente e posicionar o popup de busca */
                        margin-top: 5px; margin-bottom: 5px; gap: 12px; /* espacamentos */
                        box-sizing: border-box; padding: 0 5%; /* espacamento nas laterais */
                    }

                    /* logo header mobile (variante default) */
                    :host([variant="default"]) .menu-mobile .logo-container {
                        width: 100%; order: -1; /* logo vem primeiro */
                        margin: 0 auto; padding: 10px 0; display: flex; justify-content: center; /* centraliza */
                        opacity: 0; transform: translateY(-20px) scale(0.9); /* pra animacao */
                        animation: mobileMenuButtonAppear 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) 0.1s forwards; /* animacao */
                    }
                    :host([variant="default"]) .menu-mobile .logo-container .logo-sacolao {
                         max-width: 90px;
                         height: auto; /* tamanho da logo mobile */
                         padding: 8px 0;
                         transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                         filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.06));
                         transform: perspective(800px) rotateX(0deg) rotateY(0deg);
                    }
                    
                    /* Animação da logo mobile no hover */
                    :host([variant="default"]) .menu-mobile .logo-container:hover .logo-sacolao {
                        transform: perspective(800px) rotateX(-2deg) rotateY(1deg) scale(1.01);
                        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08)) 
                                drop-shadow(0 0 8px rgba(121, 148, 111, 0.1));
                    }

					.search-bar-popup {
						border: 4px solid #000;
						border-radius: 20px;
                		box-shadow: 3px -4px 0px 2px #000, 6px 6px 12.5px 2px rgba(0, 0, 0, 0.25);
						margin-bottom: 30px;
					}

                    .menu-hamburguer-drawer {
                        display: block;
                        background-color: #d6a9a1; border: 4px solid #000;
                        border-radius: 30px; padding: 12px 25px; font-size: 1.8rem;
                        font-family: 'Limelight', normal;
                        text-shadow: -4px 2px 5px rgba(0, 0, 0, 0.25);
                        box-shadow: 3px 7px 12.5px 2px rgba(0, 0, 0, 0.25), 0px 3px 0px 2px #000;
                        width: 100%; text-align: center; cursor: pointer;
                        transition: background-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.6s cubic-bezier(0.25, 0.1, 0.25, 1);
                        opacity: 0; transform: translateY(-20px) scale(0.9);
                        animation: mobileMenuButtonAppear 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) 0.2s forwards;
                    }
                    .menu-hamburguer-drawer:hover {
                        background-color: #c9938b;
                        box-shadow: 4px 9px 16px 2px rgba(0, 0, 0, 0.3), 0px 4px 0px 2px #000;
                        transform: translateY(-2px) scale(1.0);
                    }
                    .menu-hamburguer-drawer:active { transform: translateY(0px) scale(0.97); }

                    .opcao-menu {
                        display: flex; flex-direction: column; align-items: center;
                        overflow: hidden; max-height: 0; opacity: 0; visibility: hidden;
                        pointer-events: none;
                        gap: 18px;
                        border-radius: 30px; font-size: 1.8rem;
                        width: 90%;
                        padding: 0 20px; box-sizing: border-box; margin-top: 0;
                    }
                    .opcao-menu.show {
                        max-height: 500px; opacity: 1; visibility: visible; pointer-events: auto;
                        padding: 25px 20px;
                    }
                    .opcao-btn {
                        font-family: 'Limelight', normal;
                        text-shadow: -4px 2px 5px rgba(0, 0, 0, 0.25);
                        font-size: 1.6rem;
                        background-color: #d6a9a1;
                        padding: 12px 35px;
                        font-weight: bold;
                        border-radius: 30px;
                        border: 3px solid #000;
                        cursor: pointer;
                        -webkit-box-shadow: 3px 7px 12.5px 2px rgba(0, 0, 0, 0.25), 0px 3px 0px 2px #000;
                        box-shadow: 3px 7px 12.5px 2px rgba(0, 0, 0, 0.25), 0px 3px 0px 2px #000;
                        margin: 0;
                        -webkit-transition: background-color 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), -webkit-transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), -webkit-box-shadow 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
                        transition: background-color 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), color 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
                        display: inline-flex; align-items: center; justify-content: center;
                        text-decoration: none;
                        box-sizing: border-box; line-height: normal;
                        width: 100%; text-align: center;
                        opacity: 0;
                    }
                    .opcao-btn span { display: none; }
                    .opcao-btn div[id*="lottie"] { 
                        width: 28px !important; 
                        height: 28px !important; 
                        margin-right: 8px; 
                        flex-shrink: 0; 
                    }
                    .opcao-menu.show .opcao-btn { opacity: 1; }

                    .opcao-btn:hover {
                        background-color: #c9938b;
                        color: #fff;
                        -webkit-transform: translateY(-5px) scale(1.04);
                        transform: translateY(-5px) scale(1.04);
                        -webkit-box-shadow: 5px 11px 18px 2px rgba(0, 0, 0, 0.3), 0px 5px 0px 2px #000;
                        box-shadow: 5px 11px 18px 2px rgba(0, 0, 0, 0.3), 0px 5px 0px 2px #000;
                    }
                    .opcao-btn img { width: 28px; height: 28px; flex-shrink: 0; margin-right: 8px; }

                    :host([variant="default"]) #search-popup-mobile {
                        position: absolute; top: 110%;
                        left: 50%;
                        background-color: #f8f8f8; border: 3px solid #565555; border-radius: 50px;
                        padding: 12px 15px; box-shadow: 0 6px 15px rgba(0,0,0,0.25); z-index: 101;
                        opacity: 0; visibility: hidden; width: 90%;
                        transform: translateX(-50%) translateY(-15px) scale(0.95);
                        transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), visibility 0s linear 0.3s, transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
                    }
                    :host([variant="default"]) #search-popup-mobile.show {
                        opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0) scale(1);
                        transition-delay: 0.8s;
					}
                }

                @media (min-width: 769px) {
                    :host([variant="checkout"]) .menu-mobile.checkout-variant { display: none !important; }
                    :host([variant="checkout"]) .header-grid.checkout-variant { display: flex !important; }

                    :host(:not([variant="checkout"])) .menu-mobile { display: none !important; }
                    :host([variant="default"]) .header-grid { display: grid !important; }
                    :host([variant="perfil"]) .header-grid { display: grid !important; }
                 }

                ${variantStyles}
            </style>
        `;
  }

  getHTML(variant) {
    const isPerfilPage = variant === "perfil";
    const isCheckoutPage = variant === "checkout";

    if (isCheckoutPage) {
      return `
                <div class="header-grid checkout-variant">
                    <div class="logo-container-checkout">
                        <a href="/index.html">
                            <img class="logo-sacolao" src="/assets/images/logo.png" alt="logo sacolao rodrigues">
                        </a>
                    </div>
                    <h1 class="checkout-title">Finalizar Compra</h1>
                    <div class="actions-container-checkout">
                        <a href="/pages/perfil.html" title="meu perfil">
                            <div id="profile-lottie-checkout-desktop" style="width: 45px; height: 45px;"></div>
                        </a>
                    </div>
                </div>
                <div class="menu-mobile checkout-variant">
                     <div class="logo-container-checkout">
                        <a href="/index.html">
                            <img class="logo-sacolao" src="/assets/images/logo.png" alt="logo sacolao rodrigues">
                        </a>
                    </div>
                    <div class="actions-container-checkout">
                        <a href="/pages/perfil.html" title="meu perfil">
                            <div id="profile-lottie-checkout-mobile" style="width: 40px; height: 40px;"></div>
                        </a>
                    </div>
                </div>
            `;
    }

    const desktopLeftBoxHTML = `
            <div class="header-left-box">
                <a href="/pages/listas.html" title="lista de compras">
                    <div id="list-lottie-desktop" style="width: 55px; height: 55px;"></div>
                </a>
                <a href="/pages/ofertas.html" title="ofertas">
                    <div id="ofertas-lottie-desktop" style="width: 55px; height: 55px;"></div>
                </a>
                <div class="search-section">
                    <button id="search-btn-desktop" class="search-toggle-btn" title="buscar produto">
                        <div id="search-lottie-desktop" style="width: 55px; height: 55px;"></div>
                    </button>
                    <div id="search-popup-desktop">
                        <input type="text" id="search-desktop-input" class="search-bar-popup" placeholder="buscar produto...">
                    </div>
                </div>
            </div>
        `;

    const desktopLogoHTML = (logoContainerClass = "logo-container") => `
            <div class="${logoContainerClass}">
                <a href="/index.html">
                    <img class="logo-sacolao" src="/assets/images/logo.png" alt="logo sacolao rodrigues">
                </a>
            </div>
        `;

    const userInfoHTML = `
            <section class="user-info">
                <div class="avatar">
                    <div id="user-profile-lottie" style="width: 80px; height: 80px;"></div>
                </div>
                <div class="user-text-details">
                    <h2>carregando...</h2>
                    <p>carregando...</p>
                </div>
            </section>
        `;

    const desktopRightBoxHTML = `
            <div class="header-right-box">
                ${
                  isPerfilPage
                    ? ""
                    : `
                <a href="/pages/cadastro.html" title="criar conta">
                    <div id="login-lottie-desktop" style="width: 60px; height: 60px;"></div>
                </a>
                <a href="/pages/perfil.html" title="meu perfil">
                    <div id="profile-lottie-desktop" style="width: 60px; height: 60px;"></div>
                </a>`
                }
                <a href="/pages/checkout.html" title="carrinho">
                    <div id="cart-lottie-desktop" style="width: 60px; height: 60px;"></div>
                </a>
            </div>
        `;

    let desktopHeaderGridContent = "";
    if (isPerfilPage) {
      desktopHeaderGridContent = `
                ${desktopLogoHTML("logo-container-perfil")}
                ${userInfoHTML}
                ${desktopRightBoxHTML}
            `;
    } else {
      desktopHeaderGridContent = `
                ${desktopLeftBoxHTML}
                ${desktopLogoHTML()}
                ${desktopRightBoxHTML}
            `;
    }

    let mobileMenuOptions = "";
    if (isPerfilPage) {
      mobileMenuOptions = `
                <a href="/pages/listas.html" class="opcao-btn" title="minhas listas">
                    <div id="list-lottie-mobile" style="width: 30px; height: 30px;"></div>
                </a>
                <a href="/pages/ofertas.html" class="opcao-btn" title="minhas ofertas">
                    <div id="ofertas-lottie-mobile" style="width: 30px; height: 30px;"></div>
                </a>
                <a href="/pages/ajustes.html" class="opcao-btn" title="ajustes">
                    <div id="ajustes-lottie-mobile" style="width: 30px; height: 30px;"></div>
                </a>
                <button id="logout-btn-mobile" class="opcao-btn" title="sair">
                    <div id="logout-lottie-mobile" style="width: 30px; height: 30px;"></div>
                </button>
            `;
    } else {
      mobileMenuOptions = `
                <a href="/pages/ofertas.html" class="opcao-btn" title="minhas ofertas">
                    <div id="ofertas-lottie-mobile-default" style="width: 30px; height: 30px;"></div>
                </a>
                <a href="/pages/perfil.html" class="opcao-btn" title="perfil">
                    <div id="profile-lottie-mobile" style="width: 30px; height: 30px;"></div>
                </a>
                <a href="/pages/checkout.html" class="opcao-btn" title="carrinho">
                    <div id="cart-lottie-mobile" style="width: 30px; height: 30px;"></div>
                </a>
                 <a href="/pages/cadastro.html" class="opcao-btn" title="criar conta/login">
                    <div id="login-lottie-mobile" style="width: 30px; height: 30px;"></div>
                </a>
               <!-- <div class="search-section">
                     <button id="search-btn-mobile-menu" class="opcao-btn search-toggle-btn-mobile" title="buscar produto">
                        <img src="/assets/images/search-icon.png" alt="buscar">
                    </button>
                </div>-->
            `;
    }

    let menuMobileContent = "";
    if (isPerfilPage) {
      menuMobileContent = `
                <div class="perfil-mobile-top-row">
                    ${desktopLogoHTML("logo-container-perfil")}
                    ${userInfoHTML}
                </div>
                <button class="menu-hamburguer-drawer">☰ Menu</button>
                <div class="opcao-menu">
                    ${mobileMenuOptions}
                </div>
            `;
    } else {
      menuMobileContent = `
                ${desktopLogoHTML()}
				<div id="search-popup-mobile">
                    <input type="text" id="search-mobile-input" class="search-bar-popup" placeholder="buscar produto...">
                </div>
                <button class="menu-hamburguer-drawer">☰ Menu</button>
                <div class="opcao-menu">
                    ${mobileMenuOptions}
                </div>
            `;
    }

    return `
            <div class="header-grid ${isPerfilPage ? "perfil-variant" : ""}">
                ${desktopHeaderGridContent}
            </div>
            <div class="menu-mobile ${isPerfilPage ? "perfil-variant" : ""}">
                ${menuMobileContent}
            </div>
        `;
  }

  addEventListeners(variant) {
    const shadow = this.shadowRoot;
    const isCheckoutPage = variant === "checkout";

    if (!isCheckoutPage) {
      const hamburguerBtn = shadow.querySelector(".menu-hamburguer-drawer");
      const mobileMenu = shadow.querySelector(".opcao-menu");
      if (hamburguerBtn && mobileMenu) {
        hamburguerBtn.addEventListener("click", () => {
          mobileMenu.classList.toggle("show");
          const searchPopupMobile = shadow.querySelector(
            "#search-popup-mobile",
          );
          if (
            searchPopupMobile &&
            searchPopupMobile.classList.contains("show") &&
            !mobileMenu.classList.contains("show")
          ) {
            searchPopupMobile.classList.remove("show");
          }
        });
      }
    }

    if (variant === "perfil") {
      const logoutButtonMobile = shadow.querySelector("#logout-btn-mobile");
      if (logoutButtonMobile) {
        logoutButtonMobile.addEventListener("click", () => {
          if (confirm("deseja realmente sair?")) {
            localStorage.removeItem("loggedInUser");
            window.location.href = "/index.html";
          }
        });
      }
    }

    const searchBtnDesktop = shadow.querySelector("#search-btn-desktop");
    const searchPopupDesktop = shadow.querySelector("#search-popup-desktop");
    const searchInputDesktop = shadow.querySelector("#search-desktop-input");
    if (searchBtnDesktop && searchPopupDesktop && searchInputDesktop) {
      searchBtnDesktop.addEventListener("click", (e) => {
        e.stopPropagation();
        searchPopupDesktop.classList.toggle("show");
        if (searchPopupDesktop.classList.contains("show")) {
          setTimeout(() => searchInputDesktop.focus(), 50);
        }
      });
      searchPopupDesktop.addEventListener("click", (e) => e.stopPropagation());
    }

    const searchBtnMobileMenu = shadow.querySelector("#search-btn-mobile-menu");
    const searchPopupMobile = shadow.querySelector("#search-popup-mobile");
    const searchInputMobile = shadow.querySelector("#search-mobile-input");
    if (searchBtnMobileMenu && searchPopupMobile && searchInputMobile) {
      searchBtnMobileMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        searchPopupMobile.classList.toggle("show");
        if (searchPopupMobile.classList.contains("show")) {
          setTimeout(() => searchInputMobile.focus(), 50);
        }
      });
      searchPopupMobile.addEventListener("click", (e) => e.stopPropagation());
    }

    const handleClickOutside = (e) => {
      if (
        searchPopupDesktop &&
        searchPopupDesktop.classList.contains("show") &&
        !searchPopupDesktop.contains(e.target) &&
        e.target !== searchBtnDesktop &&
        searchBtnDesktop &&
        !searchBtnDesktop.contains(e.target)
      ) {
        searchPopupDesktop.classList.remove("show");
      }
      if (
        searchPopupMobile &&
        searchPopupMobile.classList.contains("show") &&
        !searchPopupMobile.contains(e.target) &&
        searchBtnMobileMenu &&
        e.target !== searchBtnMobileMenu &&
        !searchBtnMobileMenu.contains(e.target)
      ) {
        searchPopupMobile.classList.remove("show");
      }
    };
    this.ownerDocument.addEventListener("click", handleClickOutside);

    const handleEscapeKey = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        if (searchPopupDesktop && searchPopupDesktop.classList.contains("show"))
          searchPopupDesktop.classList.remove("show");
        if (searchPopupMobile && searchPopupMobile.classList.contains("show"))
          searchPopupMobile.classList.remove("show");
      }
    };
    this.ownerDocument.addEventListener("keydown", handleEscapeKey);

    this.ownerDocument.addEventListener("keydown", (e) => {
      if (e.key === "/" && searchBtnDesktop && searchInputDesktop) {
        const isDesktopLayout =
          getComputedStyle(searchBtnDesktop).display !== "none";
        if (!isDesktopLayout) return;

        const activeEl = this.ownerDocument.activeElement;
        const isSearchInputActive = activeEl === searchInputDesktop;
        const isTypingInForm =
          (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA") &&
          activeEl !== searchInputDesktop;

        if (isSearchInputActive || isTypingInForm) return;

        e.preventDefault();
        if (searchPopupDesktop.classList.contains("show")) {
          searchInputDesktop.focus();
        } else {
          searchPopupDesktop.classList.add("show");
          setTimeout(() => searchInputDesktop.focus(), 50);
        }
      }
    });

    if (searchInputDesktop || searchInputMobile) {
      const handleSearchInputEvent = (event) => {
        this.dispatchEvent(
          new CustomEvent("header-search", {
            detail: { term: event.target.value },
            bubbles: true,
            composed: true,
          }),
        );
      };
      if (searchInputDesktop)
        searchInputDesktop.addEventListener("input", handleSearchInputEvent);
      if (searchInputMobile)
        searchInputMobile.addEventListener("input", handleSearchInputEvent);
    }

    this.cleanupGlobalListeners = () => {
      this.ownerDocument.removeEventListener("click", handleClickOutside);
      this.ownerDocument.removeEventListener("keydown", handleEscapeKey);
    };
  }

  disconnectedCallback() {
    if (this.cleanupGlobalListeners) {
      this.cleanupGlobalListeners();
    }
  }
}

customElements.define("header-component", Header);
