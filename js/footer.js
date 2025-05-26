document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const suggestionInput = document.getElementById('sugestao');
    const messageBox = document.getElementById('messageBox');

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
        console.error('Botão de envio ou campo de sugestão não encontrado. Por favor, certifique-se de que o botão tem o ID "sendButton" e o campo de entrada tem o ID "sugestao".');
    }
});