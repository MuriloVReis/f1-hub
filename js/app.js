const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Funçao auxiliar para consumir a API
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('Falha ao conectar com o servidor');
        const json = await response.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error(`Erro no endpoint ${endpoint}:`, error);
        return null;
    }
}

// 1. Pilotos em Destaque + Filtro de Busca
async function carregarPilotos(filtro = '') {
    const container = document.getElementById('container-pilotos');
    if (!container) return;

    let pilotos = await fetchAPI('/pilotos-destaque');

    if (pilotos && pilotos.length > 0) {
        // Aplica o filtro da busca se o usuário digitou algo
        if (filtro) {
            pilotos = pilotos.filter(p => 
                `${p.nome} ${p.sobrenome} ${p.equipe}`.toLowerCase().includes(filtro.toLowerCase())
            );
        }

        if (pilotos.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); padding: 1rem;">Nenhum piloto encontrado para essa busca.</p>';
            return;
        }

        container.innerHTML = pilotos.map(p => `
            <div class="driver-card">
                <span class="rank-badge rank-${p.rank}">${p.rank}</span>
                <div class="driver-img-box">
                    <img src="${p.img}" alt="${p.nome} ${p.sobrenome}" onerror="this.src='https://media.formula1.com/d_driver_fallback_image.png'">
                </div>
                <div class="driver-card-info">
                    <h3 class="driver-name">${p.nome} <span>${p.sobrenome}</span></h3>
                    <span class="driver-team">${p.equipe}</span>
                    <div class="driver-pts">${p.pts}</div>
                </div>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="api-error">Não foi possível carregar os pilotos.</p>';
    }
}

// 2. Ranking de Pilotos
async function carregarRanking() {
    const container = document.getElementById('container-ranking');
    if (!container) return;

    const ranking = await fetchAPI('/ranking');

    if (ranking && ranking.length > 0) {
        container.innerHTML = ranking.map(r => `
            <div class="ranking-item">
                <span class="rank-num">${r.rank}</span>
                <div class="rank-driver-details">
                    <strong class="driver-full-name">${r.nome}</strong>
                    <span class="driver-team-sub">${r.equipe}</span>
                </div>
                <span class="team-mini-icon">${r.icon || '🏎️'}</span>
                <span class="rank-score">${r.pts} PTS</span>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="api-error">Erro ao carregar o ranking.</p>';
    }
}

// 3. Equipes
async function carregarEquipes() {
    const container = document.getElementById('container-equipes');
    if (!container) return;

    const equipes = await fetchAPI('/equipes');

    if (equipes && equipes.length > 0) {
        container.innerHTML = equipes.map(e => `
            <div class="team-box">
                <div class="team-logo-title">${e.nome} ${e.sub ? `<span>${e.sub}</span>` : ''}</div>
                <span class="team-rank">${e.pos}</span>
            </div>
        `).join('');
    } else {
        container.innerHTML = '<p class="api-error">Erro ao carregar equipes.</p>';
    }
}

// 4. Últimas Notícias
async function carregarNoticias() {
    const container = document.getElementById('container-noticias');
    if (!container) return;

    const noticia = await fetchAPI('/noticias');

    if (noticia && noticia.titulo) {
        container.innerHTML = `
            <div class="news-item">
                <div class="news-thumb">
                    <img src="${noticia.img}" alt="${noticia.titulo}">
                </div>
                <div class="news-info">
                    <h3>${noticia.titulo}</h3>
                    <p>${noticia.resumo}</p>
                    <span class="news-time">${noticia.tempo}</span>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = '<p class="api-error">Erro ao carregar notícias.</p>';
    }
}

// 5. Integração do Campo de Pesquisa
function inicializarBusca() {
    const formBusca = document.getElementById('form-busca');
    const inputBusca = document.getElementById('input-busca');

    if (!formBusca || !inputBusca) return;

    // Filtra em tempo real ao digitar
    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.trim();
        carregarPilotos(termo);
    });

    // Submissão do formulário com rolagem até os cards
    formBusca.addEventListener('submit', (e) => {
        e.preventDefault();
        const termo = inputBusca.value.trim();
        carregarPilotos(termo);

        const secaoPilotos = document.getElementById('pilotos');
        if (secaoPilotos) {
            secaoPilotos.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Inicialização no carregamento da página
document.addEventListener('DOMContentLoaded', async () => {
    // Carrega todos os endpoints em paralelo
    await Promise.all([
        carregarPilotos(),
        carregarRanking(),
        carregarEquipes(),
        carregarNoticias()
    ]);

    inicializarBusca();

    // Atualiza os ícones do Lucide após inserir novos elementos no DOM
    if (window.lucide) {
        lucide.createIcons();
    }
});