document.addEventListener('DOMContentLoaded', async () => {
    const estante = document.getElementById('livrosContainer');
    // const usuarioAtual = "beltrano456";
    // Receber as variáveis 'usuarioNome' e 'usuarioAtual' do localStorage (após o login)
    const usuarioNome = localStorage.getItem('usuarioNome');
    const usuarioAtual = localStorage.getItem('usuarioAtual');
    try {
        // Carregar dados do arquivo estante.json
        const response = await fetch('../../back-end/estante.json');
        const livros = await response.json();

        // Filtrar livros do usuário atual
        const livrosDoUsuario = livros.filter(livro => livro.usuario === usuarioAtual);

        // Agrupar os livros por gênero
        const livrosPorGenero = {};
        livrosDoUsuario.forEach(livro => {
            if (!livrosPorGenero[livro.genero]) {
                livrosPorGenero[livro.genero] = [];
            }
            livrosPorGenero[livro.genero].push(livro);
        });

        // Exibir os livros agrupados por gênero em forma de tabela na página
        for (const genero in livrosPorGenero) {
            const generoTable = document.createElement('table');
            generoTable.innerHTML = `
                <caption>${genero}</caption>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Data de Conclusão</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            const tbody = generoTable.querySelector('tbody');

            livrosPorGenero[genero].forEach(livro => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${livro.titulo}</td>
                    <td>${livro.concluido}</td>
                `;
                tbody.appendChild(row);
            });

            estante.appendChild(generoTable);
        }

        // Atualizar o título da página com o nome do usuário atual
        document.querySelector('h1').innerText = `Estante do ${usuarioNome}`;
    } catch (error) {
        console.error('Erro ao carregar dados do arquivo estante.json:', error);
        // Tratar o erro, exibir mensagem na página, etc.
    }
});
