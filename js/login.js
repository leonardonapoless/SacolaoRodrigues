const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const formSubmissionMessage = document.getElementById('formSubmissionMessage');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    formSubmissionMessage.style.display = 'none';
    formSubmissionMessage.textContent = '';
    formSubmissionMessage.className = 'form-message';

    let isValid = true;
    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;

    if (isValid) {
        const emailDigitado = emailInput.value;
        const senhaDigitada = passwordInput.value;

        const storedUserString = localStorage.getItem('registeredUser');
        let loginPermitido = false;
        let nomeUsuario = "usuario";

        if (storedUserString) {
            try {
                const registeredUserData = JSON.parse(storedUserString);
                if (registeredUserData.email === emailDigitado && registeredUserData.password === senhaDigitada) {
                    loginPermitido = true;
                    nomeUsuario = registeredUserData.fullName || "usuario";
                    localStorage.setItem('loggedInUser', JSON.stringify({
                        email: registeredUserData.email,
                        fullName: nomeUsuario
                    }));
                    console.log('login bem-sucedido para:', emailDigitado);
                }
            } catch (e) {
                console.error("erro ao ler dados do usuario do localStorage:", e);
            }
        }

        if (loginPermitido) {
            formSubmissionMessage.textContent = `login realizado com sucesso! bem-vindo(a), ${nomeUsuario}!`;
            formSubmissionMessage.classList.add('success');
            formSubmissionMessage.style.display = 'block';

            setTimeout(function() {
                window.location.href = '/pages/perfil.html';
            }, 1500);
        } else {
            formSubmissionMessage.textContent = 'email ou senha invalidos.';
            formSubmissionMessage.classList.add('error');
            formSubmissionMessage.style.display = 'block';
            console.log('tentativa de login falhou para:', emailDigitado);
        }
    } else {
        formSubmissionMessage.textContent = 'por favor, corrija os erros no formulario.';
        formSubmissionMessage.classList.add('error');
        formSubmissionMessage.style.display = 'block';
        console.log('formulario de login invalido.');
    }
});

function showError(inputElement, errorElementId, message) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) errorElement.textContent = message;
    inputElement.classList.add('invalid');
}

function clearError(inputElement, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) errorElement.textContent = '';
    inputElement.classList.remove('invalid');
}

function validateEmail() {
    clearError(emailInput, 'emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value) { 
        showError(emailInput, 'emailError', 'email e obrigatorio.');
        return false;
    }
    if (!emailPattern.test(emailInput.value)) { 
        showError(emailInput, 'emailError', 'formato de email invalido.');
        return false;
    }
    return true;
}

function validatePassword() {
    clearError(passwordInput, 'passwordError');
    if (passwordInput.value === '') { 
        showError(passwordInput, 'passwordError', 'senha e obrigatoria.');
        return false;
    }
    return true;
}

emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

[emailInput, passwordInput].forEach(input => {
    input.addEventListener('input', () => {
        clearError(input, input.id + 'Error');
        if (formSubmissionMessage.style.display === 'block' && formSubmissionMessage.classList.contains('error')) {
            formSubmissionMessage.style.display = 'none';
        }
    });
});
