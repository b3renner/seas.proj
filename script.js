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
