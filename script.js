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
    const checkboxes = document.querySelectorAll(`input[name="email"]`);
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
    const checkboxes = document.querySelectorAll(`[name="email"]`);
    checkboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const isAluno = Array.from(row.cells).indexOf(checkbox.closest('td')) < 2;
        checkbox.checked = isAluno; 
    });
}

function todosResponsaveis() {
    const checkboxes = document.querySelectorAll(`[name="email"]`);
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

        document.getElementById("alunoform").addEventListener("submit", function (event) {
            event.preventDefault();

            let aluno = {
                matricula: String(document.getElementById("matricula").value), 
                turma: document.getElementById("turma").value,
                nome: document.getElementById("nomeAluno").value,
                email: document.getElementById("emailAluno").value,
                responsavel1: document.getElementById("responsavel1").value,
                emailResponsavel1: document.getElementById("emailResponsavel1").value,
                responsavel2: document.getElementById("responsavel2").value || "N/A",
                emailResponsavel2: document.getElementById("emailResponsavel2").value || "N/A",
            };

            let request = indexedDB.open("EscolaBD", 2);

            request.onsuccess = function (event) {
                let db = event.target.result;
                let transaction = db.transaction(["alunos"], "readwrite");
                let store = transaction.objectStore("alunos");
            
                let addrequest = store.add(aluno);
                addrequest.onsuccess = function () {
                    alert("Aluno adicionado com sucesso!");
                    document.getElementById("alunoform").reset();
                };
            
                transaction.oncomplete = function () {
                    carregarAlunos();
                };
            };            
        });

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
                <button onclick="editarAluno(${cursor.key})">Editar</button>
                <button onclick="removerAluno(String(${cursor.key}))">Remover</button>

            </td>
        `;

                        tabela.appendChild(linha);
                        cursor.continue();
                    }
                };
            };
        };

        // Editar Alunos e Remover Alunos

        function editarAluno(matricula) {
            let request = indexedDB.open("EscolaBD", 2);
        
            request.onsuccess = function (event) {
                let db = event.target.result;
                let transaction = db.transaction(["alunos"], "readwrite");
                let store = transaction.objectStore("alunos");
        
                let getRequest = store.get(matricula);
                getRequest.onsuccess = function () {
                    let aluno = getRequest.result;
        
                    document.getElementById("matricula").value = aluno.matricula;
                    document.getElementById("turma").value = aluno.turma;
                    document.getElementById("nomeAluno").value = aluno.nome;
                    document.getElementById("emailAluno").value = aluno.email;
                    document.getElementById("responsavel1").value = aluno.responsavel1;
                    document.getElementById("emailResponsavel1").value = aluno.emailResponsavel1;
                    document.getElementById("responsavel2").value = aluno.responsavel2;
                    document.getElementById("emailResponsavel2").value = aluno.emailResponsavel2;
        
                    let form = document.getElementById("alunoform");
                    form.onsubmit = function (event) {
                        event.preventDefault();
        
                        aluno.turma = document.getElementById("turma").value;
                        aluno.nome = document.getElementById("nomeAluno").value;
                        aluno.email = document.getElementById("emailAluno").value;
                        aluno.responsavel1 = document.getElementById("responsavel1").value;
                        aluno.emailResponsavel1 = document.getElementById("emailResponsavel1").value;
                        aluno.responsavel2 = document.getElementById("responsavel2").value;
                        aluno.emailResponsavel2 = document.getElementById("emailResponsavel2").value;
        
                        let updateRequest = store.put(aluno);
                        updateRequest.onsuccess = function () {
                            alert("Aluno atualizado com sucesso!");
                            form.reset();
                            form.onsubmit = adicionarAluno;
                            carregarAlunos();
                        };
                    };
                };
            };
        }
    
        function removerAluno(matricula) {
            console.log(`Tentando remover aluno com matrícula: ${matricula}`); // Log para verificar a matrícula
            let request = indexedDB.open("EscolaBD", 2);
            
            request.onsuccess = function (event) {
                let db = event.target.result;
                let transaction = db.transaction(["alunos"], "readwrite");
                let store = transaction.objectStore("alunos");
            
                let getRequest = store.get(String(matricula));
                
                getRequest.onsuccess = function() {
                    if (getRequest.result) {
                        console.log(`Aluno encontrado: ${JSON.stringify(getRequest.result)}`); // Log para verificar o aluno encontrado
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
