document.getElementById('startBtn').onclick = () => {
    // 1. Login status save karo
    localStorage.setItem('vv_logged_in', 'true');
    
    // 2. Seedha Dashboard file par bhej do
    window.location.href = 'dashboard.html';
};

// Auto-login logic
window.onload = () => {
    if (localStorage.getItem('vv_logged_in') === 'true') {
        window.location.href = 'dashboard.html';
    }
};