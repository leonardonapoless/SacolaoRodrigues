const footerTemplate = document.createElement('template');

footerTemplate.innerHTML = `
    <style>
        * {
            font-size: 14px;
        }
        :host {
            display: block;
            font-family: 'Jetbrains Mono', monospace;
        }
        .custom-footer {
            background-color: #5a5a4d;
            color: white;
            border: 2px solid black;
            border-radius: 30px;
            width: 360px;
            margin: 40px auto;
            padding: 20px;
            text-align: center;
            box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
            position: relative;
        }
        .custom-footer .footer-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .custom-footer .sobre a {
            color: white;
            font-weight: bold;
            text-decoration: none;
            position: relative;
            padding-bottom: 4px;
        }
        .custom-footer .sobre a::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -4px;
            width: 100%;
            height: 2px;
            background: white;
            border-radius: 40px;
        }
        .custom-footer .social-icons {
            display: flex;
            gap: 16px;
        }
        .custom-footer .social-icons i {
            font-size: 20px;
            cursor: pointer;
            position: relative;
            padding-bottom: 4px;
            transition: transform 0.2s ease-in-out;
        }
        .custom-footer .social-icons a {
            color: white;
            text-decoration: none;
        }
        .custom-footer .social-icons i:hover {
            transform: scale(1.1);
        }
        .custom-footer .social-icons i::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -4px;
            width: 100%;
            height: 2px;
            border-radius: 40px;
            background: white;
        }
        .custom-footer .form-box {
            background-color: #dcdcdc;
            border-radius: 25px;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 2px solid #828282;
        }
        .custom-footer .form-box textarea {
            border: none;
            background: transparent;
            outline: none;
            flex: 1;
            padding: 8px;
            font-style: italic;
            color: #555;
            resize: none;
            min-height: 38px;
            height: auto;
            overflow-y: hidden;
            line-height: 1.4;
            box-sizing: border-box;
            font-family: 'Jetbrains Mono', monospace;
        }
        .custom-footer .form-box button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 18px;
            color: #5a5a4d;
            padding: 8px 12px;
            border-radius: 20px;
            transition: transform 0.3s ease-in-out;
        }
        .custom-footer .form-box button:hover {
            transform: scale(1.4);
        }
        .custom-footer .footer-bottom {
            margin-top: 20px;
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        .bounce-animation {
            animation: bounce 0.6s ease-in-out;
        }
        .message-box {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            z-index: 1000;
            white-space: nowrap;
        }
        .message-box.show {
            opacity: 1;
        }
        @media (max-width: 375px) {
            .custom-footer {
                width: 80%;
                margin: 20px auto;
                padding: 15px;
            }
            .custom-footer .form-box {
                flex-direction: column;
                gap: 8px;
            }
            .custom-footer .form-box button {
                width: 100%;
            }
        }
    </style>

    <footer class="custom-footer">
      <div class="footer-top">
        <div class="sobre"><a href="/pages/sobre.html">Sobre Nós</a></div>
        <div class="social-icons">
         <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
          <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer"><i class="fab fa-whatsapp"></i></a>
          <i class="fas fa-mobile-alt"></i>
        </div>
      </div>
    
      <div class="form-box">
        <textarea id="sugestao" placeholder="Dúvidas e sugestões"></textarea>
        <button id="sendButton">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    
      <div class="footer-bottom">
        <strong>Sacolão Rodrigues</strong><br>
        <span>&copy;</span>
      </div>
      <div id="messageBox" class="message-box"></div>
    </footer>
`;

class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(footerTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        const shadow = this.shadowRoot;
        const sendButton = shadow.getElementById('sendButton');
        const suggestionInput = shadow.getElementById('sugestao');
        const messageBox = shadow.getElementById('messageBox');

        function showMessage(message) {
            messageBox.textContent = message;
            messageBox.classList.add('show');
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, 3000);
        }

        if (suggestionInput) {
            suggestionInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
        }

        if (sendButton && suggestionInput) {
            sendButton.addEventListener('click', function(event) {
                event.preventDefault();

                sendButton.classList.add('bounce-animation');

                sendButton.addEventListener('animationend', () => {
                    sendButton.classList.remove('bounce-animation');
                }, { once: true });

                if (suggestionInput.value.trim() !== '') {
                    showMessage(`Sugestão enviada: ${suggestionInput.value}`);
                    suggestionInput.value = '';
                    suggestionInput.style.height = 'auto';
                } else {
                    showMessage('Por favor, escreva algo antes de enviar.');
                }
            });
        } else {
            console.error('Botão de envio ou campo de sugestão não encontrado no footer-component.');
        }
    }
}

customElements.define('footer-component', FooterComponent);