document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if(confirm('Deseja realmente sair?')) {
            window.location.href = "../index.html";
        }
    });
    const cards = document.querySelectorAll('.order-card, .action-btn');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});