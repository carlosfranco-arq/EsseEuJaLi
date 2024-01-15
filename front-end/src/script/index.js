document.addEventListener('DOMContentLoaded', async () => {
    const mensagemBemVindo = document.getElementById('mensagemBemVindo');

    // Receber as variáveis 'usuarioNome' e 'usuarioAtual' do localStorage (após o login)
    const usuarioNome = localStorage.getItem('usuarioNome');
    const usuarioAtual = localStorage.getItem('usuarioAtual');

    // Verificar se as variáveis estão presentes
    if (usuarioNome && usuarioAtual) {
        mensagemBemVindo.textContent = `Bem-vindo, ${usuarioNome}!`;
    } else {
        // Se as variáveis não estiverem presentes, redirecionar para a página de login
        window.location.href = 'login.html';
    }
});
