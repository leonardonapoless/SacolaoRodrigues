const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const formSubmissionMessage = document.getElementById('formSubmissionMessage');

form.addEventListener('submit', function (event) {
    let isValid = true;

    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;

    formSubmissionMessage.style.display = 'none';
    formSubmissionMessage.className = 'form-message';

    if (isValid) {
        console.log('Formulário válido. Submetendo via GET...');
        formSubmissionMessage.textContent = 'Login realizado com sucesso!';
        formSubmissionMessage.classList.add('success');
        formSubmissionMessage.style.display = 'block';

    } else {
        event.preventDefault();
        console.log('Formulário inválido. Corrija os erros.');
        formSubmissionMessage.textContent = 'Por favor, corrija os erros no formulário.';
        formSubmissionMessage.classList.add('error');
        formSubmissionMessage.style.display = 'block';
    }
});

function showError(inputElement, errorElementId, message) {
    const errorElement = document.getElementById(errorElementId);
    errorElement.textContent = message;
    inputElement.classList.add('invalid');
}

function clearError(inputElement, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    errorElement.textContent = '';
    inputElement.classList.remove('invalid');
}

function validateEmail() {
    clearError(emailInput, 'emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value) {
        showError(emailInput, 'emailError', 'Email é obrigatório.');
        return false;
    }
    if (!emailPattern.test(emailInput.value)) {
        showError(emailInput, 'emailError', 'Formato de email inválido.');
        return false;
    }
    return true;
}

function validatePassword() {
    clearError(passwordInput, 'passwordError');
    const passwordValue = passwordInput.value;
    if (passwordValue.length < 1) {
        showError(passwordInput, 'passwordError', 'Senha é obrigatória.');
        return false;
    }
    return true;
}

emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

[emailInput, passwordInput].forEach(input => {
    input.addEventListener('input', () => {
        const errorId = input.id + 'Error';
        clearError(input, errorId);
        if (formSubmissionMessage.classList.contains('error')) {
            formSubmissionMessage.style.display = 'none';
        }
    });
});
