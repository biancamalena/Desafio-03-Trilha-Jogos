# Formulário de Inscrição - Programa de Capacitação em Tecnologia (SECTI/FAPEMA)

Este projeto consiste na criação de um formulário de inscrição para o programa de capacitação em tecnologia do Governo do Maranhão, direcionado a jovens e adultos de 16 a 29 anos, que estejam cursando ou já tenham completado o ensino médio em escolas públicas no Maranhão. O objetivo do formulário é coletar dados básicos de inscrição, com uma base sólida para melhorias futuras, como responsividade, acessibilidade e integração com sistemas.

---

## 🚀 Como Rodar Localmente

1. Clone o repositório:

git clone https://github.com/biancamalena/Desafio-03-Trilha-Jogos

Navegue para o diretório do projeto:

cd nome-do-diretorio
Abra o arquivo index.html no seu navegador preferido.

💡 Dica: Você pode utilizar uma extensão como o Live Server no Visual Studio Code para facilitar a visualização do projeto em tempo real.

🛠️ Tecnologias Utilizadas
HTML: Estruturação das páginas.
CSS: Estilização e design responsivo.
JavaScript: Validação de formulários e funcionalidades interativas.

✨ Principais Funcionalidades
📄 Página de Inscrição
Filtragem de caracteres não numéricos (CPF, telefone, CEP).

Validação de CPF com algoritmo próprio.

Formatação automática de CPF, telefone e CEP.

Consulta de endereço via API ViaCEP.

Validação de nome de usuário e senha com critérios específicos.

Validação completa do formulário antes do envio.

🔐 Página de Login
Alternância da visibilidade da senha (emoji "🙈" e "👁️").

Validação dos campos de login e senha.

❓ Página de Ajuda
Alternância entre formulários de ajuda e feedback.

Retorno à caixa principal de ajuda com um clique.

Exibição automática da ajuda ao carregar a página.

⚙️ Funcionalidades de JavaScript
Debounce: Evita chamadas excessivas durante a digitação.

Máscaras de entrada: CPF, telefone, e CEP.

Validação em tempo real: Valida conforme o usuário digita.

Validação de formulário completo: Confere todos os campos antes do envio.

Armazenamento Local: Dados são salvos com localStorage para persistência entre sessões.

☁️ Deployment
O projeto está hospedado no Vercel e pode ser acessado diretamente através do link do ambiente de produção.

📌 Este projeto é uma base sólida para evolução contínua, permitindo que funcionalidades mais avançadas sejam adicionadas com facilidade.
