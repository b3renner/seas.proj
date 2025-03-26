function enviarEmail() {
    const checkboxes = document.querySelectorAll('input[name="email"]:checked');
    const emails = Array.from(checkboxes).map(checkbox => checkbox.value);
    
    const assunto = encodeURIComponent(document.getElementById('assunto').value);
    const corpo = encodeURIComponent(document.getElementById('corpo').value);
    
    const link = `https://mail.google.com/mail/?view=cm&fs=1&to=${emails.join(',')}&su=${assunto}&body=${corpo}`;
    
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
