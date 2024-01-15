document.addEventListener('DOMContentLoaded', async () => {
    const usuarioAtual = localStorage.getItem('usuarioAtual');

    try {
        // Carregar dados do arquivo biblioteca.json
        const responseBiblioteca = await fetch('../../back-end/biblioteca.json');
        const livrosBiblioteca = await responseBiblioteca.json();

        // Carregar dados do arquivo estante.json
        const responseEstante = await fetch('../../back-end/estante.json');
        let estante = await responseEstante.json();

        // Ordenar os livros da biblioteca por gênero e título
        livrosBiblioteca.sort((a, b) => {
            if (a.genero !== b.genero) {
                return a.genero.localeCompare(b.genero);
            }
            return a.titulo.localeCompare(b.titulo);
        });

        // Preencher a tabela de livros por gênero
        const tabelaLivros = document.getElementById('tabelaLivros');
        const thead = tabelaLivros.querySelector('thead');
        const tbody = tabelaLivros.querySelector('tbody');

        // Remover colunas existentes
        while (thead.rows[0].cells.length > 0) {
            thead.rows[0].deleteCell(0);
        }

        // Adicionar colunas "Gênero", "Título" e "Concluído" ao cabeçalho
        const thGenero = document.createElement('th');
        thGenero.textContent = 'Gênero';
        const thTitulo = document.createElement('th');
        thTitulo.textContent = 'Título';
        const thConcluido = document.createElement('th');
        thConcluido.textContent = 'Concluído';
        thead.rows[0].appendChild(thGenero);
        thead.rows[0].appendChild(thTitulo);
        thead.rows[0].appendChild(thConcluido);

        livrosBiblioteca.forEach(livroBiblioteca => {
            const estaNaEstante = livroEstaNaEstante(livroBiblioteca, estante, usuarioAtual);
            const rowLivro = document.createElement('tr');
            rowLivro.innerHTML = `
                <td>${livroBiblioteca.genero}</td>
                <td>${livroBiblioteca.titulo}</td>
                <td>${estaNaEstante ? (estaNaEstante.data ? formatarData(estaNaEstante.data) : '') : criarBotaoConcluir(livroBiblioteca)}</td>
            `;
            tbody.appendChild(rowLivro);
        });

    } catch (error) {
        console.error('Erro ao carregar dados dos arquivos:', error);
        // Tratar o erro, exibir mensagem na página, etc.
    }
});

function livroEstaNaEstante(livroBiblioteca, estante, usuarioAtual) {
    return estante.find(livroEstante => livroEstante.titulo === livroBiblioteca.titulo && livroEstante.usuario === usuarioAtual);
}

function criarBotaoConcluir(livroBiblioteca) {
    const botao = document.createElement('button');
    botao.textContent = 'Concluir Leitura';
    botao.addEventListener('click', () => concluirLeitura(livroBiblioteca));
    return botao.outerHTML;
}

async function concluirLeitura(livroBiblioteca) {
    try {
        // Obter informações necessárias
        const usuarioAtual = localStorage.getItem('usuarioAtual');
        const genero = livroBiblioteca.genero;
        const titulo = livroBiblioteca.titulo;
        const dataAtual = new Date().toISOString().slice(0, 10); // Formatando a data para AAAA-MM-DD

        // Adicionar informações ao final do arquivo estante.json
        const novoLivro = { usuario: usuarioAtual, genero: genero, titulo: titulo, concluido: dataAtual };
        estante.push(novoLivro);

        // Atualizar o conteúdo do arquivo estante.json no servidor (modo Live Server)
        await fetch('../../back-end/estante.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(estante),
        });

        // Recarregar a página "biblioteca.html"
        location.reload();
    } catch (error) {
        console.error('Erro ao concluir leitura:', error);
        // Tratar o erro, exibir mensagem na página, etc.
    }
}

function formatarData(data) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}-${mes}-${ano}`;
}
