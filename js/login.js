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
      toggleIcon.textContent = tipo === "password" ? "👁️" : "🙈";
    });
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      loginErro.textContent = "";
      senhaErro.textContent = "";
  
      let loginValido = true;
  
      if (!loginInput.value.trim()) {
        loginErro.textContent = "Por favor, insira seu e-mail ou ID.";
        loginValido = false;
      }
  
      if (!senhaInput.value.trim()) {
        senhaErro.textContent = "Por favor, digite sua senha.";
        loginValido = false;
      } else if (senhaInput.value.length < 6) {
        senhaErro.textContent = "A senha deve conter pelo menos 6 caracteres.";
        loginValido = false;
      }
  
      if (loginValido) {
        const login = loginInput.value.trim();
        const senha = senhaInput.value;
  
        if (login === "admin" && senha === "123456") {
          alert("Login bem-sucedido! ✅");
          window.location.href = "index.html";
        } else {
          senhaErro.textContent = "Usuário ou senha inválidos.";
        }
      }
    });
  });
  