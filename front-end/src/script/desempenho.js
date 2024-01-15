document.addEventListener('DOMContentLoaded', async () => {
    const usuarioNome = localStorage.getItem('usuarioNome');
    const usuarioAtual = localStorage.getItem('usuarioAtual');
    try {
        // Carregar dados do arquivo estante.json
        const response = await fetch('../../back-end/estante.json');
        const livros = await response.json();

        // Obter desempenho e livros por gênero
        const { usuarioAtual, generoMaisLido, livrosPorGenero } = obterDesempenho(livros);

        // Exibir a mensagem na página, apenas se generoMaisLido não for nulo
        if (generoMaisLido !== null) {
            const mensagemElement = document.getElementById('mensagem');
            mensagemElement.innerText = `Parabéns, ${usuarioNome}! Você é um mestre do gênero '${generoMaisLido}'`;
        }

        // Preencher a tabela de livros por gênero
        const tabelaLivros = document.getElementById('tabelaLivros');
        const tbody = tabelaLivros.querySelector('tbody');

        for (const genero in livrosPorGenero) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${genero}</td>
                <td>${livrosPorGenero[genero]}</td>
            `;
            tbody.appendChild(row);
        }
    } catch (error) {
        console.error('Erro ao carregar dados do arquivo estante.json:', error);
        // Tratar o erro, exibir mensagem na página, etc.
    }
});

function obterDesempenho(livros) {
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

    const generosContagem = {};
    const usuarioAtual = localStorage.getItem('usuarioAtual');

    livros.forEach(livro => {
        const dataConclusao = new Date(livro.concluido);
         if (livro.usuario === usuarioAtual && dataConclusao >= seisMesesAtras) {

            if (!generosContagem[livro.genero]) {
                generosContagem[livro.genero] = 1;
            } else {
                generosContagem[livro.genero]++;
            }
        }
    });

    let generoMaisLido = null;

    for (const genero in generosContagem) {
        if (generosContagem[genero] > 2 && (!generoMaisLido || generosContagem[genero] > generosContagem[generoMaisLido])) {
            generoMaisLido = genero;
        }
    }

    return { usuarioAtual, generoMaisLido, livrosPorGenero: generosContagem };
}





























// document.addEventListener('DOMContentLoaded', async () => {
//     const usuarioNome = localStorage.getItem('usuarioNome');
//     const usuarioAtual = localStorage.getItem('usuarioAtual');
//     try {
//         // Carregar dados do arquivo estante.json
//         const response = await fetch('../../back-end/estante.json');
//         const livros = await response.json();

//         // Obter desempenho e livros por gênero para o usuário atual
//         const { usuarioAtual, generoMaisLido, livrosPorGenero } = obterDesempenho(livros);

//         // Exibir a mensagem na página
//         const mensagemElement = document.getElementById('mensagem');
//         mensagemElement.innerText = `Parabéns, ${usuarioNome}! Você é um mestre do gênero '${generoMaisLido}'`;

//         // Preencher a tabela de livros por gênero
//         const tabelaLivros = document.getElementById('tabelaLivros');
//         const tbody = tabelaLivros.querySelector('tbody');

//         for (const genero in livrosPorGenero) {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${genero}</td>
//                 <td>${livrosPorGenero[genero]}</td>
//             `;
//             tbody.appendChild(row);
//         }

//     } catch (error) {
//         console.error('Erro ao carregar dados do arquivo estante.json:', error);
//         // Tratar o erro, exibir mensagem na página, etc.
//     }
// });

// function obterDesempenho(livros) {
//     const seisMesesAtras = new Date();
//     seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

//     const generosContagem = {};
//     const usuarioAtual = localStorage.getItem('usuarioAtual');

//     livros.forEach(livro => {
//         const dataConclusao = new Date(livro.concluido);

//         // Verificar se o livro pertence ao usuário desejado
//         if (livro.usuario === usuarioAtual && dataConclusao >= seisMesesAtras) {
//             if (!generosContagem[livro.genero]) {
//                 generosContagem[livro.genero] = 1;
//             } else {
//                 generosContagem[livro.genero]++;
//             }
//         }
//     });

//     let generoMaisLido = null;

//     for (const genero in generosContagem) {
//         if (generosContagem[genero] > 2 && (!generoMaisLido || generosContagem[genero] > generosContagem[generoMaisLido])) {
//             generoMaisLido = genero;
//         }
//     }

//     return { usuarioAtual, generoMaisLido, livrosPorGenero: generosContagem };
// }
