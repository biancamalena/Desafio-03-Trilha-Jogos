document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const loginInput = document.getElementById("login");
  const senhaInput = document.getElementById("senha");
  const toggleIcon = document.getElementById("toggleSenha");

  const loginErro = document.getElementById("login__erro");
  const senhaErro = document.getElementById("senha__erro");

  toggleIcon.textContent = "🙈";
  toggleIcon.addEventListener("click", () => {
    const tipo = senhaInput.type === "password" ? "text" : "password";
    senhaInput.type = tipo;
    toggleIcon.textContent = tipo === "password" ? "🙈" : "👁️";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    loginErro.textContent = "";
    senhaErro.textContent = "";

    const login = loginInput.value.trim();
    const senha = senhaInput.value;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!login) {
      loginErro.textContent = "Por favor, insira seu e-mail ou nome de usuário.";
      return;
    } else if (emailRegex.test(login) === false && !login.match(/^[a-zA-Z0-9]+$/)) {
      loginErro.textContent = "Por favor, insira um e-mail válido.";
      return;
    }

    if (!senha) {
      senhaErro.textContent = "Por favor, digite sua senha.";
      return;
    }

    senhaErro.textContent = "Verificando...";

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(user =>
      (user.email === login || user.username === login) && user.senha === senha
    );

    if (usuarioEncontrado) {
      alert("Login bem-sucedido! ✅");
      window.location.href = "index.html";
    } else {
      senhaErro.textContent = "Usuário ou senha inválidos.";
    }
  });
});