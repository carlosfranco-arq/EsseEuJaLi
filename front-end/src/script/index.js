document.addEventListener('DOMContentLoaded', async () => {
    const mensagemBemVindo = document.getElementById('mensagemBemVindo');
    const rankingUsuarios = document.getElementById('rankingUsuarios');
    const criteriosPontuacao = document.getElementById('criteriosPontuacao');

    // Receber as variáveis 'usuarioNome' e 'usuarioAtual' do localStorage (após o login)
    const usuarioNome = localStorage.getItem('usuarioNome');
    const usuarioAtual = localStorage.getItem('usuarioAtual');

    // Verificar se as variáveis estão presentes
    if (usuarioNome && usuarioAtual) {
        mensagemBemVindo.textContent = `Bem-vindo, ${usuarioNome}!`;

        // Carregar dados do arquivo estante.json
        const responseEstante = await fetch('../../back-end/estante.json');
        const estante = await responseEstante.json();

        // Carregar dados do arquivo usuario.json
        const responseUsuarios = await fetch('../../back-end/usuario.json');
        const usuarios = await responseUsuarios.json();

        // Criar o ranking de usuários
        const ranking = criarRanking(estante, usuarios, usuarioAtual);

        // Adicionar os itens do ranking à lista no HTML
        ranking.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}º - ${item.nome}: ${item.pontuacao} pontos`;

            // Adicionar destaque amarelo para o usuário atual
            if (item.username === usuarioAtual) {
                li.style.backgroundColor = 'yellow';
            }

            rankingUsuarios.appendChild(li);
        });

        // Adicionar texto explicativo dos critérios de pontuação
        // const criteriosTexto = `
        //     Critérios de Pontuação:
        //     - Cada livro lido vale 1 ponto.
        //     - Para cada 100 páginas de um livro, são adicionados pontos adicionais:
        //       - 72 a 99 páginas: +1 ponto
        //       - 100 a 199 páginas: +2 pontos
        //       - 200 a 299 páginas: +3 pontos
        //       - E assim por diante...
        // `;

        criteriosPontuacao.textContent = criteriosTexto;
    } else {
        // Se as variáveis não estiverem presentes, redirecionar para a página de login
        window.location.href = 'login.html';
    }
});

function criarRanking(estante, usuarios, usuarioAtual) {
    const pontuacoes = {};

    estante.forEach(livro => {
        const usuarioInfo = usuarios.find(u => u.username === livro.usuario);
        const pontuacao = calcularPontuacao(livro.paginas);

        // Adicionar pontuação ao usuário
        if (pontuacoes[livro.usuario]) {
            pontuacoes[livro.usuario] += pontuacao;
        } else {
            pontuacoes[livro.usuario] = pontuacao;
        }
    });

    const ranking = [];

    // Converter o objeto de pontuações em um array
    for (const username in pontuacoes) {
        const usuarioInfo = usuarios.find(u => u.username === username);
        const pontuacao = pontuacoes[username];

        ranking.push({
            nome: usuarioInfo ? usuarioInfo.nome : username,
            username: username,
            pontuacao: pontuacao,
        });
    }

    // Ordenar o ranking pelo total de pontos
    ranking.sort((a, b) => b.pontuacao - a.pontuacao);

    return ranking.slice(0, 10); // Pegar os 10 primeiros usuários no ranking
}

function calcularPontuacao(paginas) {
    const paginasInt = parseInt(paginas);
    
    // Cada livro vale 1 ponto
    let pontuacao = 1;

    // Bônus adicionais para cada 100 páginas, limitado a um máximo de 4 pontos
    pontuacao += Math.min(Math.floor(paginasInt / 72), 4);
    pontuacao += Math.min(Math.floor(paginasInt / 124), 4 - pontuacao);
    pontuacao += Math.min(Math.floor(paginasInt / 248), 4 - pontuacao);
    pontuacao += Math.min(Math.floor(paginasInt / 496), 4 - pontuacao);

    return pontuacao;
}
