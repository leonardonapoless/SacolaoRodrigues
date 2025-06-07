// cria um molde pro header/gera o html e css no javascript pelas funcoes gethtml e getstyles
const headerTemplate = document.createElement('template');

// define a classe Header que e a base do elemento <header-component> e tem as funcionalidades padrao do html pelo
// extends HTMLElement
class Header extends HTMLElement {
    // o constructor cria o header 
    constructor() {
        super(); // chama o constructor da classe mae (htmlelement)
        this.attachShadow({ mode: 'open' }); // cria uma  shadow DOM pro componente ficar isolado do resto da pagina, em um espaco encapsulado para os estilos e scripts dentro dele nao afetarem o resto da pagina
    }

    // funcao chamada quando o componente e colocado na pagina html
    connectedCallback() {
        const variant = this.getAttribute('variant') || 'default'; // ve qual e a variante do header (tipo 'default', 'perfil' ou 'checkout')
        // coloca o css (getstyles) e o html (gethtml) dentro da shadowdom do componente
        this.shadowRoot.innerHTML = this.getStyles(variant) + this.getHTML(variant);
        // adiciona os eventlisteners (ex.: o que fazer quando clica em um botao)
        this.addEventListeners(variant);

        // faz o header aparecer suavemente na tela
        this.shadowRoot.host.style.opacity = '0'; // comeca transparente
        requestAnimationFrame(() => { // fala pro navegador fazer a animacao no proximo frame
            this.shadowRoot.host.style.transition = 'opacity 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) 0.1s'; // como vai ser a animacao
            this.shadowRoot.host.style.opacity = '1'; // fica totalmente visivel
        });

        // se for a variante perfil ele tenta mostrar o nome e email do usuario
        if (variant === 'perfil') {
            this.tryUpdateUserInfoForProfileHeader();
        }
    }

    // essa funcao tenta atualizar o nome e email do usuario no header da pagina de perfil
    tryUpdateUserInfoForProfileHeader() {
        const loggedInUserString = localStorage.getItem('loggedInUser'); // pega os dados do usuario logado que guardamos antes
        const userInfoSection = this.shadowRoot.querySelector('.user-info'); // procura a parte de "user-info" no html do header

        // se nao achar a parte de "user-info" nao faz nada
        if (!userInfoSection) {
            // console.warn("headercomponent: secao .user-info nao encontrada."); 
            return;
        }

        const userNameElement = userInfoSection.querySelector('h2'); // onde vai o nome
        const userEmailElement = userInfoSection.querySelector('p'); // onde vai o email

        if (loggedInUserString) { 
			// se tem informacao de usuario logado guardada
            try {
                const loggedInUser = JSON.parse(loggedInUserString); // transforma o texto de volta num objeto
                if (userNameElement) userNameElement.textContent = loggedInUser.fullName || "usuario"; // poe o nome ou "usuario" se nao tiver nome
                if (userEmailElement) userEmailElement.textContent = loggedInUser.email || "email@exemplo.com"; // poe o email
            } catch (e) {
				// se der erro ao ler os dados
                console.error("headercomponent: erro ao ler dados do usuario logado:", e);
                if (userNameElement) userNameElement.textContent = "visitante"; // mostra "visitante"
                if (userEmailElement) userEmailElement.textContent = "erro nos dados"; // mostra "erro nos dados"
            }
        } else { 
			// se nao tem usuario logado guardado
            if (userNameElement) userNameElement.textContent = "visitante";
            if (userEmailElement) userEmailElement.textContent = "faca login para ver seus dados";
        }
    }

	// getstyles retorna uma string com todo o css do componente
    // essa funcao monta todo o css do header
    // o variant diz qual tipo de header vai estar na pagina (default, perfil, checkout)
    getStyles(variant) {
        let variantStyles = ''; // aqui vai o css especifico pra cada variante

        // css da variante 'perfil'
        if (variant === 'perfil') {
            variantStyles = `
                /* styles para a variante 'perfil' quando esta no desktop */
                :host([variant="perfil"]) .header-grid { 
                    margin-top: 30px; 
                    grid-template-columns: auto 1fr auto; /* 3 colunas: logo | info do usuario | acoes */
                    justify-content: space-between; /* espalha as colunas */
                    align-items: center; 
                    padding: 15px 30px; 
                    gap: 20px; 
                }
                :host([variant="perfil"]) .logo-container-perfil { 
                    margin-left: -33px; 
                    padding: 0; 
                    justify-self: start; /* alinha a logo na esquerda da sua coluna */
                    transform: translateX(-15px); /* comeca um pouco pra esquerda pra animacao */
                    opacity: 0; /* comeca transparente pra animacao */
                    animation: slideInFromLeft 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.3s forwards; /* nome da animacao pra ela aparecer */
                }
                :host([variant="perfil"]) .logo-container-perfil .logo-sacolao { 
                    max-width: 150px; 
                    display: block; /* pra imagem se comportar direito*/
                }
                :host([variant="perfil"]) .header-right-box { /* container dos botoes na direita */
                    height: auto; 
                    padding: 8px 20px; 
                    border-width: 4px;
                    justify-self: end; /* alinha o container na direita da coluna */
                    margin-left: 0; 
                    margin-bottom: -20px; /* ajustar pra cima */
                    transform: translateX(15px); /* comeca um pouco a direita pra animacao */
                    opacity: 0; /* comeca transparente */
                    animation: slideInFromRight 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.3s forwards; /* animacao pra aparecer */
                }
                :host([variant="perfil"]) .header-right-box a img {
					/* as imagens dos icones na direita */
                    max-width: 28px;
					height: 28px;
					padding: 0;
					margin-left: -3px; 
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* animacao suave quando mexe o mouse */
                }
                :host([variant="perfil"]) .header-right-box a:hover img { transform: scale(1.15); } /* aumenta tamanho no hover*/

                :host([variant="perfil"]) .user-info { 
                    text-align: center; 
                    margin: 0 auto; /* centralizar na coluna do meio */
                    animation: fadeInUser 0.8s cubic-bezier(0.39, 0.575, 0.565, 1) 0.5s backwards; /* animacao pra aparecer */
                    align-self: center; 
                    justify-self: center; 
                }
                :host([variant="perfil"]) .avatar img { 
                    width: 80px; height: 80px; border-radius: 50%; object-fit: cover; /* deixa redonda e preenche */
                    border: 3px solid #4CAF50; 
                    transition: transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.35s cubic-bezier(0.165, 0.84, 0.44, 1); /* animacao suave */
                    margin: 0 auto 8px auto;
					box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* sombra */
                }
                :host([variant="perfil"]) .avatar img:hover { transform: scale(1.08); box-shadow: 0 6px 12px rgba(0,0,0,0.15); } /* aumenta e muda sombra com hover */
                :host([variant="perfil"]) .user-info h2 { margin: 0.5rem 0 0.3rem; color: #333; font-size: 1.5rem; } /* estilo do nome */
                :host([variant="perfil"]) .user-info p { color: #666; margin: 0; font-size: 1rem; } /* estilo do email */

				/*styles pra variante perfil mobile*/
                @media (max-width: 768px) {
                    :host([variant="perfil"]) .header-grid { display: none !important; } /* esconde o style do desktop */
                    :host([variant="perfil"]) .menu-mobile.perfil-variant { /*mostra e ajusta os styles para mobile*/
                        display: flex !important; /* faz os itens ficarem um do lado do outro ou um embaixo do outro */
                        flex-direction: column; align-items: center; width: 100%; /* um embaixo do outro, no centro, largura total */
                        padding: 0 10%; box-sizing: border-box; margin-top: 5px; margin-bottom: 5px; gap: 12px; /* espacamentos */
                    }
                    :host([variant="perfil"]) .perfil-mobile-top-row { /*linha de cima no perfil mobile (logo e info do usuario) */
                        display: flex; flex-direction: row; align-items: center; justify-content: space-between; /* logo na esquerda, info na direita */
                        width: 100%; padding: 8px 0; box-sizing: border-box; gap: 15px; 
                        opacity: 0; transform: translateY(-20px); /* animacao aparecer */
                        animation: mobileMenuButtonAppear 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) 0.05s forwards; /* animacao */
                    }
                    :host([variant="perfil"]) .menu-mobile .logo-container-perfil { /* logo perfil mobile */
                        margin: 0; padding: 0; flex-shrink: 0; transform: none; opacity: 1; animation: none; /* ajustes */
                    }
                    :host([variant="perfil"]) .menu-mobile .logo-container-perfil .logo-sacolao { max-width: 100px; height: auto; } 
                    :host([variant="perfil"]) .menu-mobile .user-info { /* info do usuario no perfil mobile */
                        margin: 0; animation: none; display: flex; flex-direction: row; align-items: center; /* um do lado do outro */
                        gap: 10px; flex-grow: 1; justify-content: flex-start; text-align: left; /* alinhamento */
                        transform: none; opacity: 1;
                    }
                    :host([variant="perfil"]) .menu-mobile .user-info .avatar { margin:0; flex-shrink: 0; } 
                    :host([variant="perfil"]) .menu-mobile .user-info .avatar img { width: 60px; height: 60px; border-width: 2px; margin:0; } 
                    :host([variant="perfil"]) .menu-mobile .user-info .user-text-details { text-align: left; display: flex; flex-direction: column; justify-content: center; } /* nome e email */
                    :host([variant="perfil"]) .menu-mobile .user-info h2 { font-size: 1rem; margin: 0; line-height: 1.1; padding-bottom: 4px; } /* nome */
                    :host([variant="perfil"]) .menu-mobile .user-info p { font-size: 0.85rem; margin: 0; line-height: 1.1; } /* email */
                    :host([variant="perfil"]) .menu-mobile .menu-hamburguer-drawer { 
						width: 100%; 
						margin-top: 10px; 
						animation-delay: 0.25s; 
						font-family: 'Limelight', normal;
						text-shadow: -4px 2px 5px rgba(0, 0, 0, 0.25); 
					} 
                    :host([variant="perfil"]) .menu-mobile .opcao-menu { width: 100%; margin-top: 0px; } /* menu que abre */
                }
            `;
        }
        // styles da variante checkout 
        else if (variant === 'checkout') {
            variantStyles = `
				/* styles para a variante checkout no desktop */

                :host([variant="checkout"]) .header-grid.checkout-variant { 
                    display: flex; justify-content: space-between; align-items: center; /* itens um ao lado do outro e espacados */
                    padding: 10px 25px; max-width: 1250px; margin: 0 auto; /* espacamentos e tamanho */
                }
                :host([variant="checkout"]) .logo-container-checkout .logo-sacolao { max-width: 200px; height: auto; display: block; } 
                :host([variant="checkout"]) .checkout-title { 
                    text-align: center; color: #000; font-size: 2em; /* tamanho e cor */
                    margin-top: 10px; margin-bottom: 10px; font-weight: 600; /*espacamentos e font-weight*/
                    text-shadow: -2.5px 0px 3px rgba(0, 0, 0, 0.15); /* sombra do texto */
                    flex-grow: 1; /* faz o titulo ocupar o espaco do meio */
                }
                :host([variant="checkout"]) .actions-container-checkout { /* o container de botoes na direita */
                    box-shadow: 3px -4px 0px 2px #000, 6px 14px 12.5px 2px rgba(0, 0, 0, 0.25); /* sombra */
                    height: 70px; padding: 0 30px; display: flex; align-items: center; justify-content: center; /* tamanho e alinhamento */
                    border-radius: 60px; background-color: #79946F; border: 6px solid #000; /* bordas e cor */
                    gap: 25px; transition: box-shadow 0.35s cubic-bezier(0.165, 0.84, 0.44, 1); /* espaco e animacao */
                }
                :host([variant="checkout"]) .actions-container-checkout a img { /* icones na direita */
                    height: 45px; padding: 4px; /* tamanho */
                    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out; /* animacao suave */
                }
                :host([variant="checkout"]) .actions-container-checkout a:hover img { transform: scale(1.1); } /* aumenta com mouse hover */

				/* styles para a variante checkout mobile */
                @media (max-width: 768px) {
                    :host([variant="checkout"]) .header-grid.checkout-variant { display: none !important; } /* esconde o style de desktop */
                    :host([variant="checkout"]) .menu-mobile.checkout-variant { /* mostra e ajusta o style mobile */
                        display: flex !important; /* itens um do lado do outro */
                        flex-direction: row; justify-content: space-between; align-items: center; /* logo na esquerda, botoes na direita */
                        width: 100%; padding: 8px 15px; border-bottom: 1px solid #eaeaea; /* tamanho e borda */
                        box-sizing: border-box; /* cor de fundo */
                    }
                    :host([variant="checkout"]) .menu-mobile.checkout-variant .logo-container-checkout .logo-sacolao { max-width: 150px; } 
                    :host([variant="checkout"]) .menu-mobile.checkout-variant .actions-container-checkout { /* container de botoes mobile */
                        background-color: transparent; /* tira fundo */
                        padding: 10px; gap: 15px; /* ajusta tamanho e espaco */
                        height: 60px; 
                        padding: 0 30px; 
                        display: flex; align-items: center; justify-content: center; /* alinha os icones dentro */
                        border-radius: 60px; 
                        background-color: #79946F; 
                        border: 6px solid #000;
                        gap: 20px;
                        margin-top: 25px;
                        margin-right: 25px;
                    }
                    :host([variant="checkout"]) .menu-mobile.checkout-variant .actions-container-checkout a img { /* icones */
                        max-width: 40px; height: 40px; padding: 0; /* tamanho menor */
                        
                    }
                    /* titulo "finalizar compra" do checkout nao cabe no mobile */
                }
            `;
        }

        // style geral e da variante default (base para os outros) 
        return `
            <style>
               /* styles gerais para todas as variantes (ou quase todas) */ 
               
                *{
                    font-family: 'Jetbrains Mono', monospace; 
                    box-sizing: border-box; /* para calcular tamanho dos containers */
                    margin: 0; /* tira margens padrao */
                    padding: 0; /* tira espacamentos padrao */
                }
                
				/* animacoes de entrada */
				@keyframes fadeInUser { from { opacity: 0; transform: translateY(15px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                @keyframes slideInFromLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes slideInFromRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes scaleUp { from { transform: scale(0.9); opacity: 0;} to { transform: scale(1); opacity: 1;} }
                @keyframes mobileMenuButtonAppear { from { opacity: 0; transform: translateY(15px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }

                /* estilo do proprio <header-component> */
                :host {
                    display: block; /* faz ele se comportar como um container */
                    position: relative; /* importante pra algumas coisas de posicao */
                    z-index: 1000; /* pra ele ficar na frente de outras coisas se precisar */
                }
                :host([variant="perfil"]) { margin-bottom: 15px; } /* espaco embaixo do header de perfil */
                :host([variant="checkout"]) { margin-bottom: 0; } /* header de checkout nao tem espaco embaixo */

                /* arruma links, botoes e imagens pra nao terem estilos estranhos */
                a { text-decoration: none; color: inherit; display: inline-flex; align-items: center; justify-content: center; }
                button { border: none; background-color: transparent; cursor: pointer; padding: 0; display: flex; align-items: center; }
                img { display: block; /* tira um espacinho que as vezes fica embaixo da imagem */ }

                /* para dividir o header no desktop (variante default e base pro perfil) */
                .header-grid {
                    display: grid; 
                    grid-template-columns: 1fr auto 1fr; /* 3 colunas: esquerda | meio (logo) | direita */
                    align-items: center; 
                    max-width: 1250px; 
                    margin: 0 auto; /* centraliza na pagina */
                    padding: 0 60px; /* espacamento nas laterais */
                    background-color: transparent; /* fundo transparente */
                }

				/* container de botoes (icones) na esquerda e direita */
                .header-left-box, .header-right-box {
                    height: 70px; 
                    padding: 0 30px; 
                    display: flex; align-items: center; justify-content: center; /* alinha os icones dentro */
                    border-radius: 60px; 
                    background-color: #79946F; 
                    border: 6px solid #000;
                    gap: 25px; 
                    transition: box-shadow 0.35s cubic-bezier(0.165, 0.84, 0.44, 1); /* animacao suave da sombra */
                }
                .header-left-box { 
                    box-shadow: -3px -4px 0px 2px #000, 6px 14px 12.5px 2px rgba(0, 0, 0, 0.25); /* sombra estilizada */
                    justify-self: start; /* alinha na esquerda da sua coluna */
                    transform: translateX(-30px); opacity: 0; /* pra animacao de aparecer */
                    animation: slideInFromLeft 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards; /* nome da animacao */
                }
                .header-right-box {
                    box-shadow: 3px -4px 0px 2px #000, 6px 14px 12.5px 2px rgba(0, 0, 0, 0.25); /* sombra estilizada */
                    justify-self: end; /* alinha na direita da coluna */
                    transform: translateX(30px); opacity: 0; /* pra animacao de aparecer */
                    animation: slideInFromRight 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s forwards; /* nome da animacao */
                }
                .header-left-box:hover, .header-right-box:hover { 
                    box-shadow: 0px 0px 0px 3px #000, 8px 18px 18px 3px rgba(0, 0, 0, 0.3); /* muda a sombra */
                }

				/* icones dentro dos containers */
                .header-left-box img, .header-right-box a img {
                    max-width: 60px; /* tamanho dos icones no desktop */
                    padding: 8px; /* espaco em volta do icone */
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* animacao suave */
                }
                .header-left-box a:hover img, .header-right-box a:hover img,
                .header-left-box button:hover img {
                    transform: scale(1.12); /* aumenta um pouco o tamaho quando passa o mouse */
                }

                /* parte da busca no desktop */
                .search-section { position: relative; } /* para posicionar o popup da busca */
                .search-section button img { max-width: 60px; padding: 8px; } /* icone da lupa */
                #search-popup-desktop { /* o popup que abre pra digitar a busca */
                    position: absolute; top: 120%; right: -10px; /* onde ele aparece */
                    background-color: #f8f8f8; border: 3px solid #565555; border-radius: 25px; /* aparencia */
                    padding: 12px 15px; box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25); z-index: 100; /* espacamento e sombra */
                    opacity: 0; visibility: hidden; transform: translateY(-15px) translateX(120px) scale(0.9); /* comeca escondido pra animacao */
                    transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), visibility 0s linear 0.3s, transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1); /* animacao */
                    min-width: 260px; /* largura minima */
                }
                #search-popup-desktop.show { /* quando o popup esta aberto */
                    opacity: 1; visibility: visible; transform: translateY(0) translateX(120px) scale(1); /* faz ele aparecer */
                    transition-delay: 0s; /* sem delay pra aparecer */
                }
                .search-bar-popup { /* campo de digitacao da busca */
                    width: 100%; padding: 10px 18px; 
					border: 4px solid #000; 
					border-radius: 20px; /* aparencia */
                	box-shadow: 3px -4px 0px 2px #000, 6px 6px 12.5px 2px rgba(0, 0, 0, 0.25); 
					font-size: 1.6rem; background-color: #f8f8f8; box-sizing: border-box; /* font-size e cor */
                }
                .search-bar-popup:focus { outline: none; } /* tira a borda azul quando clica */

                /* logo no meio (default e base pro perfil) */
                .logo-container, .logo-container-perfil {
                    margin-top: 30px; 
                    justify-self: center; /* centraliza na sua coluna */
                    opacity: 0; transform: scale(0.85); /* animacao de apareciçao */
                    animation: scaleUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.4s forwards; /* nome da animacao */
                }
                .logo-sacolao { max-width: 300px; padding-top: 20px; } 


                /* styles para mobile (geral e variantes default/perfil) */
                .menu-mobile { display: none; /* so aparece no mobile */ }

                @media (max-width: 768px) { 
                    /* esconde o header de desktop (default e perfil) checkout e tratado separadamente */
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
                         max-width: 180px; height: auto; /* tamanho da logo mobile */
                    }

                    /* botao hamburguer (menu) (default e perfil) */
                    .menu-hamburguer-drawer {
                        display: block; /* sempre aparece no header de celular */
                        background-color: #d6a9a1; border: 4px solid #000; 
                        border-radius: 30px; padding: 12px 25px; font-size: 1.8rem; 
                        font-family: 'Limelight', normal;
						text-shadow: -4px 2px 5px rgba(0, 0, 0, 0.25); /* sombra texto */
                        box-shadow: 3px 7px 12.5px 2px rgba(0, 0, 0, 0.25), 0px 3px 0px 2px #000; /* sombra no botao */
                        width: 100%; text-align: center; 
                        transition: background-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s cubic-bezier(0.25, 0.1, 0.25, 1); /* animacao suave */
                        opacity: 0; transform: translateY(-20px) scale(0.9); /* pra animacao */
                        animation: mobileMenuButtonAppear 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) 0.2s forwards; /* animacao */
                    }
                    .menu-hamburguer-drawer:hover { 
                        background-color: #c9938b; 
                        box-shadow: 4px 9px 16px 2px rgba(0, 0, 0, 0.3), 0px 4px 0px 2px #000; /* muda a sombra */
                        transform: translateY(-2px) scale(1.0); /* muda a posicao (levanta um pouco) */
                    }
                    .menu-hamburguer-drawer:active { transform: translateY(0px) scale(0.97); } /* muda a posicao (quando clica, afunda um pouco) */

                    /* menu que abre quando o menu hamburguer e clicado (default e perfil) */
                    .opcao-menu {
                        display: flex; flex-direction: column; align-items: center; /* itens um embaixo do outro, no centro */
                        overflow: hidden; max-height: 0; opacity: 0; visibility: hidden; /* comeca escondido e sem altura */
                        transform-origin: top center; /* animacao de abrir de cima pra baixo */
                        transform: translateY(-20px) scaleY(0.92); /* comeca um pouco pra cima e achatado */
                        transition: max-height 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.05s, visibility 0s linear 0.6s, transform 0.55s cubic-bezier(0.23, 1, 0.32, 1), padding-top 0.5s cubic-bezier(0.23,1,0.32,1) 0.05s, padding-bottom 0.5s cubic-bezier(0.23,1,0.32,1) 0.05s; /* animacao de abrir */
                        pointer-events: none; /* nao e possivel clicar quando esta escondido */
                        gap: 18px; /* espaco, cor e borda */
                        border-radius: 30px; font-size: 1.8rem; 
                        width: 90%; /* largura do menu */
                        padding: 0 20px; box-sizing: border-box; margin-top: 0; /* espacamentos */
                    }
                    .opcao-menu.show { /* quando o menu esta aberto */
                        max-height: 500px; opacity: 1; visibility: visible; pointer-events: auto; /* faz ele aparecer e poder clicar */
                        padding: 25px 20px; transform: translateY(0) scaleY(1); /* tamanho, e volta ao normal */
                    }
                    /* botoes dentro do menu que abriu (default e perfil) */
                    .opcao-btn {
                        background: none; border: none; cursor: pointer; width: auto; /* sem fundo, sem borda, cursor de mao */
                        display: inline-flex; align-items: center; justify-content: center; /* alinha o icone dentro */
                        padding: 10px; border-radius: 50%; text-decoration: none; /* espaco e forma redonda */
                        box-sizing: border-box; line-height: normal; 
                        width: 100%; text-align: center; 
                        border-radius: 30px; padding: 12px 25px; font-size: 1.8rem; 
                        font-weight: bold; text-shadow: -4px 2px 5px rgba(0, 0, 0, 0.25); /* sombra texto */
                        background-color: #d6a9a1; border: 4px solid #000;
                        opacity: 0; transform: translateY(15px) scale(0.85); /* comeca escondido pra animar */
                        transition: background-color 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.35s cubic-bezier(0.25, 0.1, 0.25, 1); /* animacao */
                    }
                    .opcao-btn span { display: none; /* esconde o texto dos botoes e mostra so o icone */ }
                    .opcao-menu.show .opcao-btn { opacity: 1; transform: translateY(0) scale(1); } /* faz os botoes aparecerem */
                    /* delay diferente pra cada botao aparecer */
                    .opcao-menu.show .opcao-btn:nth-child(1) { transition-delay: 0.12s, 0.12s, 0.12s; }
                    .opcao-menu.show .opcao-btn:nth-child(2) { transition-delay: 0.19s, 0.19s, 0.19s; }
                    .opcao-menu.show .opcao-btn:nth-child(3) { transition-delay: 0.26s, 0.26s, 0.26s; }
                    .opcao-menu.show .opcao-btn:nth-child(4) { transition-delay: 0.33s, 0.33s, 0.33s; }
                    .opcao-menu.show .opcao-btn:nth-child(5) { transition-delay: 0.40s, 0.40s, 0.40s; }

                    .opcao-btn:hover { background-color: rgba(255,255,255,0.2); transform: translateY(0) scale(1.12); } /* quando passa o mouse (hover) */
                    .opcao-btn img { width: 30px; height: 30px; flex-shrink: 0; } /* tamanho dos icones */

                    /* popup de busca mobile (so pra variante default) */
                    :host([variant="default"]) #search-popup-mobile {
                        position: absolute; top: 110%; /* aparece um pouco abaixo do botao de busca */
                        left: 50%; /* no meio */
                        background-color: #f8f8f8; border: 3px solid #565555; border-radius: 25px; /* aparencia */
                        padding: 12px 15px; box-shadow: 0 6px 15px rgba(0,0,0,0.25); z-index: 101; /* espacamento e sombra */
                        opacity: 0; visibility: hidden; width: 90%; /* comeca escondido */
                        transform: translateX(-50%) translateY(-15px) scale(0.95); /* comeca um pouco pra cima e menor */
                        transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), visibility 0s linear 0.3s, transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1); /* animacao */
                    }
                    :host([variant="default"]) #search-popup-mobile.show { /* quando o popup de busca esta aberto */
                        opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0) scale(1); /* faz ele aparecer */
                        transition-delay: 0.8s; /* delay para aparecer */
					}
                }

                /* regras pra garantir que o layout certo apareca no desktop */
                @media (min-width: 769px) {
                    /* esconde o menu mobile e mostra o de desktop na variante checkout*/
                    :host([variant="checkout"]) .menu-mobile.checkout-variant { display: none !important; }
                    :host([variant="checkout"]) .header-grid.checkout-variant { display: flex !important; }

                    /* pra default e perfil, esconde o menu de mobile e mostra o de desktop */
                    :host(:not([variant="checkout"])) .menu-mobile { display: none !important; }
                    :host([variant="default"]) .header-grid { display: grid !important; } /* header default usa grid */
                    :host([variant="perfil"]) .header-grid { display: grid !important; } /* header perfil usa grid */
                 }

                /* aqui entram os estilos especificos de cada variante (perfil, checkout) */
                ${variantStyles}
            </style>
        `;
    }

    // essa funcao monta todo o html do header
    // o 'variant' diz qual tipo de header vai ser usado 
    getHTML(variant) {
        const isPerfilPage = variant === 'perfil'; // é a pagina de perfil?
        const isCheckoutPage = variant === 'checkout'; // é a pagina de checkout?

        // html da variante checkout 
        if (isCheckoutPage) {
            return `
                <div class="header-grid checkout-variant">
                    <div class="logo-container-checkout">
                        <a href="/index.html">
                            <img class="logo-sacolao" src="/assets/images/logo.png" alt="logo sacolao rodrigues">
                        </a>
                    </div>
                    <h1 class="checkout-title">finalizar compra</h1>
                    <div class="actions-container-checkout">
                        <a href="/pages/perfil.html" title="meu perfil">
                            <img src="/assets/images/profile.png" alt="meu perfil">
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
                            <img src="/assets/images/profile.png" alt="meu perfil">
                        </a>
                    </div>
                </div>
            `;
        }

        // html das variantes default e perfil 

        // parte do html pro container da esquerda no desktop
        const desktopLeftBoxHTML = `
            <div class="header-left-box">
                <a href="/pages/listas.html" title="lista de compras">
                    <img src="/assets/images/list-icon.png" alt="minhas listas">
                </a>
                <a href="/pages/ofertas.html" title="ofertas">
                    <img src="/assets/images/ofertas.png" alt="promocoes">
                </a>
                <div class="search-section">
                    <button id="search-btn-desktop" class="search-toggle-btn" title="buscar produto">
                        <img src="/assets/images/search-icon.png" alt="buscar">
                    </button>
                    <div id="search-popup-desktop">
                        <input type="text" id="search-desktop-input" class="search-bar-popup" placeholder="buscar produto...">
                    </div>
                </div>
            </div>
        `;

        // parte do html para a logo 
        const desktopLogoHTML = (logoContainerClass = "logo-container") => `
            <div class="${logoContainerClass}">
                <a href="/index.html">
                    <img class="logo-sacolao" src="/assets/images/logo.png" alt="logo sacolao rodrigues">
                </a>
            </div>
        `;

        // parte do html pra mostrar info do usuario 
        const userInfoHTML = `
            <section class="user-info">
                <div class="avatar">
                    <img src="/assets/images/user-profile-pic.png" alt="foto do usuario">
                </div>
                <div class="user-text-details">
                    <h2>carregando...</h2>
                    <p>carregando...</p>
                </div>
            </section>
        `;

        // parte do html para o container da direita no desktop
        const desktopRightBoxHTML = `
            <div class="header-right-box">
                ${isPerfilPage ? '' : `
                <a href="/pages/cadastro.html" title="criar conta">
                    <img src="/assets/images/log-in.png" alt="cadastro">
                </a>
                <a href="/pages/perfil.html" title="meu perfil">
                    <img src="/assets/images/profile.png" alt="meu perfil">
                </a>`}
                <a href="/pages/checkout.html" title="carrinho">
                    <img src="/assets/images/cart-icon.png" alt="carrinho">
                </a>
            </div>
        `;

        // monta o conteudo do header de desktop dependendo se e perfil ou default
        let desktopHeaderGridContent = '';
        if (isPerfilPage) {
            desktopHeaderGridContent = `
                ${desktopLogoHTML("logo-container-perfil")} 
                ${userInfoHTML}
                ${desktopRightBoxHTML}
            `;
        } else { // variante default
            desktopHeaderGridContent = `
                ${desktopLeftBoxHTML} 
                ${desktopLogoHTML()} 
                ${desktopRightBoxHTML}
            `;
        }

        // opcoes que vao dentro do menu hamburguer no mobile
        let mobileMenuOptions = '';
        if (isPerfilPage) {
            mobileMenuOptions = `
                <a href="/pages/listas.html" class="opcao-btn" title="minhas listas">
                    <img src="/assets/images/list-icon.png" alt="minhas listas">
                </a>
                <a href="/pages/ofertas.html" class="opcao-btn" title="minhas ofertas">
                    <img src="/assets/images/ofertas.png" alt="minhas ofertas">
                </a>
                <a href="/pages/ajustes.html" class="opcao-btn" title="ajustes">
                    <img src="/assets/images/ajustes-icon.png" alt="ajustes">
                </a>
                <button id="logout-btn-mobile" class="opcao-btn" title="sair"> 
                    <img src="/assets/images/log-in.png" alt="sair">
                </button>
            `;
        } else { // variante default
            mobileMenuOptions = `
                <a href="/pages/ofertas.html" class="opcao-btn" title="minhas ofertas">
                    <img src="/assets/images/ofertas.png" alt="minhas ofertas">
                </a>
                <a href="/pages/perfil.html" class="opcao-btn" title="perfil">
                    <img src="/assets/images/profile.png" alt="perfil">
                </a>
                <a href="/pages/checkout.html" class="opcao-btn" title="carrinho">
                    <img src="/assets/images/cart-icon.png" alt="carrinho">
                </a>
                 <a href="/pages/cadastro.html" class="opcao-btn" title="criar conta/login">
                    <img src="/assets/images/log-in.png" alt="login/cadastro">
                </a>
               <!-- <div class="search-section">
                     <button id="search-btn-mobile-menu" class="opcao-btn search-toggle-btn-mobile" title="buscar produto">
                        <img src="/assets/images/search-icon.png" alt="buscar">
                    </button>
                </div>!-->
            `;
        }

        // monta o conteudo do header mobile dependendo se e perfil ou default
        let menuMobileContent = '';
        if (isPerfilPage) {
            menuMobileContent = `
                <div class="perfil-mobile-top-row"> 
                    ${desktopLogoHTML("logo-container-perfil")}
                    ${userInfoHTML}
                </div>
                <button class="menu-hamburguer-drawer">☰ menu</button>
                <div class="opcao-menu"> 
                    ${mobileMenuOptions}
                </div>
            `;
        } else { // variante default
            menuMobileContent = `
                ${desktopLogoHTML()}
				<div id="search-popup-mobile"> 
                    <input type="text" id="search-mobile-input" class="search-bar-popup" placeholder="buscar produto...">
                </div>
                <button class="menu-hamburguer-drawer">☰ menu</button>
                <div class="opcao-menu">
                    ${mobileMenuOptions}
                </div>
            `;
        }
        
        // junta tudo e retorna o html completo pro componente
        return `
            <div class="header-grid ${isPerfilPage ? 'perfil-variant' : ''}">
                ${desktopHeaderGridContent}
            </div>
            <div class="menu-mobile ${isPerfilPage ? 'perfil-variant' : ''}">
                ${menuMobileContent}
            </div>
        `;
    }

    // essa funcao adiciona os "event listeners" (o que acontece quando clica, etc)
    addEventListeners(variant) {
        const shadow = this.shadowRoot; // shadowDOm do componente
        const isCheckoutPage = variant === 'checkout'; // é a pagina de checkout?

        // menu hamburguer (nao funciona no checkout pq ele tem um layout mobile diferente)
        if (!isCheckoutPage) {
            const hamburguerBtn = shadow.querySelector('.menu-hamburguer-drawer'); // o botao de menu
            const mobileMenu = shadow.querySelector('.opcao-menu'); // o menu que abre
            if (hamburguerBtn && mobileMenu) { // se os dois existirem
                hamburguerBtn.addEventListener('click', () => { // quando clicar no botao
                    mobileMenu.classList.toggle('show'); // adiciona ou remove a classe 'show' (que faz ele aparecer/sumir)
                    // se o popup de busca mobile tiver aberto e o menu for fechado, fecha a busca tambem
                    const searchPopupMobile = shadow.querySelector('#search-popup-mobile');
                    if (searchPopupMobile && searchPopupMobile.classList.contains('show') && !mobileMenu.classList.contains('show')) {
                        searchPopupMobile.classList.remove('show');
                    }
                });
            }
        }
        
        // botao de logout no menu do celular (so se for a variante perfil)
        if (variant === 'perfil') {
            const logoutButtonMobile = shadow.querySelector('#logout-btn-mobile'); // o botao de logout
            if (logoutButtonMobile) { // se ele existir...
                logoutButtonMobile.addEventListener('click', () => { // quando clicar
                    if (confirm('deseja realmente sair?')) { // pergunta se tem certeza
                        localStorage.removeItem('loggedInUser'); // apaga do localStorage que o usuario esta logado
                        window.location.href = "/index.html"; // volta pra pagina inicial
                    }
                });
            }
        }

        // busca no desktop
        const searchBtnDesktop = shadow.querySelector('#search-btn-desktop'); // botao da lupa
        const searchPopupDesktop = shadow.querySelector('#search-popup-desktop'); // o popup que abre
        const searchInputDesktop = shadow.querySelector('#search-desktop-input'); // o campo de digitar
        if (searchBtnDesktop && searchPopupDesktop && searchInputDesktop) { // se tudo existir
            searchBtnDesktop.addEventListener('click', (e) => { // quando clicar na lupa
                e.stopPropagation(); // impede o clique de "vazar" e fechar o popup sem querer
                searchPopupDesktop.classList.toggle('show'); // mostra ou esconde o popup
                if (searchPopupDesktop.classList.contains('show')) { // se mostrou
                    setTimeout(() => searchInputDesktop.focus(), 50); // da foco no campo de digitar (pra usuario ja poder escrever)
                }
            });
            searchPopupDesktop.addEventListener('click', e => e.stopPropagation()); // impede de fechar se clicar dentro do popup
        }
        
        // busca no mobile (se tiver o botao de busca no menu)
        const searchBtnMobileMenu = shadow.querySelector('#search-btn-mobile-menu'); // botao da lupa no menu mobile
        const searchPopupMobile = shadow.querySelector('#search-popup-mobile'); // o popup que abre
        const searchInputMobile = shadow.querySelector('#search-mobile-input'); // o campo de digitar
        if (searchBtnMobileMenu && searchPopupMobile && searchInputMobile) { // se tudo existir
            searchBtnMobileMenu.addEventListener('click', (e) => { // quando clicar na lupa do menu
                e.stopPropagation(); // impede de "vazar"
                searchPopupMobile.classList.toggle('show'); // mostra ou esconde o popup de busca
                if (searchPopupMobile.classList.contains('show')) { // se mostrou
                    setTimeout(() => searchInputMobile.focus(), 50); // da foco no campo
                }
            });
            searchPopupMobile.addEventListener('click', e => e.stopPropagation()); // impede de fechar se clicar dentro
        }

        // funcoes para fechar os popups de busca se o usuario clicar fora deles ou apertar esc
        // importante usar this.ownerDocument pq o componente fica dentro do shadoqDOM 
        const handleClickOutside = (e) => { // quando clica em qualquer lugar da pagina
            // se o popup de busca do desktop estiver aberto e o clique foi fora dele e fora do botao da lupa
            if (searchPopupDesktop && searchPopupDesktop.classList.contains('show') &&
                !searchPopupDesktop.contains(e.target) && e.target !== searchBtnDesktop && (searchBtnDesktop && !searchBtnDesktop.contains(e.target))) {
                searchPopupDesktop.classList.remove('show'); // esconde o popup
            }
            // mesmo pro popup de busca mobile 
            if (searchPopupMobile && searchPopupMobile.classList.contains('show') &&
                !searchPopupMobile.contains(e.target) && searchBtnMobileMenu && e.target !== searchBtnMobileMenu && !searchBtnMobileMenu.contains(e.target)) {
                searchPopupMobile.classList.remove('show'); // esconde o popup
            }
        };
        this.ownerDocument.addEventListener('click', handleClickOutside); // "ouve" (listener)cliques no documento inteiro

        const handleEscapeKey = (e) => { // quando aperta uma tecla
            if (e.key === 'Escape' || e.key === 'Esc') { // se for a tecla esc
                if (searchPopupDesktop && searchPopupDesktop.classList.contains('show')) searchPopupDesktop.classList.remove('show'); // esconde
                if (searchPopupMobile && searchPopupMobile.classList.contains('show')) searchPopupMobile.classList.remove('show'); // esconde
            }
        };
        this.ownerDocument.addEventListener('keydown', handleEscapeKey); // "ouve" teclas no documento inteiro

        // atalho: se apertar a tecla '/' abre a busca do desktop (se ela estiver visivel)
        this.ownerDocument.addEventListener('keydown', (e) => {
            if (e.key === '/' && searchBtnDesktop && searchInputDesktop) { // so se os elementos da busca desktop existirem
                const isDesktopLayout = getComputedStyle(searchBtnDesktop).display !== 'none'; // o botao da lupa desktop esta visivel?
                if (!isDesktopLayout) return; // se nao, nao faz nada (estamos no mobile provavelmente)

                const activeEl = this.ownerDocument.activeElement; // qual elemento da pagina esta focado agora?
                const isSearchInputActive = activeEl === searchInputDesktop; // o foco ja esta no input de busca?
                // o foco esta em outro input ou textarea (que nao seja o de busca)?
                const isTypingInForm = (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') && activeEl !== searchInputDesktop;

                if (isSearchInputActive || isTypingInForm) return; // se ja estiver digitando em algum lugar, nao faz nada

                e.preventDefault(); // impede que a barra '/' apareca no campo de busca ou em outro lugar
                if (searchPopupDesktop.classList.contains('show')) { // se o popup ja estiver aberto...
                    searchInputDesktop.focus(); // so da foco no campo
                } else { // se estiver fechado
                    searchPopupDesktop.classList.add('show'); // abre o popup
                    setTimeout(() => searchInputDesktop.focus(), 50); // e da foco no campo
                }
            }
        });

        // essa parte avisa outras partes da pagina quando o usuario digita na busca
        if (searchInputDesktop || searchInputMobile) { // se algum dos inputs de busca existir
            const handleSearchInputEvent = (event) => {
                // dispara um evento personalizado chamado header-search
                this.dispatchEvent(new CustomEvent('header-search', {
                    detail: { term: event.target.value }, // manda o que foi digitado
                    bubbles: true, composed: true // permite o evento sair ou "borbulhar" para fora do shadowdom
                }));
            };
            if(searchInputDesktop) searchInputDesktop.addEventListener('input', handleSearchInputEvent); // "ouve" o input do desktop
            if (searchInputMobile) searchInputMobile.addEventListener('input', handleSearchInputEvent); // "ouve" o input do celular
        }

        // guarda as funcoes que ouvem eventos globais pra conseguir remover elas depois
        this.cleanupGlobalListeners = () => {
            this.ownerDocument.removeEventListener('click', handleClickOutside);
            this.ownerDocument.removeEventListener('keydown', handleEscapeKey);
        };
    }

    // funcao chamada quando o componente e tirado da pagina html
    disconnectedCallback() {
        // e importante limpar os "ouvidores de eventos" globais pra nao dar problema de memoria ou comportamento estranho
        if (this.cleanupGlobalListeners) {
            this.cleanupGlobalListeners();
        }
    }
}

	// define que a tag <header-component> no html vai usar essa nossa classe header
	customElements.define('header-component', Header);
