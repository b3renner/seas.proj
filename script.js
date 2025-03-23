function enviarEmail() {
    const checkboxes = document.querySelectorAll('input[name="email"]:checked');
    const emails = Array.from(checkboxes).map(checkbox => checkbox.value);
    
    const assunto = encodeURIComponent(document.getElementById('assunto').value);
    const corpo = encodeURIComponent(document.getElementById('corpo').value);
    
    const link = `https://mail.google.com/mail/?view=cm&fs=1&to=${emails.join(',')}&su=${assunto}&body=${corpo}`;
    
    window.open(link, '_blank');
}