document.addEventListener('DOMContentLoaded', () => {
    // 1. DADOS CENTRALIZADOS - fácil de atualizar
    const dados = {
        stats: [
            { numero: 75, sufixo: '%', texto: 'das culturas dependem de polinização' },
            { numero: 43, prefixo: 'R$ ', sufixo: ' Bi', texto: 'impacto econômico no Brasil/ano' },
            { numero: 90, sufixo: '%', texto: 'de queda na produção sem abelhas' }
        ],
        importancia: [
            { titulo: 'Polinização', desc: 'Abelhas são responsáveis pela polinização de 70% das principais culturas. Frutas como maçã, melão, café, soja e amêndoas dependem delas.' },
            { titulo: 'Impacto Econômico', desc: 'No Brasil, o serviço de polinização das abelhas é estimado em R$ 43 bilhões por ano para a agricultura.' },
            { titulo: 'Biodiversidade', desc: 'Ao polinizar plantas nativas, as abelhas mantêm ecossistemas inteiros. Isso regula pragas e melhora a qualidade do solo.' }
        ],
        ameacas: [
            { tipo: 'quimico', titulo: 'Agrotóxicos', desc: 'Inseticidas neonicotinoides são letais mesmo em doses baixas. Causam desorientação e morte das colônias.' },
            { tipo: 'ambiental', titulo: 'Perda de Habitat', desc: 'Monoculturas e desmatamento eliminam as flores que servem de alimento o ano todo.' },
            { tipo: 'ambiental', titulo: 'Mudanças Climáticas', desc: 'Alteram o período de floração, dessincronizando abelhas e plantas.' },
            { tipo: 'biologico', titulo: 'Doenças e Parasitas', desc: 'O ácaro Varroa e vírus dizimam colmeias enfraquecidas.' }
        ],
        cuidados: [
            { titulo: 'Use MIP - Manejo Integrado de Pragas', desc: 'Prefira controle biológico. Se precisar aplicar defensivos, escolha produtos seletivos e aplique no fim da tarde ou à noite.' },
            { titulo: 'Crie Corredores Ecológicos', desc: 'Mantenha faixas de vegetação nativa e plante flores entre os talhões. Girassol, nabo forrageiro e crotalária alimentam as abelhas.' },
            { titulo: 'Avise os Apicultores', desc: 'Comunique apiários vizinhos com 48h de antecedência antes de pulverizar. Isso permite que as colmeias sejam cobertas.' },
            { titulo: 'Forneça Água Limpa', desc: 'Abelhas precisam de água. Crie bebedouros seguros com pedras ou gravetos para evitar afogamento.' }
        ],
        quiz: [
            { pergunta: 'Qual o melhor horário para aplicar defensivos?', opcoes: ['12h, com sol forte', '18h, quando abelhas voltam pra colmeia', '8h, início do dia'], correta: 1 },
            { pergunta: 'O que fazer antes de pulverizar?', opcoes: ['Nada', 'Avisar apicultores vizinhos com 48h de antecedência', 'Aumentar a dose'], correta: 1 },
            { pergunta: 'Plantar crotalária ajuda porque:', opcoes: ['Espanta abelhas', 'Alimenta abelhas na entressafra e controla nematoides', 'É tóxica'], correta: 1 }
        ]
    };

    // 2. RENDERIZAÇÃO DINÂMICA
    function renderizarStats() {
        const container = document.getElementById('statsContainer');
        dados.stats.forEach(stat => {
            const div = document.createElement('div');
            div.className = 'stat';
            div.innerHTML = `
                <span class="stat-numero" data-alvo="${stat.numero}">${stat.prefixo || ''}0${stat.sufixo || ''}</span>
                <p>${stat.texto}</p>
            `;
            container.appendChild(div);
        });
        animarContadores();
    }

    function renderizarCards(array, containerId) {
        const container = document.getElementById(containerId);
        array.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `<h3>${item.titulo}</h3><p>${item.desc}</p>`;
            container.appendChild(div);
        });
    }

    function renderizarAmeacas() {
        const container = document.getElementById('ameacasContainer');
        dados.ameacas.forEach(item => {
            const li = document.createElement('li');
            li.dataset.tipo = item.tipo;
            li.innerHTML = `<strong>${item.titulo}:</strong> ${item.desc}`;
            container.appendChild(li);
        });
    }

    function renderizarCuidados() {
        const container = document.getElementById('cuidadosContainer');
        dados.cuidados.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'passo';
            div.innerHTML = `<span>${index + 1}</span><div><h3>${item.titulo}</h3><p>${item.desc}</p></div>`;
            container.appendChild(div);
        });
    }

    // 3. CONTADORES ANIMADOS
    function animarContadores() {
        const contadores = document.querySelectorAll('.stat-numero');
        contadores.forEach(contador => {
            const alvo = +contador.dataset.alvo;
            const prefixo = contador.innerText.replace(/[0-9]/g, '').split(alvo)[0] || '';
            const sufixo = contador.innerText.replace(/[0-9]/g, '').split(alvo)[1] || '';
            let atual = 0;
            const incremento = alvo / 100;

            const atualizar = () => {
                atual += incremento;
                if (atual < alvo) {
                    contador.innerText = `${prefixo}${Math.ceil(atual)}${sufixo}`;
                    requestAnimationFrame(atualizar);
                } else {
                    contador.innerText = `${prefixo}${alvo}${sufixo}`;
                }
            };
            atualizar();
        });
    }

    // 4. FILTRO DE AMEAÇAS
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filtro-btn.ativo').classList.remove('ativo');
            btn.classList.add('ativo');
            const filtro = btn.dataset.filtro;

            document.querySelectorAll('#ameacasContainer li').forEach(li => {
                li.classList.toggle('escondido', filtro!== 'todos' && li.dataset.tipo!== filtro);
            });
        });
    });

    // 5. QUIZ DINÂMICO
    let perguntaAtual = 0;
    let pontuacao = 0;
    const perguntaEl = document.getElementById('pergunta');
    const opcoesEl = document.getElementById('opcoes');
    const feedbackEl = document.getElementById('feedback');
    const proximaBtn = document.getElementById('proximaPergunta');
    const resultadoEl = document.getElementById('resultadoFinal');

    function carregarPergunta() {
        if (perguntaAtual >= dados.quiz.length) {
            document.getElementById('quizContainer').style.display = 'none';
            resultadoEl.textContent = `Você acertou ${pontuacao} de ${dados.quiz.length}! ${pontuacao === dados.quiz.length? 'Você é um protetor das abelhas!' : 'Continue aprendendo para proteger as abelhas.'}`;
            return;
        }

        const q = dados.quiz[perguntaAtual];
        perguntaEl.textContent = q.pergunta;
        opcoesEl.innerHTML = '';
        feedbackEl.textContent = '';
        proximaBtn.style.display = 'none';

        q.opcoes.forEach((opcao, index) => {
            const btn = document.createElement('button');
            btn.textContent = opcao;
            btn.onclick = () => verificarResposta(index);
            opcoesEl.appendChild(btn);
        });
    }

    function verificarResposta(index) {
        const correta = dados.quiz[perguntaAtual].correta;
        if (index === correta) {
            feedbackEl.textContent = 'Correto! 🐝';
            feedbackEl.style.color = 'var(--verde)';
            pontuacao++;
        } else {
            feedbackEl.textContent = 'Errado. A resposta certa é: ' + dados.quiz[perguntaAtual].opcoes[correta];
            feedbackEl.style.color = 'red';
        }
        document.querySelectorAll('#opcoes button').forEach(b => b.disabled = true);
        proximaBtn.style.display = 'inline-block';
    }

    proximaBtn.onclick = () => {
        perguntaAtual++;
        carregarPergunta();
    };

    // 6. MODO ESCURO
    const toggleTheme = document.getElementById('toggleTheme');
    toggleTheme.onclick = () => {
        document.body.classList.toggle('dark');
        toggleTheme.textContent = document.body.classList.contains('dark')? '☀️' : '🌙';
        localStorage.setItem('theme', document.body.classList.contains('dark')? 'dark' : 'light');
    };

    // Carregar tema salvo
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
        toggleTheme.textContent = '☀️';
    }

    // 7. INICIALIZAÇÃO
    renderizarStats();
    renderizarCards(dados.importancia, 'importanciaContainer');
    renderizarAmeacas();
    renderizarCuidados();
    carregarPergunta();
});