// pega os campos do formulário no html
const form = document.getElementById('registrationForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const phoneInput = document.getElementById('phone');
const birthDateInput = document.getElementById('birthDate');
const formSubmissionMessage = document.getElementById('formSubmissionMessage');

// quando alguem tentar enviar o formulário
form.addEventListener('submit', function (event) {
    event.preventDefault(); // nao deixa o formulário ser enviado do jeito antigo (recarregando a página)

    // limpa mensagens de erro ou sucesso que ja estavam na tela
    formSubmissionMessage.style.display = 'none';
    formSubmissionMessage.textContent = '';
    formSubmissionMessage.className = 'form-message'; 

    // verifica se todos os campos estao ok
    let isValid = true;
    if (!validateFullName()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validatePassword()) isValid = false;
    if (!validateConfirmPassword()) isValid = false;
    if (!validatePhone()) isValid = false;
    if (!validateBirthDate()) isValid = false;

    // se tudo tiver valido
    if (isValid) {
        // pega os valores de cada campo
        const nomeCompleto = fullNameInput.value;
        const email = emailInput.value;
        const senha = passwordInput.value; // a senha do usuário
        const telefone = phoneInput.value;
        const dataNascimento = birthDateInput.value;

        // cria um objeto com os dados do usuario
        const userData = {
            fullName: nomeCompleto,
            email: email,
            password: senha, 
            phone: telefone,
            birthDate: dataNascimento
        };

        // guarda os dados do usuario no localStorage (memoria do browser)
        // o localStorage so guarda texto, entao transforma o objeto em texto (JSON)
        localStorage.setItem('registeredUser', JSON.stringify(userData));

        console.log('usuário cadastrado e salvo no localStorage:', userData);

        // mostra mensagem de sucesso
        formSubmissionMessage.textContent = 'cadastro realizado com sucesso!';
        formSubmissionMessage.classList.add('success'); 
        formSubmissionMessage.style.display = 'block';

        form.reset(); // limpa o formulario

        // delay de 2 segundos e depois vai pra pgina de login
        setTimeout(function() {
            window.location.href = 'login.html';
        }, 2000);

    } else {
        // se nao tiver valido mostra mensagem de erro
        formSubmissionMessage.textContent = 'por favor, corrija os erros no formulário.';
        formSubmissionMessage.classList.add('error'); // pra deixar a mensagem vermelha no css
        formSubmissionMessage.style.display = 'block';
        console.log('formulário de cadastro inválido.');
    }
});

// funcoes pra verificar se os campos estão certos
// funcaoo pra mostrar mensagem de erro em um campo especifico
function showError(inputElement, errorElementId, message) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) errorElement.textContent = message; // mostra a mensagem de erro
    inputElement.classList.add('invalid'); // deixa o campo vermelho no css
}

// funcao pra limpar a mensagem de erro de um campo
function clearError(inputElement, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) errorElement.textContent = ''; // apaga a mensagem
    inputElement.classList.remove('invalid'); // tira o vermelho do campo
}

// verifica o nome completo
function validateFullName() {
    clearError(fullNameInput, 'fullNameError');
    if (fullNameInput.value.trim() === '') { 
		// se tiver vazio (tirando os espaços)
        showError(fullNameInput, 'fullNameError', 'nome completo é obrigatório.');
        return false; // nao e valido
    }
    return true; // e valido
}

// verifica o email
function validateEmail() {
    clearError(emailInput, 'emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // pra verificar se o email é um email
    if (!emailInput.value) { 
		// se tiver vazio
        showError(emailInput, 'emailError', 'email é obrigatório.');
        return false;
    }
    if (!emailPattern.test(emailInput.value)) { 
		// se nao parecer com um email
        showError(emailInput, 'emailError', 'formato de email inválido. \n(ex.: meunome123@gmail.com)');
        return false;
    }
    return true;
}

// verifica a senha
function validatePassword() {
    clearError(passwordInput, 'passwordError');
    const passwordValue = passwordInput.value;
    const specialCharPattern = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/; // pra ver se tem caractere especial
    if (passwordValue.length < 8) { 
		// se for menor que 8 letras/numeros
        showError(passwordInput, 'passwordError', 'mínimo 8 caracteres.');
        return false;
    }
    if (!specialCharPattern.test(passwordValue)) { 
		// se nao tiver caractere especial
        showError(passwordInput, 'passwordError', 'incluir caractere especial (ex: !@#$).');
        return false;
    }
    return true;
}

// verifica se a confirmacao de senha bate com a senha
function validateConfirmPassword() {
    clearError(confirmPasswordInput, 'confirmPasswordError');
    if (confirmPasswordInput.value.trim() === '') {
        showError(confirmPasswordInput, 'confirmPasswordError', 'confirmação de senha obrigatória.');
        return false;
    }
    if (confirmPasswordInput.value !== passwordInput.value) {
		// se for diferente da primeira senha
        showError(confirmPasswordInput, 'confirmPasswordError', 'as senhas não combinam.');
        return false;
    }
    return true;
}

// verifica o telefone (se foi preenchido)
function validatePhone() {
    clearError(phoneInput, 'phoneError');
    const phoneValue = phoneInput.value.trim();
    if (phoneValue === '') return true; 
	// telefone e opcional

    const justDigits = phoneValue.replace(/\D/g, ''); // tira tudo que nao for numero
    const phonePattern = /^(?:[1-9]{2}|0[1-9]{2})?(?:[2-8]|9[1-9])[0-9]{3,4}[0-9]{4}$/; // pra verificar se e um telefone
    if (!phonePattern.test(justDigits) || justDigits.length < 10 || justDigits.length > 11) {
        showError(phoneInput, 'phoneError', 'formato inválido. use (xx) xxxxx-xxxx ou xxxxxxxxxxx.');
        return false;
    }
    return true;
}

// verifica a data de nascimento
function validateBirthDate() {
    clearError(birthDateInput, 'birthDateError');
    if (birthDateInput.value === '') {
        showError(birthDateInput, 'birthDateError', 'data de nascimento obrigatória.');
        return false;
    }
    const today = new Date(); // pega a data de hoje
    const birthDate = new Date(birthDateInput.value); // transforma o texto da data em data de verdade
    // pega so dia, mes e ano pra comparar certo
    const birthDateOnly = new Date(birthDate.getUTCFullYear(), birthDate.getUTCMonth(), birthDate.getUTCDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (birthDateOnly >= todayOnly) { // se a data de nascimento for hoje ou no futuro
        showError(birthDateInput, 'birthDateError', 'data de nascimento deve ser no passado.');
        return false;
    }
    // calcula a idade
    let age = todayOnly.getFullYear() - birthDateOnly.getFullYear();
    const m = todayOnly.getMonth() - birthDateOnly.getMonth();
    if (m < 0 || (m === 0 && todayOnly.getDate() < birthDateOnly.getDate())) {
        age--;
    }
    if (age < 16) { // se for menor de 16 anos (idade minima = 16 anos)
        showError(birthDateInput, 'birthDateError', 'idade mínima de 16 anos.');
        return false;
    }
    return true;
}

//validar quando a pessoa muda de campo ou digita
// formata o telefone enquanto digita (coloca parenteses e traço)
phoneInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // so numeros
    if (value.length > 11) value = value.substring(0, 11); // maximo 11 numeros
    let formattedValue = '';
    if (value.length > 0) formattedValue = '(' + value.substring(0, 2); // DDD (xx

    if (value.length > 2) { // xxxxx-xxxx resto do numero
        const numPart = value.substring(2);
        if (numPart.length <= 4) formattedValue += ') ' + numPart;
        else if (numPart.length <= 8 && value.length <= 10) formattedValue += ') ' + numPart.substring(0, 4) + '-' + numPart.substring(4);
        else formattedValue += ') ' + numPart.substring(0, 5) + '-' + numPart.substring(5);
    }
    e.target.value = formattedValue; // atualiza o campo com o telefone formatado
    // se tiver mensagem de erro , limpa o erro do telefone
    if (formSubmissionMessage.classList.contains('error')) {
        clearError(phoneInput, 'phoneError');
    }
});

// valida quando clica fora do campo
fullNameInput.addEventListener('blur', validateFullName);
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);
confirmPasswordInput.addEventListener('blur', () => { validatePassword(); validateConfirmPassword(); });
phoneInput.addEventListener('blur', validatePhone);
birthDateInput.addEventListener('change', validateBirthDate); // change é melhor pra datas

// limpa os erros do campo quando a pessoa começa a digitar nele
[fullNameInput, emailInput, passwordInput, confirmPasswordInput, birthDateInput].forEach(input => {
    input.addEventListener('input', () => {
        clearError(input, input.id + 'Error'); // limpa o erro especifico do campo
        // se tiver mensagem de erro geral do formulario, esconde ela
        if (formSubmissionMessage.style.display === 'block' && formSubmissionMessage.classList.contains('error')) {
            formSubmissionMessage.style.display = 'none';
        }
    });
});
