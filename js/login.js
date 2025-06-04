// pega os campos do formulario de login no html
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const formSubmissionMessage = document.getElementById('formSubmissionMessage');

// quando alguem tentar enviar o formulario de login
form.addEventListener('submit', function(event) {
    event.preventDefault(); // nao deixa o formulario ser enviado do jeito antigo

    // limpa mensagens de erro ou sucesso que ja estavam na tela
    formSubmissionMessage.style.display = 'none';
    formSubmissionMessage.textContent = '';
    formSubmissionMessage.className = 'form-message'; // tira classes de erro/sucesso antigas

    // verifica se o email e a senha foram preenchidos e parecem validos
    let isValid = true;
    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;

    // se estiverem validos
    if (isValid) {
        const emailDigitado = emailInput.value;
        const senhaDigitada = passwordInput.value;

        // pega os dados do usuario que se cadastrou (do localStorage)
        const storedUserString = localStorage.getItem('registeredUser');
        let loginPermitido = false;
        let nomeUsuario = "usuario"; // nome padrao 

        // se encontrou algum usuario cadastrado
        if (storedUserString) {
            try {
                const registeredUserData = JSON.parse(storedUserString); // transforma o texto de volta em objeto
                // verifica se o email e a senha digitados sao iguais aos guardados
                if (registeredUserData.email === emailDigitado && registeredUserData.password === senhaDigitada) {
                    loginPermitido = true; // pode logar
                    nomeUsuario = registeredUserData.fullName || "usuario"; // pega o nome completo 
                    // guarda no localStorage que o usuario esta logado (simulando uma sessao)
                    localStorage.setItem('loggedInUser', JSON.stringify({
                        email: registeredUserData.email,
                        fullName: nomeUsuario
                    }));
                    console.log('login bem-sucedido para:', emailDigitado);
                }
            } catch (e) {
                console.error("erro ao ler dados do usuario do localStorage:", e);
                // se deu erro o login nao vai funcionar
            }
        }

        // se o login foi permitido
        if (loginPermitido) {
            formSubmissionMessage.textContent = `login realizado com sucesso! bem-vindo(a), ${nomeUsuario}!`;
            formSubmissionMessage.classList.add('success'); // pra mensagem ficar verde
            formSubmissionMessage.style.display = 'block';

            // espera 1.5 segundos e vai pra pagina de perfil
            setTimeout(function() {
                window.location.href = 'perfil.html';
            }, 1500);
        } else {
            // se nao permitiu o login
            formSubmissionMessage.textContent = 'email ou senha invalidos.';
            formSubmissionMessage.classList.add('error'); // pra mensagem ficar vermelha
            formSubmissionMessage.style.display = 'block';
            console.log('tentativa de login falhou para:', emailDigitado);
        }
    } else {
        // se os campos nao foram validados
        formSubmissionMessage.textContent = 'por favor, corrija os erros no formulario.';
        formSubmissionMessage.classList.add('error');
        formSubmissionMessage.style.display = 'block';
        console.log('formulario de login invalido.');
    }
});

// funcoes para verificar se os campos estao certos
// funcao pra mostrar mensagem de erro
function showError(inputElement, errorElementId, message) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) errorElement.textContent = message;
    inputElement.classList.add('invalid'); // deixa o campo vermelho
}

// funcao pra limpar mensagem de erro
function clearError(inputElement, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) errorElement.textContent = '';
    inputElement.classList.remove('invalid'); // tira o vermelho
}

// verifica o email
function validateEmail() {
    clearError(emailInput, 'emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // pra ver se e um email
    if (!emailInput.value) { 
		// se tiver vazio
        showError(emailInput, 'emailError', 'email e obrigatorio.');
        return false;
    }
    if (!emailPattern.test(emailInput.value)) { 
		// se nao parecer email
        showError(emailInput, 'emailError', 'formato de email invalido.');
        return false;
    }
    return true;
}

// verifica a senha (so ve se preencheu, nao a complexidade)
function validatePassword() {
    clearError(passwordInput, 'passwordError');
    if (passwordInput.value === '') { 
		// se tiver vazio
        showError(passwordInput, 'passwordError', 'senha e obrigatoria.');
        return false;
    }
    return true;
}

// eventos pra validar quando a pessoa digita ou muda de campo
// valida quando clica fora do campo
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

// limpa o erro do campo quando comeca a digitar
[emailInput, passwordInput].forEach(input => {
    input.addEventListener('input', () => {
        clearError(input, input.id + 'Error'); // limpa o erro especifico
        // se tiver mensagem de erro geral, esconde ela
        if (formSubmissionMessage.style.display === 'block' && formSubmissionMessage.classList.contains('error')) {
            formSubmissionMessage.style.display = 'none';
        }
    });
});
