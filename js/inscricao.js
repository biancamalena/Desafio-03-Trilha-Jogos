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
    let cpf = campo.value.replace(/\D/g, '');
    if (cpf.length > 11) cpf = cpf.substring(0, 11);
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    campo.value = cpf;
}

function formatarTelefone(campo) {
    let numero = campo.value.replace(/\D/g, '');
    if (numero.length > 11) numero = numero.substring(0, 11);
    if (numero.length > 0) {
        numero = numero.replace(/^(\d{2})(\d)/, '($1) $2');
        numero = numero.length > 10 ? 
            numero.replace(/(\d{5})(\d)/, '$1-$2') : 
            numero.replace(/(\d{4})(\d)/, '$1-$2');
    }
    campo.value = numero;
}

function formatarCEP(campo) {
    let cep = campo.value.replace(/\D/g, '');
    if (cep.length > 8) cep = cep.substring(0, 8);
    if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
    campo.value = cep;
    return cep;
}

function validarDataNascimento(data) {
    const regex = /^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
    if (!regex.test(data)) return false;
    
    const [ano, mes, dia] = data.split('-').map(Number);
    const dataObj = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    const idade = hoje.getFullYear() - ano;
    
    return dataObj.getDate() === dia && 
           dataObj.getMonth() === mes - 1 && 
           dataObj.getFullYear() === ano &&
           idade >= 18;
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
        
        const rua = document.getElementById('rua');
        const cidade = document.getElementById('cidade');
        const estado = document.getElementById('estado');
        if (rua) rua.value = data.logradouro || '';
        if (cidade) cidade.value = data.localidade || '';
        if (estado) estado.value = data.uf || '';
        
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
        return { valido: false, mensagem: 'Nome de usuário deve ter pelo menos 4 caracteres' };
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

    return erros.length > 0 ? {
        valido: false,
        mensagem: `A senha deve conter: ${erros.join(', ')}.`
    } : { valido: true };
}

function validarConfirmacaoSenha(senha, confirmacao) {
    if (!confirmacao || confirmacao.length === 0) {
        return { valido: false, mensagem: 'Confirme sua senha' };
    }
    return senha !== confirmacao ? 
        { valido: false, mensagem: 'As senhas não coincidem' } : 
        { valido: true };
}

function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
}

function validarCampo(campo, regex, erroId, mensagemErro) {
    if (!campo || !document.getElementById(erroId)) return false;
    
    const erroElement = document.getElementById(erroId);
    const valido = regex.test(campo.value.trim());
    
    campo.classList.toggle('invalido', !valido);
    erroElement.textContent = !valido ? mensagemErro : '';
    erroElement.style.display = !valido ? 'block' : 'none';
    
    return valido;
}

function validarArquivo(campo, erroId) {
    if (!campo) return false;
    
    const erroElement = document.getElementById(erroId);
    const documentBox = campo.closest('.document__box');
    const valido = campo.files && campo.files.length > 0;
    
    if (erroElement) {
        erroElement.textContent = !valido ? 'Documento obrigatório' : '';
        erroElement.style.display = !valido ? 'block' : 'none';
    }
    if (documentBox) documentBox.classList.toggle('invalido', !valido);
    
    return valido;
}

function configurarMascaras() {
    document.querySelectorAll('input[type="file"]').forEach(campo => {
        campo.addEventListener('change', function() {
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
        
        buscarBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-dasharray="15.7 15.7">
                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
        `;
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
    const camposValidacao = {
        'nome': { regex: /^[A-Za-zÀ-ÿ\s']{3,}$/, mensagem: 'Nome completo inválido' },
        'cpf': { formatar: formatarCPF, validar: (v) => v.replace(/\D/g, '').length === 11 && validarDigitosCPF(v.replace(/\D/g, '')) },
        'email': { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, mensagem: 'E-mail inválido' },
        'telefone': { formatar: formatarTelefone, regex: /^\(\d{2}\) \d{4,5}-\d{4}$/, mensagem: 'Telefone inválido' },
        'cep': { formatar: formatarCEP, regex: /^\d{5}-\d{3}$/, mensagem: 'CEP inválido', erroId: 'cep-erro' },
        'numero': { regex: /^\d+$/, mensagem: 'Apenas números permitidos' },
        'estado': { regex: /^(?:[A-Za-zÀ-ÿ]{2}|[A-Za-zÀ-ÿ\s']{3,})$/, mensagem: 'Estado inválido' },
        'username': { validar: (v) => validarUsername(v.trim()) },
        'senha': { validar: (v) => validarSenha(v) },
        'confirmar_senha': { validar: (v) => validarConfirmacaoSenha(document.getElementById('senha')?.value, v) }
    };

    document.addEventListener('input', (e) => {
        const campo = e.target;
        const config = camposValidacao[campo.id];
        if (!config) return;

        if (config.formatar) config.formatar(campo);
        
        if (config.regex) {
            validarCampo(campo, config.regex, config.erroId || `${campo.id}__erro`, config.mensagem);
        } else if (config.validar) {
            const resultado = config.validar(campo.value);
            const erroElement = document.getElementById(config.erroId || `${campo.id}__erro`);
            
            if (erroElement) {
                erroElement.textContent = resultado.valido ? '' : resultado.mensagem;
                erroElement.style.display = resultado.valido ? 'none' : 'block';
            }
            campo.classList.toggle('invalido', !resultado.valido);
        }
    });
}

function validarFormularioCompleto() {
    let formValido = true;
    
    const camposObrigatorios = [
        { id: 'nome', regex: /^[A-Za-zÀ-ÿ\s']{3,}$/, mensagem: 'Nome completo inválido' },
        { id: 'data_nascimento', validar: validarDataNascimento, mensagem: 'Data inválida ou menor de 18 anos' },
        { id: 'cpf', regex: /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, mensagem: 'CPF inválido' },
        { id: 'email', regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, mensagem: 'E-mail inválido' },
        { id: 'telefone', regex: /^\(\d{2}\) \d{4,5}-\d{4}$/, mensagem: 'Telefone inválido' },
        { id: 'cep', regex: /^\d{5}-\d{3}$/, mensagem: 'CEP inválido', erroId: 'cep-erro' },
        { id: 'numero', regex: /^\d+$/, mensagem: 'Número inválido' },
        { id: 'username', regex: /^[a-zA-Z0-9_.]{4,}$/, mensagem: 'Nome de usuário inválido' },
        { id: 'senha', validar: validarSenha, mensagem: 'Senha inválida' }
    ];

    camposObrigatorios.forEach(({ id, regex, validar, mensagem, erroId }) => {
        const campo = document.getElementById(id);
        if (!campo) return;
        
        const valido = validar ? 
            validar(campo.value)?.valido ?? false : 
            regex.test(campo.value.trim());
        
        if (!valido) {
            const erroElement = document.getElementById(erroId || `${id}__erro`);
            if (erroElement) {
                erroElement.textContent = mensagem;
                erroElement.style.display = 'block';
            }
            campo.classList.add('invalido');
            formValido = false;
        }
    });

    if (!document.querySelector('input[name="trilha"]:checked')) {
        document.getElementById('trilha__erro').style.display = 'block';
        document.querySelector('.trilha__escolhida').classList.add('invalido');
        formValido = false;
    }

    if (!document.getElementById('declaro')?.checked) {
        document.getElementById('declaro__erro').style.display = 'block';
        document.querySelector('.checkbox').classList.add('invalido');
        formValido = false;
    }

    return formValido;
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
            console.log('Dados do formulário:', Object.fromEntries(formData.entries()));
            
            const mensagemConfirmacao = document.getElementById('mensagemConfirmacao');
            if (mensagemConfirmacao) {
                mensagemConfirmacao.classList.add('mostrar');
                mensagemConfirmacao.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Erro no envio:', error);
            submitBtn.disabled = false;
        }
    });

    const fecharMensagemBtn = document.getElementById('fecharMensagemBtn');
    if (fecharMensagemBtn) {
        fecharMensagemBtn.addEventListener('click', () => {
            document.getElementById('mensagemConfirmacao')?.classList.remove('mostrar');
            form.querySelector('button[type="submit"]').disabled = false;
            form.reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    configurarMascaras();
    configurarValidacaoEmTempoReal();
    configurarEnvioFormulario();
});