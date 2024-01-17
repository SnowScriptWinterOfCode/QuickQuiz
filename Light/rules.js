function openRulesPage() {
    window.location.href = 'rules.html'; 
}

function goHome() {
    window.location.href = 'index.html'; 
}

document.addEventListener('DOMContentLoaded', function () {
    const rulesBtn = document.getElementById('rulesBtn');
    const goHomeBtn = document.getElementById('goHomeBtn'); 

    if (rulesBtn) {
        rulesBtn.addEventListener('click', openRulesPage);
    }

    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', goHome);
    }
});
