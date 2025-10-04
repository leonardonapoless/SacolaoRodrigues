const form = document.getElementById('registrationForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const phoneInput = document.getElementById('phone');
const birthDateInput = document.getElementById('birthDate');
const formSubmissionMessage = document.getElementById('formSubmissionMessage');

form.addEventListener('submit', function (event) {
    event.preventDefault();

    formSubmissionMessage.style.display = 'none';
    formSubmissionMessage.textContent = '';
    formSubmissionMessage.className = 'form-message'; 

    let isValid = true;
    if (!validateFullName()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;
    if (!validateConfirmPassword()) isValid = false;
    if (!validatePhone()) isValid = false;
    if (!validateBirthDate()) isValid = false;

    if (isValid) {
        const nomeCompleto = fullNameInput.value;
        const email = emailInput.value;
        const senha = passwordInput.value;
        const telefone = phoneInput.value;
        const dataNascimento = birthDateInput.value;

        const userData = {
            fullName: nomeCompleto,
            email: email,
            password: senha, 
            phone: telefone,
            birthDate: dataNascimento
        };

        localStorage.setItem('registeredUser', JSON.stringify(userData));

        localStorage.setItem('loggedInUser', JSON.stringify({
            email: userData.email,
            fullName: userData.fullName
        }));

        console.log('usuário cadastrado e salvo no localStorage:', userData);

        formSubmissionMessage.textContent = 'cadastro realizado com sucesso!';
        formSubmissionMessage.classList.add('success'); 
        formSubmissionMessage.style.display = 'block';

        form.reset();

        setTimeout(function() {
            if (window.router) {
                window.router.goTo('/perfil');
            } else {
                window.location.href = '/pages/perfil.html';
            }
        }, 2000);

    } else {
        formSubmissionMessage.textContent = 'por favor, corrija os erros no formulário.';
        formSubmissionMessage.classList.add('error');
        formSubmissionMessage.style.display = 'block';
        console.log('formulário de cadastro inválido.');
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

function validateFullName() {
    clearError(fullNameInput, 'fullNameError');
    if (fullNameInput.value.trim() === '') { 
        showError(fullNameInput, 'fullNameError', 'nome completo é obrigatório.');
        return false;
    }
    return true;
}

function validateEmail() {
    clearError(emailInput, 'emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value) { 
        showError(emailInput, 'emailError', 'email é obrigatório.');
        return false;
    }
    if (!emailPattern.test(emailInput.value)) { 
        showError(emailInput, 'emailError', 'formato de email inválido. \n(ex.: meunome123@gmail.com)');
        return false;
    }
    return true;
}

function validatePassword() {
    clearError(passwordInput, 'passwordError');
    const passwordValue = passwordInput.value;
    const specialCharPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (passwordValue.length < 8) { 
        showError(passwordInput, 'passwordError', 'mínimo 8 caracteres.');
        return false;
    }
    if (!specialCharPattern.test(passwordValue)) { 
        showError(passwordInput, 'passwordError', 'incluir caractere especial (ex: !@#$).');
        return false;
    }
    return true;
}

function validateConfirmPassword() {
    clearError(confirmPasswordInput, 'confirmPasswordError');
    if (confirmPasswordInput.value.trim() === '') {
        showError(confirmPasswordInput, 'confirmPasswordError', 'confirmação de senha obrigatória.');
        return false;
    }
    if (confirmPasswordInput.value !== passwordInput.value) {
        showError(confirmPasswordInput, 'confirmPasswordError', 'as senhas não combinam.');
        return false;
    }
    return true;
}

function validatePhone() {
    clearError(phoneInput, 'phoneError');
    const phoneValue = phoneInput.value.trim();
    if (phoneValue === '') return true; 

    const justDigits = phoneValue.replace(/\D/g, '');
    const phonePattern = /^(?:[1-9]{2}|0[1-9]{2})?(?:[2-8]|9[1-9])[0-9]{3,4}[0-9]{4}$/;
    if (!phonePattern.test(justDigits) || justDigits.length < 10 || justDigits.length > 11) {
        showError(phoneInput, 'phoneError', 'formato inválido. use (xx) xxxxx-xxxx ou xxxxxxxxxxx.');
        return false;
    }
    return true;
}

function validateBirthDate() {
    clearError(birthDateInput, 'birthDateError');
    if (birthDateInput.value === '') {
        showError(birthDateInput, 'birthDateError', 'data de nascimento obrigatória.');
        return false;
    }
    const today = new Date();
    const birthDate = new Date(birthDateInput.value);
    const birthDateOnly = new Date(birthDate.getUTCFullYear(), birthDate.getUTCMonth(), birthDate.getUTCDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (birthDateOnly >= todayOnly) {
        showError(birthDateInput, 'birthDateError', 'data de nascimento deve ser no passado.');
        return false;
    }
    let age = todayOnly.getFullYear() - birthDateOnly.getFullYear();
    const m = todayOnly.getMonth() - birthDateOnly.getMonth();
    if (m < 0 || (m === 0 && todayOnly.getDate() < birthDateOnly.getDate())) {
        age--;
    }
    if (age < 16) {
        showError(birthDateInput, 'birthDateError', 'idade mínima de 16 anos.');
        return false;
    }
    return true;
}

phoneInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    let formattedValue = '';
    if (value.length > 0) formattedValue = '(' + value.substring(0, 2);

    if (value.length > 2) {
        const numPart = value.substring(2);
        if (numPart.length <= 4) formattedValue += ') ' + numPart;
        else if (numPart.length <= 8 && value.length <= 10) formattedValue += ') ' + numPart.substring(0, 4) + '-' + numPart.substring(4);
        else formattedValue += ') ' + numPart.substring(0, 5) + '-' + numPart.substring(5);
    }
    e.target.value = formattedValue;
    if (formSubmissionMessage.classList.contains('error')) {
        clearError(phoneInput, 'phoneError');
    }
});

fullNameInput.addEventListener('blur', validateFullName);
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);
confirmPasswordInput.addEventListener('blur', () => { validatePassword(); validateConfirmPassword(); });
phoneInput.addEventListener('blur', validatePhone);
birthDateInput.addEventListener('change', validateBirthDate);

[fullNameInput, emailInput, passwordInput, confirmPasswordInput, birthDateInput].forEach(input => {
    input.addEventListener('input', () => {
        clearError(input, input.id + 'Error');
        if (formSubmissionMessage.style.display === 'block' && formSubmissionMessage.classList.contains('error')) {
            formSubmissionMessage.style.display = 'none';
        }
    });
});
