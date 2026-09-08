const API_BASE_URL = 'http://127.0.0.1:5000/api';

const recursos = {
    piloto: { endpoint: '/pilotos-destaque', label: 'piloto', recarregar: carregarPilotos, campos: [['rank', 'Posição', 'number', true], ['nome', 'Nome', 'text', true], ['sobrenome', 'Sobrenome', 'text', true], ['equipe', 'Equipe', 'text', true], ['pts', 'Pontos', 'text', true], ['img', 'URL da imagem', 'url', true]] },
    ranking: { endpoint: '/ranking', label: 'item do ranking', recarregar: carregarRanking, campos: [['rank', 'Posição', 'number', true], ['nome', 'Nome completo', 'text', true], ['equipe', 'Equipe', 'text', true], ['icon', 'Ícone', 'text', true], ['pts', 'Pontos', 'text', true]] },
    equipe: { endpoint: '/equipes', label: 'equipe', recarregar: carregarEquipes, campos: [['nome', 'Nome', 'text', true], ['sub', 'Complemento', 'text', false], ['pos', 'Posição no ranking', 'text', true]] },
    noticia: { endpoint: '/noticias', label: 'notícia', recarregar: carregarNoticias, campos: [['titulo', 'Título', 'text', true], ['resumo', 'Resumo', 'text', true], ['tempo', 'Quando foi publicada', 'text', true], ['img', 'URL da imagem', 'url', true]] }
};

function escaparHTML(valor = '') {
    return String(valor).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[c]));
}

async function requisitarAPI(endpoint, opcoes = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers: { 'Content-Type': 'application/json' }, ...opcoes });
    const json = await response.json().catch(() => ({}));
    if (!response.ok || !json.success) throw new Error(json.detail || 'Não foi possível concluir a operação.');
    return json;
}

async function fetchAPI(endpoint) {
    try { return (await requisitarAPI(endpoint)).data; }
    catch (error) { console.error(`Erro no endpoint ${endpoint}:`, error); return null; }
}

function botaoExcluir(recurso, id) {
    return `<button class="btn-delete" type="button" data-delete-resource="${recurso}" data-delete-id="${id}" aria-label="Excluir">Excluir</button>`;
}

async function carregarPilotos(filtro = '') {
    const container = document.getElementById('container-pilotos');
    if (!container) return;
    let pilotos = await fetchAPI('/pilotos-destaque');
    if (pilotos && pilotos.length) {
        if (filtro) pilotos = pilotos.filter(p => `${p.nome} ${p.sobrenome} ${p.equipe}`.toLowerCase().includes(filtro.toLowerCase()));
        container.innerHTML = pilotos.length ? pilotos.map(p => `<div class="driver-card"><span class="rank-badge rank-${p.rank}">${p.rank}</span><div class="driver-img-box"><img src="${escaparHTML(p.img)}" alt="${escaparHTML(`${p.nome} ${p.sobrenome}`)}" onerror="this.src='https://media.formula1.com/d_driver_fallback_image.png'"></div><div class="driver-card-info"><h3 class="driver-name">${escaparHTML(p.nome)} <span>${escaparHTML(p.sobrenome)}</span></h3><span class="driver-team">${escaparHTML(p.equipe)}</span><div class="driver-pts">${escaparHTML(p.pts)}</div></div>${botaoExcluir('piloto', p.id)}</div>`).join('') : '<p class="api-error">Nenhum piloto encontrado para essa busca.</p>';
    } else container.innerHTML = '<p class="api-error">Não foi possível carregar os pilotos.</p>';
}

async function carregarRanking() {
    const container = document.getElementById('container-ranking');
    if (!container) return;
    const ranking = await fetchAPI('/ranking');
    container.innerHTML = ranking?.length ? ranking.map(r => `<div class="ranking-item"><span class="rank-num">${r.rank}</span><div class="rank-driver-details"><strong class="driver-full-name">${escaparHTML(r.nome)}</strong><span class="driver-team-sub">${escaparHTML(r.equipe)}</span></div><span class="team-mini-icon">${escaparHTML(r.icon || '🏎️')}</span><span class="rank-score">${escaparHTML(r.pts)} PTS</span>${botaoExcluir('ranking', r.id)}</div>`).join('') : '<p class="api-error">Erro ao carregar o ranking.</p>';
}

async function carregarEquipes() {
    const container = document.getElementById('container-equipes');
    if (!container) return;
    const equipes = await fetchAPI('/equipes');
    container.innerHTML = equipes?.length ? equipes.map(e => `<div class="team-box"><div class="team-logo-title">${escaparHTML(e.nome)} ${e.sub ? `<span>${escaparHTML(e.sub)}</span>` : ''}</div><span class="team-rank">${escaparHTML(e.pos)}</span>${botaoExcluir('equipe', e.id)}</div>`).join('') : '<p class="api-error">Erro ao carregar equipes.</p>';
}

async function carregarNoticias() {
    const container = document.getElementById('container-noticias');
    if (!container) return;
    const noticia = await fetchAPI('/noticias');
    container.innerHTML = noticia?.titulo ? `<div class="news-item"><div class="news-thumb"><img src="${escaparHTML(noticia.img)}" alt="${escaparHTML(noticia.titulo)}"></div><div class="news-info"><h3>${escaparHTML(noticia.titulo)}</h3><p>${escaparHTML(noticia.resumo)}</p><span class="news-time">${escaparHTML(noticia.tempo)}</span></div>${botaoExcluir('noticia', noticia.id)}</div>` : '<p class="api-error">Não foi possível carregar notícias.</p>';
}

function inicializarBusca() {
    const form = document.getElementById('form-busca'), input = document.getElementById('input-busca');
    if (!form || !input) return;
    input.addEventListener('input', e => carregarPilotos(e.target.value.trim()));
    form.addEventListener('submit', e => { e.preventDefault(); carregarPilotos(input.value.trim()); document.getElementById('pilotos')?.scrollIntoView({ behavior: 'smooth' }); });
}

function renderizarCamposFormulario() {
    const recurso = recursos[document.getElementById('api-recurso').value];
    document.getElementById('api-fields').innerHTML = recurso.campos.map(([nome, rotulo, tipo, obrigatorio]) => `<label>${rotulo}<input name="${nome}" type="${tipo}" ${obrigatorio ? 'required' : ''} ${nome === 'rank' ? 'min="1"' : ''}></label>`).join('');
}

function mostrarStatus(mensagem, erro = false) {
    const status = document.getElementById('api-status');
    status.textContent = mensagem;
    status.className = `api-status ${erro ? 'is-error' : 'is-success'}`;
}

function inicializarGerenciador() {
    const select = document.getElementById('api-recurso'), form = document.getElementById('form-api');
    if (!select || !form) return;
    renderizarCamposFormulario();
    select.addEventListener('change', renderizarCamposFormulario);
    form.addEventListener('submit', async e => {
        e.preventDefault(); const recurso = recursos[select.value], dados = Object.fromEntries(new FormData(form));
        if (dados.rank) dados.rank = Number(dados.rank);
        try { await requisitarAPI(recurso.endpoint, { method: 'POST', body: JSON.stringify(dados) }); form.reset(); renderizarCamposFormulario(); await recurso.recarregar(); mostrarStatus(`${recurso.label[0].toUpperCase() + recurso.label.slice(1)} adicionado(a) com sucesso.`); }
        catch (error) { mostrarStatus(error.message, true); }
    });
    document.addEventListener('click', async e => {
        const botao = e.target.closest('[data-delete-resource]');
        if (!botao) return;
        const recurso = recursos[botao.dataset.deleteResource];
        if (!confirm(`Excluir este(a) ${recurso.label}?`)) return;
        try { await requisitarAPI(`${recurso.endpoint}/${botao.dataset.deleteId}`, { method: 'DELETE' }); await recurso.recarregar(); mostrarStatus(`${recurso.label[0].toUpperCase() + recurso.label.slice(1)} removido(a) com sucesso.`); }
        catch (error) { mostrarStatus(error.message, true); }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([carregarPilotos(), carregarRanking(), carregarEquipes(), carregarNoticias()]);
    inicializarBusca(); inicializarGerenciador();
    if (window.lucide) lucide.createIcons();
});
