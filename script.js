const TURMAS = ['61', '71', '81', '82', '91', '111', '121', '131'];
const DISCIPLINAS = ['Matemática', 'Língua Portuguesa', 'Ciências', 'História', 'Geografia', 'Inglês', 'Educação Física'];
const EXEMPLOS = ['Ana Beatriz Lemos', 'Bruno Henrique Dietrich', 'Camila Schneider', 'Daniel Wolff', 'Eduarda Kappel', 'Felipe Moraes', 'Gabriela Hartmann'];
let ALUNOS = [], modoEdicao = false;

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const valido = v => v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim() !== 'N/A';

function toast(msg, tipo) {
    const t = document.createElement('div');
    t.className = 'toast ' + (tipo || '');
    t.textContent = msg;
    $('toasts').appendChild(t);
    setTimeout(() => t.classList.add('out'), 3200);
    setTimeout(() => t.remove(), 3700);
}

/* ---------- Navegação ---------- */
function mostrar(v) {
    document.querySelectorAll('.view').forEach(e => e.classList.toggle('on', e.id === 'v-' + v));
    document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('on', a.dataset.v === v));
    document.body.dataset.v = v;
    $('side').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Seleção de e-mails ---------- */
const checks = sel => document.querySelectorAll(sel || 'input[name="email"]');
const coluna = c => [...c.closest('tr').cells].indexOf(c.closest('td'));

function marcar(sel, fn) {
    checks(sel).forEach(c => c.checked = fn(c));
    atualizarSel();
}

function atualizarSel() {
    const n = new Set([...checks()].filter(c => c.checked).map(c => c.value)).size;
    $('stSel').textContent = n;
    $('selN').textContent = n + (n === 1 ? ' destinatário selecionado' : ' destinatários selecionados');
    $('selbar').classList.toggle('show', n > 0);
    $('destInfo').textContent = n
        ? n + (n === 1 ? ' destinatário' : ' destinatários') + ' em cópia oculta.'
        : 'Nenhum destinatário selecionado. Escolha na aba Turmas.';
}

function toggleSelectAll(turmaId) {
    const l = [...checks(`#${turmaId} input[name="email"]`)];
    const todos = l.length && l.every(c => c.checked);
    l.forEach(c => c.checked = !todos);
    atualizarSel();
}

function selecionartodos() {
    const l = [...checks()];
    const todos = l.length && l.every(c => c.checked);
    l.forEach(c => c.checked = !todos);
    atualizarSel();
}

const selecionarAlunos = t => marcar(`#${t} input[name="email"]`, c => coluna(c) < 2);
const selecionarResponsaveis = t => marcar(`#${t} input[name="email"]`, c => coluna(c) >= 2);
const todosAlunos = () => marcar(null, c => coluna(c) < 2);
const todosResponsaveis = () => marcar(null, c => coluna(c) >= 2);

/* ---------- E-mail ---------- */
function enviarEmail() {
    const emails = [...new Set([...checks()].filter(c => c.checked && valido(c.value)).map(c => c.value))];
    if (!emails.length) {
        toast('Selecione ao menos um destinatário na aba Turmas.', 'erro');
        return;
    }
    const assunto = encodeURIComponent($('assunto').value);
    const corpo = encodeURIComponent($('corpo').value);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&bcc=${emails.join(',')}&su=${assunto}&body=${corpo}`, '_blank');
}

function clearForm() {
    checks().forEach(c => c.checked = false);
    $('assunto').value = '';
    $('corpo').value = '';
    $('modelos').value = '';
    atualizarSel();
}

function aplicarModelo() {
    const modelos = {
        reuniao: ['Reunião com responsáveis', 'Convidamos os responsáveis para uma reunião que acontecerá no dia [DATA] às [HORÁRIO], na escola.\n\nContamos com a presença de todos!\n\nAtenciosamente,\nCoordenação'],
        falta: ['Aviso de faltas', 'Informamos que o(a) aluno(a) esteve ausente nos últimos dias.\nPedimos que justifiquem a ausência ou entrem em contato com a escola, se necessário.\n\nAtenciosamente,\nCoordenação'],
        evento: ['Convite para evento escolar', 'A escola convida você e sua família para o evento [NOME DO EVENTO], que acontecerá no dia [DATA] às [HORÁRIO].\nSerá um momento especial e contamos com a sua presença!\n\nAbraços,\nEquipe Escolar']
    };
    const [a, c] = modelos[$('modelos').value] || ['', ''];
    $('assunto').value = a;
    $('corpo').value = c;
}

/* ---------- Busca ---------- */
function buscar(rolar) {
    const termo = $('searchInput').value.trim().toLowerCase();
    let n = 0, primeiro = null;
    document.querySelectorAll('#turmas tbody td').forEach(td => {
        const achou = termo && td.textContent.toLowerCase().includes(termo);
        td.classList.toggle('destaque', !!achou);
        if (achou) { n++; primeiro = primeiro || td; }
    });
    $('resultadoContador').textContent = !termo ? '' : n ? `${n} resultado(s)` : 'Nenhum resultado';
    if (rolar && primeiro) primeiro.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ---------- Banco de dados (IndexedDB) ---------- */
function abrirBD(cb) {
    const r = indexedDB.open('EscolaBD', 2);
    r.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('alunos')) {
            db.createObjectStore('alunos', { keyPath: 'matricula' }).createIndex('turma', 'turma', { unique: false });
        }
    };
    r.onsuccess = e => cb(e.target.result);
    r.onerror = e => {
        console.error('Erro ao abrir o banco de dados:', e.target.error);
        toast('Erro ao acessar o banco de dados.', 'erro');
    };
}

function adicionarAluno(aluno) {
    abrirBD(db => {
        const req = db.transaction(['alunos'], 'readwrite').objectStore('alunos').add(aluno);
        req.onsuccess = () => {
            toast('Aluno adicionado com sucesso.');
            limparFormulario(true);
            carregarAlunos();
        };
        req.onerror = () => toast('Matrícula já cadastrada.', 'erro');
    });
}

function atualizarAluno(aluno) {
    abrirBD(db => {
        const req = db.transaction(['alunos'], 'readwrite').objectStore('alunos').put(aluno);
        req.onsuccess = () => {
            toast('Aluno atualizado com sucesso.');
            limparFormulario(true);
            carregarAlunos();
        };
        req.onerror = () => toast('Erro ao atualizar aluno.', 'erro');
    });
}

function editarAluno(matricula) {
    abrirBD(db => {
        const req = db.transaction(['alunos'], 'readonly').objectStore('alunos').get(matricula);
        req.onsuccess = () => {
            const a = req.result;
            if (!a) return toast('Aluno não encontrado.', 'erro');
            $('matricula').value = a.matricula;
            $('turma').value = a.turma;
            $('nomeAluno').value = a.nome;
            $('emailAluno').value = a.email;
            $('responsavel1').value = a.responsavel1;
            $('emailResponsavel1').value = a.emailResponsavel1;
            $('responsavel2').value = valido(a.responsavel2) ? a.responsavel2 : '';
            $('emailResponsavel2').value = valido(a.emailResponsavel2) ? a.emailResponsavel2 : '';
            modoEdicao = true;
            $('matricula').readOnly = true;
            $('add-aluno').textContent = 'Salvar alterações';
            mostrar('cadastro');
        };
    });
}

function removerAluno(matricula) {
    abrirBD(db => {
        const tx = db.transaction(['alunos'], 'readwrite');
        tx.objectStore('alunos').delete(String(matricula));
        tx.oncomplete = () => { toast('Aluno removido.'); carregarAlunos(); };
        tx.onerror = () => toast('Erro ao remover aluno.', 'erro');
    });
}

function confirmarRemocaoAluno(matricula) {
    if (confirm('Tem certeza que deseja remover este aluno?')) removerAluno(matricula);
}

function limparFormulario(silencioso) {
    if (silencioso === true || confirm('Deseja realmente limpar o formulário?')) {
        $('alunoform').reset();
        modoEdicao = false;
        $('matricula').readOnly = false;
        $('add-aluno').textContent = 'Adicionar aluno';
    }
}

function carregarAlunos() {
    abrirBD(db => {
        const lista = [];
        db.transaction(['alunos'], 'readonly').objectStore('alunos').openCursor().onsuccess = e => {
            const c = e.target.result;
            if (c) { lista.push(c.value); c.continue(); }
            else { ALUNOS = lista; desenharTabelas(); }
        };
    });
}

function linha(a) {
    const nome = v => `<td>${valido(v) ? esc(v) : '<span class="nd">Não informado</span>'}</td>`;
    const mail = v => valido(v)
        ? `<td><label class="ck"><input type="checkbox" name="email" value="${esc(v)}"><span>${esc(v)}</span></label></td>`
        : '<td class="nd">Sem e-mail</td>';
    const m = esc(a.matricula);
    return `<tr>${nome(a.nome)}${mail(a.email)}${nome(a.responsavel1)}${mail(a.emailResponsavel1)}${nome(a.responsavel2)}${mail(a.emailResponsavel2)}
        <td class="acts"><button type="button" class="mini" onclick="editarAluno('${m}')">Editar</button><button type="button" class="mini perigo" onclick="confirmarRemocaoAluno('${m}')">Remover</button></td></tr>`;
}

function desenharTabelas() {
    TURMAS.forEach(t => {
        const l = ALUNOS.filter(a => String(a.turma) === t);
        document.querySelector(`#turma${t} tbody`).innerHTML = l.length
            ? l.map(linha).join('')
            : '<tr class="vazio"><td colspan="7">Nenhum aluno cadastrado nesta turma.</td></tr>';
        $('n' + t).textContent = l.length + (l.length === 1 ? ' aluno' : ' alunos');
    });
    const fora = ALUNOS.filter(a => !TURMAS.includes(String(a.turma))).length;
    if (fora) toast(`${fora} aluno(s) com turma fora da lista não aparecem nas tabelas.`, 'erro');
    $('stAlunos').textContent = ALUNOS.length;
    $('dlAlunos').innerHTML = ALUNOS.map(a => `<option value="${esc(a.nome)}">`).join('');
    atualizarSel();
    buscar();
    renderNotas();
}

/* ---------- Importar planilha ---------- */
function importarPlanilha() {
    const arquivo = $('arquivo').files[0];
    if (!arquivo) return toast('Selecione um arquivo primeiro.', 'erro');

    const reader = new FileReader();
    reader.onload = e => {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        const dados = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });

        abrirBD(db => {
            const tx = db.transaction(['alunos'], 'readwrite');
            const store = tx.objectStore('alunos');
            let turmaAtual = '', pular = false;

            dados.forEach(l => {
                if (!l || !l.length || l.every(c => c === undefined || c === '')) return;
                if (typeof l[0] === 'string' && l[0].startsWith('Turma:')) {
                    turmaAtual = l[0].replace('Turma:', '').trim();
                    pular = true;
                    return;
                }
                if (pular) { pular = false; return; }
                if (l.length >= 8 && turmaAtual) {
                    const s = (l[0] === undefined || l[0] === '') ? 1 : 0;
                    store.add({
                        matricula: String(l[0 + s]),
                        nome: l[1 + s],
                        turma: turmaAtual,
                        responsavel1: l[3 + s],
                        emailResponsavel1: l[6 + s],
                        responsavel2: l[4 + s],
                        emailResponsavel2: l[7 + s],
                        email: l[5 + s]
                    });
                }
            });

            tx.oncomplete = () => { toast('Importação concluída.'); $('arquivo').value = ''; carregarAlunos(); };
            tx.onerror = () => toast('Erro na importação. Verifique se há matrículas duplicadas.', 'erro');
        });
    };
    reader.readAsArrayBuffer(arquivo);
}

/* ---------- Notas (visual) ---------- */
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const nota = (k, j) => (45 + hash(k + j) % 55) / 10;

function renderNotas() {
    const t = $('nTurma').value, d = $('nDisc').value, b = document.querySelector('#nBim .on').dataset.b;
    let nomes = ALUNOS.filter(a => String(a.turma) === t).map(a => a.nome);
    const demo = !nomes.length;
    if (demo) nomes = EXEMPLOS;
    $('nBody').innerHTML = nomes.map(n => `<tr><td>${esc(n)}</td>${[0, 1, 2].map(j =>
        `<td><input class="nt" type="number" min="0" max="10" step="0.1" value="${nota(t + d + b + n, j).toFixed(1)}" aria-label="Nota ${j + 1} de ${esc(n)}" oninput="calcNotas()"></td>`).join('')}
        <td class="med"><b></b><i><u></u></i></td><td class="sit"></td></tr>`).join('');
    $('nDemo').hidden = !demo;
    calcNotas();
}

function calcNotas() {
    let soma = 0, n = 0, ok = 0, rec = 0;
    const rotulo = { ok: 'Aprovado', rec: 'Recuperação', risco: 'Em risco' };
    document.querySelectorAll('#nBody tr').forEach(tr => {
        const v = [...tr.querySelectorAll('.nt')].map(i => Math.min(10, Math.max(0, parseFloat(i.value) || 0)));
        const m = v[0] * .4 + v[1] * .4 + v[2] * .2;
        const c = m >= 7 ? 'ok' : m >= 5 ? 'rec' : 'risco';
        tr.querySelector('.med b').textContent = m.toFixed(1);
        tr.querySelector('.med u').style.width = m * 10 + '%';
        tr.querySelector('.med').className = 'med ' + c;
        const s = tr.querySelector('.sit');
        s.textContent = rotulo[c];
        s.className = 'sit ' + c;
        soma += m; n++;
        if (c === 'ok') ok++; else if (c === 'rec') rec++;
    });
    $('nMedia').textContent = n ? (soma / n).toFixed(1) : '-';
    $('nAprov').textContent = ok;
    $('nRec').textContent = rec;
    $('nRisco').textContent = n - ok - rec;
}

function salvarNotas() {
    const b = $('nSalvar');
    b.disabled = true;
    b.textContent = 'Salvando...';
    setTimeout(() => {
        b.disabled = false;
        b.textContent = 'Salvar notas';
        $('nStatus').textContent = 'Última gravação às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        toast(`Notas de ${$('nDisc').value} salvas.`);
    }, 700);
}

/* ---------- Armários (visual) ---------- */
const lock = {};
[102, 106, 107, 111, 114, 119, 122].forEach(n => lock[n] = { fixo: true });
let atual = null;

function desenharArmarios() {
    $('cabGrid').innerHTML = Array.from({ length: 24 }, (_, i) => {
        const n = 101 + i;
        return `<button type="button" class="door ${lock[n] ? 'taken' : 'free'}" data-n="${n}" aria-label="Armário ${n}, ${lock[n] ? 'ocupado' : 'livre'}"><i class="vent"></i><span class="plate">${n}</span><i class="knob"></i></button>`;
    }).join('');
    contarArmarios();
}

function contarArmarios() {
    const o = Object.keys(lock).length;
    $('cOcup').textContent = o;
    $('cLivres').textContent = 24 - o;
}

function pintarArmario(n) {
    const d = document.querySelector(`.door[data-n="${n}"]`);
    const ocupado = !!lock[n];
    d.className = 'door ' + (ocupado ? 'taken' : 'free');
    d.setAttribute('aria-label', `Armário ${n}, ${ocupado ? 'ocupado' : 'livre'}`);
    if (ocupado) {
        d.classList.add('just');
        d.addEventListener('animationend', () => d.classList.remove('just'), { once: true });
    }
    contarArmarios();
}

function abrirArmario(n) {
    atual = n;
    const t = lock[n];
    $('dlgT').textContent = 'Armário ' + n;
    $('dlgS').textContent = !t ? 'Livre. Informe quem vai usar e confirme o aluguel.'
        : t.fixo ? 'Este armário já está ocupado.'
        : `Alugado para ${t.nome} (${t.per.toLowerCase()}).`;
    $('dlgForm').hidden = !!t;
    $('dlgNome').value = '';
    const ok = $('dlgOk');
    ok.hidden = !!(t && t.fixo);
    ok.textContent = t ? 'Liberar armário' : 'Alugar armário';
    ok.classList.toggle('perigo', !!t);
    $('dlg').showModal();
}

function confirmarArmario() {
    if (lock[atual]) {
        delete lock[atual];
        toast(`Armário ${atual} liberado.`);
    } else {
        const nome = $('dlgNome').value.trim();
        if (!nome) { $('dlgNome').focus(); return toast('Informe o nome do aluno.', 'erro'); }
        lock[atual] = { nome, per: $('dlgPer').value };
        toast(`Armário ${atual} alugado para ${nome}.`);
    }
    pintarArmario(atual);
    $('dlg').close();
}

/* ---------- Inicialização ---------- */
document.addEventListener('DOMContentLoaded', () => {
    $('ano').textContent = new Date().getFullYear();

    $('turmas').innerHTML = TURMAS.map(t => `
        <section class="turma" id="turma${t}">
            <div class="th">
                <div><h2>Turma ${t}</h2><span class="badge" id="n${t}">0 alunos</span></div>
                <div class="grp">
                    <button class="tb" type="button" onclick="selecionarAlunos('turma${t}')"><img src="aluno.png" alt="">Alunos</button>
                    <button class="tb" type="button" onclick="toggleSelectAll('turma${t}')"><img src="approve.png" alt="">Todos</button>
                    <button class="tb" type="button" onclick="selecionarResponsaveis('turma${t}')"><img src="pais.png" alt="">Responsáveis</button>
                </div>
            </div>
            <div class="table-container"><table>
                <thead><tr><th>Nome aluno</th><th>E-mail aluno</th><th>Responsável 1</th><th>E-mail resp. 1</th><th>Responsável 2</th><th>E-mail resp. 2</th><th></th></tr></thead>
                <tbody></tbody>
            </table></div>
        </section>`).join('');

    $('chips').innerHTML = TURMAS.map(t => `<a href="#turma${t}">${t}</a>`).join('');
    const opcoes = TURMAS.map(t => `<option value="${t}">${t}</option>`).join('');
    $('turma').innerHTML = opcoes;
    $('nTurma').innerHTML = opcoes;
    $('nDisc').innerHTML = DISCIPLINAS.map(d => `<option>${d}</option>`).join('');

    document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); mostrar(a.dataset.v); }));
    $('toggle-header').addEventListener('click', () => $('side').classList.toggle('open'));
    document.addEventListener('change', e => { if (e.target.name === 'email') atualizarSel(); });

    $('nTurma').onchange = $('nDisc').onchange = renderNotas;
    $('nBim').addEventListener('click', e => {
        if (e.target.tagName !== 'BUTTON') return;
        document.querySelectorAll('#nBim button').forEach(b => b.classList.toggle('on', b === e.target));
        renderNotas();
    });

    $('cabGrid').addEventListener('click', e => {
        const d = e.target.closest('.door');
        if (d) abrirArmario(Number(d.dataset.n));
    });
    $('dlgOk').addEventListener('click', confirmarArmario);
    desenharArmarios();

    $('alunoform').addEventListener('submit', e => {
        e.preventDefault();
        const aluno = {
            matricula: String($('matricula').value),
            turma: $('turma').value,
            nome: $('nomeAluno').value,
            email: $('emailAluno').value,
            responsavel1: $('responsavel1').value,
            emailResponsavel1: $('emailResponsavel1').value,
            responsavel2: $('responsavel2').value || 'N/A',
            emailResponsavel2: $('emailResponsavel2').value || 'N/A'
        };
        modoEdicao ? atualizarAluno(aluno) : adicionarAluno(aluno);
    });

    const inicial = location.hash.slice(1);
    if (['turmas', 'email', 'notas', 'armarios', 'cadastro'].includes(inicial)) mostrar(inicial);
    renderNotas();
    carregarAlunos();
});
