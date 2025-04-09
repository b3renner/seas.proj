function enviarEmail() {
    const checkboxes = document.querySelectorAll('input[name="email"]:checked');
    const emails = Array.from(checkboxes).map(checkbox => checkbox.value);

    const assunto = encodeURIComponent(document.getElementById('assunto').value);
    const corpo = encodeURIComponent(document.getElementById('corpo').value);

    const link = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${emails.join(',')}&su=${assunto}&body=${corpo}`;

    window.open(link, '_blank');
}

function toggleSelectAll(turmaId) {
    const checkboxes = document.querySelectorAll(`#${turmaId} input[name="email"]`);
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

    checkboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
    });
}

function selecionartodos() {
    const checkboxes = document.querySelectorAll('input[name="email"]');
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

    checkboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
    });
}

function clearForm() {
    const checkboxes = document.querySelectorAll('input[name="email"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    document.getElementById('assunto').value = '';
    document.getElementById('corpo').value = '';
}

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle-header');
    const menuDesktop = document.querySelector('.menu-desktop');

    toggleButton.addEventListener('click', function() {
        menuDesktop.classList.toggle('active'); 
    });

    const tables = document.querySelectorAll('.table-container');
    const forms = document.querySelectorAll('.form-aluno, .s1');

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function showTables() {
        tables.forEach(table => {
            if (isElementInViewport(table)) {
                table.classList.add('visible');
            }
        });
    }

    function showForms() {
        forms.forEach(form => {
            if (isElementInViewport(form)) {
                form.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', function() {
        showTables();
        showForms();
    });

    // Chamada inicial para verificar se as tabelas ou formulários estão visíveis ao carregar a página
    showTables();
    showForms();

    document.querySelector('.quadrado-direito nav ul li a').addEventListener('click', function(event) {
        event.preventDefault();
        const submenu = document.querySelector('.submenu');
        submenu.style.display = submenu.style.display === 'none' ? 'block' : 'none';
    });
});

function selecionarAlunos(turmaId) {
    const checkboxes = document.querySelectorAll(`#${turmaId} input[name="email"]`);
    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const isAluno = Array.from(row.cells).indexOf(checkbox.closest('td')) < 2;
        checkbox.checked = isAluno;
    });
}

function selecionarResponsaveis(turmaId) {
    const checkboxes = document.querySelectorAll(`#${turmaId} input[name="email"]`);
    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const isResponsavel = Array.from(row.cells).indexOf(checkbox.closest('td')) >= 2;
        checkbox.checked = isResponsavel;
    });
}

function todosAlunos() {
    const checkboxes = document.querySelectorAll('input[name="email"]');
    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const isAluno = Array.from(row.cells).indexOf(checkbox.closest('td')) < 2;
        checkbox.checked = isAluno;
    });
}

function todosResponsaveis() {
    const checkboxes = document.querySelectorAll('input[name="email"]');
    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const isResponsavel = Array.from(row.cells).indexOf(checkbox.closest('td')) >= 2;
        checkbox.checked = isResponsavel;
    });
}

function alternarCampoBusca(event) {
    event.preventDefault();

    let input = document.getElementById("searchInput");
    let botaoBuscar = document.getElementById("botaoBuscar");
    let resultadoContador = document.getElementById("resultadoContador");

    if (input) {
        input.remove();
        botaoBuscar.remove();
        resultadoContador.style.display = "none";
    } else {
        let container = document.querySelector(".pesquisar-button");
        
        input = document.createElement("input");
        input.type = "text";
        input.id = "searchInput";
        input.placeholder = "Digite sua busca...";
        input.style.marginLeft = "10px";
        input.style.height = "18px";
        input.style.width = "150px";
        input.style.border = "1px solid #ccc";
        input.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
        input.style.borderRadius = "5px";
        input.style.padding = "7.5px";
        input.style.marginTop = "15px";
        input.style.marginBotton = "15px";
        
        botaoBuscar = document.createElement("button");
        botaoBuscar.textContent = "🔍︎";
        botaoBuscar.style.fontSize = "1em";
        botaoBuscar.style.border = "1px solid #ccc";
        botaoBuscar.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
        botaoBuscar.style.borderRadius = "5px";
        botaoBuscar.id = "botaoBuscar";
        botaoBuscar.onclick = (e) => buscar(e);
        botaoBuscar.style.marginLeft = "5px";
        botaoBuscar.style.cursor = "pointer";
        botaoBuscar.style.height = "34px";
        botaoBuscar.style.marginTop = "14.5px";
        botaoBuscar.style.paddingBottom = "8px";
        botaoBuscar.style.paddingTop = "3.9px";
        
        container.appendChild(input);
        container.appendChild(botaoBuscar);
        resultadoContador.style.display = "inline";
        resultadoContador.style.fontFamily = "'Nunito', sans-serif";
        resultadoContador.style.fontSize = "0.8em";
    }
}

function buscar(event) {
    event.preventDefault();

    let termo = document.getElementById("searchInput").value.toLowerCase();
    let elementos = document.querySelectorAll("table td, table th");
    let contador = 0;
    let primeiroElemento = null;
    let resultadoContador = document.getElementById("resultadoContador");

    elementos.forEach(el => {
        let texto = el.textContent.toLowerCase();

        if (termo && texto.includes(termo)) {
            el.classList.add("destaque");
            el.classList.remove("oculto");
            contador++;

            if (!primeiroElemento) {
                primeiroElemento = el;
            }
        } else {
            el.classList.remove("destaque");
        }
    });

    let resultadoTexto = (window.innerWidth < 768) 
        ? (contador > 0 ? `🔍︎ ${contador}` : "✖") 
        : (contador > 0 ? `🔍︎ ${contador} resultado(s) encontrado(s).` : "✖ Nenhum resultado encontrado.");

    resultadoContador.textContent = resultadoTexto;
    resultadoContador.style.display = "inline";
    resultadoContador.style.marginTop = "20px";
    resultadoContador.style.marginLeft = "10px";
    resultadoContador.style.marginRight = "10px";
    resultadoContador.style.fontSize = "0.87em";

    if (primeiroElemento) {
        setTimeout(() => {
            primeiroElemento.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
    }
}

// Banco de Dados IndexedDB

const request = indexedDB.open("EscolaBD", 2);

request.onupgradeneeded = function (event) {
    let db = event.target.result;

    if(!db.objectStoreNames.contains("alunos")) {
        let store = db.createObjectStore("alunos", { keyPath: "matricula"});
        store.createIndex("turma", "turma", { unique: false });
    }
};

request.onerror = function (event) {
    console.error("Erro ao abrir o banco de dados:", event.target.error);
}

request.onsuccess = function () {
    console.log("Banco de dados aberto com sucesso");
    carregarAlunos();
};

// Adicionar Alunos e Salvar no BD
let modoEdicao = false;
let matriculaEditando = null;

document.getElementById("alunoform").addEventListener("submit", function (event) {
    event.preventDefault();

    const aluno = {
        matricula: String(document.getElementById("matricula").value),
        turma: document.getElementById("turma").value,
        nome: document.getElementById("nomeAluno").value,
        email: document.getElementById("emailAluno").value,
        responsavel1: document.getElementById("responsavel1").value,
        emailResponsavel1: document.getElementById("emailResponsavel1").value,
        responsavel2: document.getElementById("responsavel2").value || "N/A",
        emailResponsavel2: document.getElementById("emailResponsavel2").value || "N/A",
    };

    if (modoEdicao) {
        atualizarAluno(aluno);
    } else {
        adicionarAluno(aluno);
    }
});

// Função para adicionar/atualizar novo aluno
function adicionarAluno(aluno, mostrarAluno = true) {
    const request = indexedDB.open("EscolaBD", 2);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["alunos"], "readwrite");
        const store = transaction.objectStore("alunos");

        const addRequest = store.add(aluno);
        addRequest.onsuccess = function () {
            if(mostrarAluno) {
                alert("Aluno adicionado com sucesso!");
            }
            document.getElementById("alunoform").reset();
            carregarAlunos();
        };

        addRequest.onerror = function () {
            alert("Erro: matrícula já cadastrada.");
        };
    };

    request.onerror = function (event) {
        console.error("Erro ao abrir o banco de dados:", event.target.error);
        alert("Erro ao adicionar aluno.");
    };
}

function atualizarAluno(aluno) {
    const request = indexedDB.open("EscolaBD", 2);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["alunos"], "readwrite");
        const store = transaction.objectStore("alunos");

        const updateRequest = store.put(aluno);
        updateRequest.onsuccess = function () {
            alert("Aluno atualizado com sucesso!");
            document.getElementById("alunoform").reset();
            modoEdicao = false;
            matriculaEditando = null;
            carregarAlunos();
        };

        updateRequest.onerror = function () {
            alert("Erro ao atualizar aluno.");
        };
    };

    request.onerror = function (event) {
        console.error("Erro ao abrir o banco de dados:", event.target.error);
        alert("Erro ao acessar o banco.");
    };
}

// Carregar Alunos nas tabelas
function carregarAlunos() {
    let request = indexedDB.open("EscolaBD", 2);

    request.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction(["alunos"], "readonly");
        let store = transaction.objectStore("alunos");

        document.querySelectorAll("tbody").forEach(tbody => tbody.innerHTML = "");

        store.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                let aluno = cursor.value;
                let tabela = document.querySelector(`#turma${aluno.turma} tbody`);
                if (!tabela) {
                    alert(`Tabela para turma ${aluno.turma} não encontrada!`);
                    return;
                }

                let linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${aluno.nome}</td>
                    <td>
                        <label>
                            <input type="checkbox" name="email" value="${aluno.email}"></label>
                    </td>
                    <td>${aluno.responsavel1}</td>
                    <td>
                        <label>
                            <input type="checkbox" name="email" value="${aluno.emailResponsavel1}"></label>
                    </td>
                    <td>${aluno.responsavel2}</td>
                    <td>
                        <label>
                            <input type="checkbox" name="email" value="${aluno.emailResponsavel2}"></label>
                    </td>
                    <td>
                        <button type="button" onclick="editarAluno('${aluno.matricula}')">Editar</button>
                        <button type="button" onclick="confirmarRemocaoAluno('${aluno.matricula}')">Remover</button>
                    </td>
                `;

                tabela.appendChild(linha);
                cursor.continue();
            }
        };
    };
}

// Editar Alunos e Remover Alunos
function editarAluno(matricula) {
    const request = indexedDB.open("EscolaBD", 2);

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(["alunos"], "readonly");
        const store = transaction.objectStore("alunos");

        const getRequest = store.get(matricula);

        getRequest.onsuccess = function () {
            const aluno = getRequest.result;

            if (!aluno) {
                alert("Aluno não encontrado!");
                return;
            }

            document.getElementById("matricula").value = aluno.matricula;
            document.getElementById("turma").value = aluno.turma;
            document.getElementById("nomeAluno").value = aluno.nome;
            document.getElementById("emailAluno").value = aluno.email;
            document.getElementById("responsavel1").value = aluno.responsavel1;
            document.getElementById("emailResponsavel1").value = aluno.emailResponsavel1;
            document.getElementById("responsavel2").value = aluno.responsavel2;
            document.getElementById("emailResponsavel2").value = aluno.emailResponsavel2;

            modoEdicao = true;
            matriculaEditando = aluno.matricula;
            document.getElementById("alunoform").scrollIntoView({ behavior: "smooth" });
        };
    };

    request.onerror = function (event) {
        console.error("Erro ao abrir o banco de dados:", event.target.error);
        alert("Erro ao editar aluno.");
    };
}

function removerAluno(matricula) {
    console.log(`Tentando remover aluno com matrícula: ${matricula}`);
    let request = indexedDB.open("EscolaBD", 2);

    request.onsuccess = function (event) {
        let db = event.target.result;
        let transaction = db.transaction(["alunos"], "readwrite");
        let store = transaction.objectStore("alunos");

        let getRequest = store.get(String(matricula));
        
        getRequest.onsuccess = function() {
            if (getRequest.result) {
                console.log(`Aluno encontrado: ${JSON.stringify(getRequest.result)}`);
                let deleteRequest = store.delete(String(matricula));

                deleteRequest.onsuccess = function () {
                    console.log(`Aluno com matrícula ${matricula} removido do banco de dados.`);
                    alert("Aluno removido!");

                    transaction.oncomplete = function () {
                        console.log("Transação concluída. Atualizando tabela...");
                        carregarAlunos(); 
                    };
                };

                deleteRequest.onerror = function (event) {
                    console.error("Erro ao remover aluno:", event.target.error);
                    alert("Erro ao remover aluno.");
                };
            } else {
                console.log(`Aluno com matrícula ${matricula} não encontrado.`);
                alert("Aluno não encontrado.");
            }
        };

        getRequest.onerror = function(event) {
            console.error("Erro ao buscar aluno:", event.target.error);
            alert("Erro ao buscar aluno.");
        };
    };

    request.onerror = function (event) {
        console.error("Erro ao abrir o banco de dados:", event.target.error);
        alert("Erro ao acessar o banco de dados.");
    };
}

function confirmarRemocaoAluno(matricula) {
    const confirmacao = confirm("Tem certeza que deseja remover este aluno?");
    if (confirmacao) {
        removerAluno(matricula);
    }
}

// Importar Planilha
function importarPlanilha() {
    const input = document.getElementById('arquivo');
    const arquivo = input.files[0];

    if (!arquivo) {
        alert("Selecione um arquivo primeiro.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const dados = new Uint8Array(e.target.result);
        const workbook = XLSX.read(dados, { type: 'array' });

        const primeiraPlanilha = workbook.SheetNames[0];
        const planilha = workbook.Sheets[primeiraPlanilha];

        const dadosJson = XLSX.utils.sheet_to_json(planilha, { header: 1 }); 

        console.log("Dados importados:", dadosJson);

        const request = indexedDB.open("EscolaBD", 2);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction(["alunos"], "readwrite");
            const store = transaction.objectStore("alunos");

            let turmaAtual = "";
            let pularProxima = false;

            for (let i = 0; i < dadosJson.length; i++) {
                const linha = dadosJson[i];

                if (!linha || linha.length === 0 || linha.every(cell => cell === undefined || cell === "")) {
                    continue;
                }

                if (typeof linha[0] === 'string' && linha[0].startsWith("Turma:")) {
                    turmaAtual = linha[0].replace("Turma:", "").trim();
                    pularProxima = true;
                    continue;
                }

                if (pularProxima) {
                    pularProxima = false;
                    continue;
                }

                if (linha.length >= 8 && turmaAtual) {
                    let indexShift = (linha[0] === undefined || linha[0] === "") ? 1 : 0;
                
                    const aluno = {
                        matricula: String(linha[0 + indexShift]),
                        nome: linha[1 + indexShift],
                        turma: turmaAtual,
                        responsavel1: linha[3 + indexShift],
                        emailResponsavel1: linha[6 + indexShift],
                        responsavel2: linha[4 + indexShift],
                        emailResponsavel2: linha[7 + indexShift],
                        email: linha[5 + indexShift]
                    };
                
                    console.log("Importando aluno:", aluno);
                    store.add(aluno);
                }
            }

            transaction.oncomplete = function () {
                alert("Importação concluída!");
                carregarAlunos();
            };

            transaction.onerror = function () {
                alert("Erro durante a importação. Verifique se há matrículas duplicadas.");
            };
        };

        request.onerror = function (event) {
            console.error("Erro ao abrir o banco de dados:", event.target.error);
            alert("Erro ao acessar o banco de dados.");
        };
    };

    reader.readAsArrayBuffer(arquivo);
}
