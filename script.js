
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
        let container = document.querySelector(".button-container");
        
        input = document.createElement("input");
        input.type = "text";
        input.id = "searchInput";
        input.placeholder = "Digite sua busca...";
        input.style.marginLeft = "10px";
        
        botaoBuscar = document.createElement("button");
        botaoBuscar.textContent = "🔍";
        botaoBuscar.id = "botaoBuscar";
        botaoBuscar.onclick = (e) => buscar(e);
        botaoBuscar.style.marginLeft = "5px";
        
        container.appendChild(input);
        container.appendChild(botaoBuscar);
        resultadoContador.style.display = "inline";
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

    let resultadoTexto = contador > 0 
        ? `🔍 ${contador} resultado(s) encontrado(s).` 
        : "❌ Nenhum resultado encontrado.";
    resultadoContador.textContent = resultadoTexto;
    resultadoContador.style.display = "inline";

    if (primeiroElemento) {
        setTimeout(() => {
            primeiroElemento.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
    }
}
