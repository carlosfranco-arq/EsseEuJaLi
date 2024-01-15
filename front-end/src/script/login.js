async function realizarLogin() {
    const usuarioInput = document.getElementById('usuario');
    const senhaInput = document.getElementById('senha');
    const usuario = usuarioInput.value;
    const senha = senhaInput.value;

    if (!usuario || !senha) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        // Carregar dados do arquivo usuario.json
        const response = await fetch('../../back-end/usuario.json');
        const usuarios = await response.json();

        // Verificar se as credenciais são válidas
        const usuarioEncontrado = usuarios.find(u => u.username === usuario && u.password === senha);
        if (usuarioEncontrado) {
            // Atribuir valores às variáveis globais
            localStorage.setItem('usuarioNome', usuarioEncontrado.nome);
            localStorage.setItem('usuarioAtual', usuarioEncontrado.username);

            // Redirecionar para a página index.html
            window.location.href = 'index.html';
        } else {
            alert('Credenciais inválidas. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        alert('Erro ao realizar login. Por favor, tente novamente.');
    }
}
