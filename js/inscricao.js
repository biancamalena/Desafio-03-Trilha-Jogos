function filtrarSomenteNumeros(campo) {
    campo.value = campo.value.replace(/\D/g, '');
}

function validarDigitosCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;

    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.charAt(10));
}

function formatarCPF(campo) {
    let cpf = campo.value.replace(/\D/g, '').substring(0, 11);
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d)/, '$1.$2')
             .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    campo.value = cpf;
}

function formatarTelefone(campo) {
    let numero = campo.value.replace(/\D/g, '').substring(0, 11);
    if (numero.length > 0) {
        numero = numero.replace(/^(\d{2})(\d)/, '($1) $2');
        numero = numero.length > 10 ?
            numero.replace(/(\d{5})(\d)/, '$1-$2') :
            numero.replace(/(\d{4})(\d)/, '$1-$2');
    }
    campo.value = numero;
}

function formatarCEP(campo) {
    let cep = campo.value.replace(/\D/g, '').substring(0, 8);
    if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    campo.value = cep;
    return cep;
}

async function buscarEnderecoPorCEP(cep) {
    try {
        cep = cep.replace(/\D/g, '');
        const cepErro = document.getElementById('cep-erro');

        if (cep.length !== 8) {
            if (cepErro) cepErro.textContent = 'CEP deve ter 8 dígitos';
            return false;
        }

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) throw new Error('Erro na resposta da API');

        const data = await response.json();
        if (data.erro) {
            if (cepErro) cepErro.textContent = 'CEP não encontrado';
            return false;
        }

        document.getElementById('rua').value = data.logradouro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
        if (cepErro) cepErro.textContent = '';
        return true;
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        const cepErro = document.getElementById('cep-erro');
        if (cepErro) cepErro.textContent = 'Erro ao consultar CEP. Tente novamente.';
        return false;
    }
}

function validarUsername(username) {
    if (!username || username.trim().length === 0) {
        return { valido: false, mensagem: 'Nome de usuário é obrigatório' };
    }
    if (username.length < 4) {
        return { valido: false, mensagem: 'Mínimo de 4 caracteres' };
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
        return { valido: false, mensagem: 'Use apenas letras, números, pontos e underline' };
    }
    return { valido: true };
}

function validarSenha(senha) {
    const erros = [];
    if (!senha || senha.length === 0) erros.push('Senha é obrigatória');
    if (senha.length < 8) erros.push('mínimo 8 caracteres');
    if (!/[a-z]/.test(senha)) erros.push('uma letra minúscula');
    if (!/[A-Z]/.test(senha)) erros.push('uma letra maiúscula');
    if (!/\d/.test(senha)) erros.push('um número');
    if (!/[\W_]/.test(senha)) erros.push('um caractere especial');

    return erros.length > 0
        ? { valido: false, mensagem: `A senha deve conter: ${erros.join(', ')}.` }
        : { valido: true };
}

function validarConfirmacaoSenha(senha, confirmacao) {
    if (!confirmacao || confirmacao.length === 0) {
        return { valido: false, mensagem: 'Confirme sua senha' };
    }
    return senha !== confirmacao
        ? { valido: false, mensagem: 'As senhas não coincidem' }
        : { valido: true };
}

function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
}

function validarCampo(campo, regex, erroId, mensagemErro) {
    const erroElement = document.getElementById(erroId);
    const valido = regex.test(campo.value.trim());
    campo.classList.toggle('invalido', !valido);
    if (erroElement) {
        erroElement.textContent = !valido ? mensagemErro : '';
        erroElement.style.display = !valido ? 'block' : 'none';
    }
    return valido;
}

function configurarMascaras() {
    document.querySelectorAll('input[type="file"]').forEach(campo => {
        campo.addEventListener('change', function () {
            const spanNome = this.parentElement.querySelector('.nome__arquivo');
            if (this.files?.[0] && spanNome) {
                spanNome.textContent = this.files[0].name;
                spanNome.style.display = 'block';
            } else if (spanNome) {
                spanNome.style.display = 'none';
            }
        });
    });

    document.getElementById('buscarCepBtn')?.addEventListener('click', debounce(async () => {
        const buscarBtn = document.getElementById('buscarCepBtn');
        const originalBtnContent = buscarBtn.innerHTML;
        buscarBtn.innerHTML = `<span class="spinner"></span>`;
        buscarBtn.disabled = true;

        try {
            const cepCampo = document.getElementById('cep');
            const resultado = await buscarEnderecoPorCEP(cepCampo.value);
            cepCampo?.classList.toggle('invalido', !resultado);
        } finally {
            buscarBtn.innerHTML = originalBtnContent;
            buscarBtn.disabled = false;
        }
    }));
}

function configurarValidacaoEmTempoReal() {
    const campos = {
        nome: { regex: /^[A-Za-zÀ-ÿ\s']{3,}$/, mensagem: 'Nome inválido' },
        cpf: {
            formatar: formatarCPF,
            validar: (v) => ({
                valido: validarDigitosCPF(v.replace(/\D/g, '')),
                mensagem: 'CPF inválido'
            })
        },
        email: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, mensagem: 'E-mail inválido' },
        telefone: {
            formatar: formatarTelefone,
            regex: /^\(\d{2}\) \d{4,5}-\d{4}$/,
            mensagem: 'Telefone inválido'
        },
        cep: {
            formatar: formatarCEP,
            regex: /^\d{5}-\d{3}$/,
            mensagem: 'CEP inválido',
            erroId: 'cep-erro'
        },
        numero: { regex: /^\d+$/, mensagem: 'Número inválido' },
        username: { validar: validarUsername },
        senha: { validar: validarSenha },
        confirmar_senha: {
            validar: (v) => validarConfirmacaoSenha(document.getElementById('senha')?.value, v)
        }
    };

    document.addEventListener('input', (e) => {
        const campo = e.target;
        const config = campos[campo.id];
        if (!config) return;

        if (config.formatar) config.formatar(campo);

        if (config.regex) {
            validarCampo(campo, config.regex, config.erroId || `${campo.id}__erro`, config.mensagem);
        } else if (config.validar) {
            const resultado = config.validar(campo.value);
            const erroElement = document.getElementById(config.erroId || `${campo.id}__erro`);
            campo.classList.toggle('invalido', !resultado.valido);
            if (erroElement) {
                erroElement.textContent = resultado.valido ? '' : resultado.mensagem;
                erroElement.style.display = resultado.valido ? 'none' : 'block';
            }
        }
    });
}

function validarFormularioCompleto() {
    let formValido = true;

    const campos = [
        { id: 'nome', regex: /^[A-Za-zÀ-ÿ\s']{3,}$/, mensagem: 'Nome inválido' },
        {
            id: 'cpf', validar: (v) => ({
                valido: validarDigitosCPF(v.replace(/\D/g, '')),
                mensagem: 'CPF inválido'
            })
        },
        { id: 'email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, mensagem: 'E-mail inválido' },
        { id: 'telefone', regex: /^\(\d{2}\) \d{4,5}-\d{4}$/, mensagem: 'Telefone inválido' },
        { id: 'cep', regex: /^\d{5}-\d{3}$/, mensagem: 'CEP inválido', erroId: 'cep-erro' },
        { id: 'numero', regex: /^\d+$/, mensagem: 'Número inválido' },
        { id: 'username', validar: validarUsername },
        { id: 'senha', validar: validarSenha },
        {
            id: 'confirmar_senha',
            validar: (v) => validarConfirmacaoSenha(document.getElementById('senha')?.value, v)
        }
    ];

    campos.forEach(({ id, regex, validar, mensagem, erroId }) => {
        const campo = document.getElementById(id);
        if (!campo) return;

        let resultado = { valido: false };
        if (validar) resultado = validar(campo.value);
        else resultado = { valido: regex.test(campo.value.trim()), mensagem };

        if (!resultado.valido) {
            const erro = document.getElementById(erroId || `${id}__erro`);
            if (erro) {
                erro.textContent = resultado.mensagem || mensagem;
                erro.style.display = 'block';
            }
            campo.classList.add('invalido');
            formValido = false;
        }
    });

    if (!document.querySelector('input[name="trilha"]:checked')) {
        document.getElementById('trilha__erro').style.display = 'block';
        document.querySelector('.trilha__escolhida')?.classList.add('invalido');
        formValido = false;
    }

    if (!document.getElementById('declaro')?.checked) {
        document.getElementById('declaro__erro').style.display = 'block';
        document.querySelector('.checkbox')?.classList.add('invalido');
        formValido = false;
    }

    return formValido;
}

document.addEventListener('DOMContentLoaded', () => {
    configurarMascaras();
    configurarValidacaoEmTempoReal();
    configurarEnvioFormulario();
});

function salvarDadosLocalStorage(dados) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(dados);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function configurarEnvioFormulario() {
    const form = document.querySelector('.form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        document.querySelectorAll('.mensagem__erro').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.invalido').forEach(el => el.classList.remove('invalido'));

        if (!validarFormularioCompleto()) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;

        try {
            const formData = new FormData(form);
            const dados = Object.fromEntries(formData.entries());

            // Salvar dados essenciais no localStorage
            salvarDadosLocalStorage({
                nome: dados.nome,
                username: dados.username,
                email: dados.email,
                senha: dados.senha
            });

            const mensagemConfirmacao = document.getElementById('mensagemConfirmacao');
            if (mensagemConfirmacao) {
                mensagemConfirmacao.classList.add('mostrar');
                mensagemConfirmacao.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            submitBtn.disabled = false;
        }
    });

    const fecharBtn = document.getElementById('fecharMensagemBtn');
    if (fecharBtn) {
        fecharBtn.addEventListener('click', () => {
            document.getElementById('mensagemConfirmacao')?.classList.remove('mostrar');
            form.reset();
            form.querySelector('button[type="submit"]').disabled = false;
        });
    }
}