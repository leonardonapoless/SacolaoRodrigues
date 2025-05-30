const form = document.getElementById('registrationForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const phoneInput = document.getElementById('phone');
const birthDateInput = document.getElementById('birthDate');
const formSubmissionMessage = document.getElementById('formSubmissionMessage');

form.addEventListener('submit', function (event) {
    let isValid = true;

    if (!validateFullName()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;
    if (!validateConfirmPassword()) isValid = false;
    if (!validatePhone()) isValid = false;
    if (!validateBirthDate()) isValid = false;

    formSubmissionMessage.style.display = 'none';
    formSubmissionMessage.className = 'form-message';

    if (isValid) {
        console.log('Formulário válido. Submetendo via GET...');
        formSubmissionMessage.textContent = 'Cadastro enviado com sucesso!';
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

function validateFullName() {
    clearError(fullNameInput, 'fullNameError');
    if (fullNameInput.value.trim() === '') {
        showError(fullNameInput, 'fullNameError', 'Nome completo é obrigatório.');
        return false;
    }
    return true;
}

function validateEmail() {
    clearError(emailInput, 'emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
        showError(emailInput, 'emailError', 'Formato de email inválido.');
        return false;
    }
    return true;
}

function validatePassword() {
    clearError(passwordInput, 'passwordError');
    const passwordValue = passwordInput.value;
    // regex senha
    const specialCharPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (passwordValue.length < 8) {
        showError(passwordInput, 'passwordError', 'Mínimo 8 caracteres.');
        return false;
    }
    if (!specialCharPattern.test(passwordValue)) {
        showError(passwordInput, 'passwordError', 'Incluir caractere especial (ex: !@#$).');
        return false;
    }
    return true;
}

function validateConfirmPassword() {
    clearError(confirmPasswordInput, 'confirmPasswordError');
    if (confirmPasswordInput.value.trim() === '') {
        showError(confirmPasswordInput, 'confirmPasswordError', 'Confirmação de senha obrigatória.');
        return false;
    }
    if (confirmPasswordInput.value !== passwordInput.value) {
        showError(confirmPasswordInput, 'confirmPasswordError', 'As senhas não coincidem.');
        return false;
    }
    return true;
}

function validatePhone() {
    clearError(phoneInput, 'phoneError');
    const phoneValue = phoneInput.value.trim();
    if (phoneValue === '') {
        return true;
    }

    const justDigits = phoneValue.replace(/\D/g, '');

    const phonePattern = /^(?:[1-9]{2}|0[1-9]{2})?(?:[2-8]|9[1-9])[0-9]{3}[0-9]{4}$/;


    if (!phonePattern.test(justDigits) || justDigits.length < 10 || justDigits.length > 11) {
        showError(phoneInput, 'phoneError', 'Formato inválido. Use (XX) XXXXX-XXXX ou XXXXXXXXXXX.');
        return false;
    }
    return true;
}

function validateBirthDate() {
    clearError(birthDateInput, 'birthDateError');
    if (birthDateInput.value === '') {
        showError(birthDateInput, 'birthDateError', 'Data de nascimento obrigatória.');
        return false;
    }
    const today = new Date();
    const birthDate = new Date(birthDateInput.value);
    const birthDateOnly = new Date(birthDate.getUTCFullYear(), birthDate.getUTCMonth(), birthDate.getUTCDate());
    const todayOnly = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

    if (birthDateOnly >= todayOnly) {
        showError(birthDateInput, 'birthDateError', 'Data de nascimento deve ser no passado.');
        return false;
    }

    let age = todayOnly.getFullYear() - birthDateOnly.getFullYear();
    const m = todayOnly.getMonth() - birthDateOnly.getMonth();
    if (m < 0 || (m === 0 && todayOnly.getDate() < birthDateOnly.getDate())) {
        age--;
    }
    if (age < 16) {
        showError(birthDateInput, 'birthDateError', 'Idade mínima de 16 anos.');
        return false;
    }
    return true;
}

// função pra manipular o input do telefone
phoneInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.substring(0, 11);
    }

    let formattedValue = '';
    if (value.length > 0) {
        formattedValue = '(' + value.substring(0, 2);
    }
    if (value.length > 2) {
        formattedValue += ') ' + value.substring(2, value.length === 11 ? 7 : 6);
    }
    if (value.length > (value.length === 11 ? 7 : 6)) {
        formattedValue += '-' + value.substring(value.length === 11 ? 7 : 6);
    }
    e.target.value = formattedValue;

    if (formSubmissionMessage.classList.contains('error')) {
        clearError(phoneInput, 'phoneError');
        formSubmissionMessage.style.display = 'none';
    }
});


fullNameInput.addEventListener('blur', validateFullName);
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);
confirmPasswordInput.addEventListener('blur', () => {
    validatePassword();
    validateConfirmPassword();
});
phoneInput.addEventListener('blur', validatePhone);
birthDateInput.addEventListener('change', validateBirthDate);

[fullNameInput, emailInput, passwordInput, confirmPasswordInput, birthDateInput, phoneInput].forEach(input => {
    input.addEventListener('input', () => {
        if (input.id !== 'phone') {
            const errorId = input.id + 'Error';
            clearError(input, errorId);
        }
        if (formSubmissionMessage.classList.contains('error') && input.id !== 'phone') {
            formSubmissionMessage.style.display = 'none';
        }
    });
});