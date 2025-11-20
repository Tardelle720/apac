// Seleciona o formulário usando o ID "loginForm"
document.getElementById("loginForm").addEventListener("submit", async function (e) {

    // Impede o formulário de recarregar a página
    e.preventDefault();

    // Pega os valores digitados pelo usuário
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        // Faz a requisição POST para o backend Flask
        const resposta = await fetch("http://127.0.0.1:5000/login", {
            method: "POST", // Envia dados
            headers: { "Content-Type": "application/json" }, // Diz que será JSON
            body: JSON.stringify({ email, senha }) // Envia email e senha
        });

        // Converte resposta do servidor para JSON
        const data = await resposta.json();

        // Se o login foi bem sucedido (status 200 OK)
        if (resposta.ok) {
            alert("Bem-vindo, " + data.user.nome);

            // Salva o ID do usuário no navegador
            localStorage.setItem("userId", data.user.id);

            // Redireciona para o dashboard
            window.location.href = "dashboard.html";
        }
        else {
            // Se a senha estiver incorreta ou o usuário não existir
            alert(data.error);
        }

    } catch (erro) {
        // Caso o servidor esteja desligado ou dê erro na conexão
        alert("Erro ao conectar ao servidor.");
        console.error(erro);
    }
});

