// 1. UNIVERSAL STYLES
const universalStyles = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;700;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
    html, body { width: 100vw; height: 100vh; overflow: hidden !important; position: fixed; font-family: 'Kanit', sans-serif; background: #020617; color: white; }
    ::-webkit-scrollbar { display: none !important; }
    .content { flex: 1; overflow-y: auto !important; padding: 20px; padding-bottom: 100px; -webkit-overflow-scrolling: touch; }
    
    .header-bar { padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.8); height: 65px; border-bottom: 1px solid #1e293b; width: 100%; }
    .bottom-nav { position: fixed; bottom: 0; width: 100%; max-width: 480px; background: #0f172a; display: flex; justify-content: space-around; padding: 12px 0; border-top: 1px solid #1e293b; z-index: 1000; }
    .nav-item { color: #64748b; text-decoration: none; font-size: 0.7rem; text-align: center; font-weight: 700; flex: 1; }
    .nav-item.active { color: #fbbf24; }
    .nav-item span { font-size: 1.3rem; display: block; margin-bottom: 2px; }

    /* MODALS */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); display: none; justify-content: center; align-items: center; z-index: 9999; }
    .settings-modal { background: #1e293b; width: 88%; max-width: 360px; border-radius: 30px; padding: 30px; border: 1px solid rgba(255,255,255,0.1); text-align:center; }
    
    /* TOGGLE SWITCH */
    .st-row { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .switch { position: relative; display: inline-block; width: 45px; height: 24px; }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #334155; transition: .4s; border-radius: 34px; }
    .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
    input:checked + .slider { background-color: #fbbf24; }
    input:checked + .slider:before { transform: translateX(21px); }

    .btn-feedback { width: 100%; margin-top: 20px; padding: 12px; background: rgba(251, 191, 36, 0.1); color: #fbbf24; border: 1px dashed #fbbf24; border-radius: 12px; font-weight: 700; cursor: pointer; font-family: 'Kanit'; }
    .btn-done { width: 100%; margin-top: 15px; padding: 15px; background: #fbbf24; color: #000; border: none; border-radius: 15px; font-weight: 900; cursor: pointer; font-family: 'Kanit'; }
</style>
`;

// 2. SHARED UI HTML
const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";

const sharedUI = `
    <header class="header-bar">
        <div style="color:#fbbf24; font-weight:900; letter-spacing:2px; font-size:1.2rem;">VIRTUAL VENTURES</div>
        <button onclick="toggleSettings(true)" style="background:none; border:none; font-size:1.5rem; color:#94a3b8; cursor:pointer;">⚙️</button>
    </header>

    <div id="settingsModal" class="modal-overlay">
        <div class="settings-modal">
            <h2 style="color:#fbbf24; margin-bottom:5px; font-weight:900;">SETTINGS</h2>
            <p style="font-size:0.7rem; color:#94a3b8; margin-bottom:15px;">VIRTUAL ECONOMY, REAL FUN</p>
            <div class="st-row"><span>Music</span><label class="switch"><input type="checkbox" id="mToggle"><span class="slider"></span></label></div>
            <div class="st-row"><span>Sound FX</span><label class="switch"><input type="checkbox" checked id="sToggle"><span class="slider"></span></label></div>
            <div class="st-row"><span>Vibration</span><label class="switch"><input type="checkbox" checked id="vToggle"><span class="slider"></span></label></div>
            <button class="btn-feedback" onclick="window.open('https://forms.google.com', '_blank')">📩 SEND FEEDBACK</button>
            <button class="btn-done" onclick="toggleSettings(false)">SAVE & CLOSE</button>
        </div>
    </div>

    <div id="offlineModal" class="modal-overlay">
        <div class="settings-modal">
            <h2 style="color:#fbbf24; font-weight:900;">WELCOME BACK!</h2>
            <p style="margin: 15px 0; color:#94a3b8;">Your businesses earned while you were away:</p>
            <h1 id="offlineAmount" style="font-size:2.5rem; color:#fff; margin-bottom:20px;">🟡 0</h1>
            <button class="btn-done" onclick="closeOffline()">COLLECT CASH</button>
        </div>
    </div>

    <nav class="bottom-nav">
        <a href="dashboard.html" class="nav-item ${currentPage === 'dashboard.html' ? 'active' : ''}"><span>🏠</span>HOME</a>
        <a href="business.html" class="nav-item ${currentPage === 'business.html' ? 'active' : ''}"><span>💼</span>BIZ</a>
        <a href="market.html" class="nav-item ${currentPage === 'market.html' ? 'active' : ''}"><span>📈</span>INVEST</a>
        <a href="rank.html" class="nav-item ${currentPage === 'rank.html' ? 'active' : ''}"><span>🏆</span>RANK</a>
        <a href="profile.html" class="nav-item ${currentPage === 'profile.html' ? 'active' : ''}"><span>👤</span>PROFILE</a>
    </nav>
`;

document.head.insertAdjacentHTML('beforeend', universalStyles);
document.body.insertAdjacentHTML('afterbegin', sharedUI);

// 3. CORE ECONOMY ENGINE
function getGameData() {
    let coins = Number(localStorage.getItem('vv_coins')) || 0;
    let biz = JSON.parse(localStorage.getItem('vv_biz')) || [];
    let portfolio = JSON.parse(localStorage.getItem('vv_portfolio')) || {};
    
    let hourlyIncome = 0;
    biz.forEach(b => hourlyIncome += (b.count * b.income));
    
    return { coins, hourlyIncome, portfolio };
}

// 4. ACHIEVEMENT LOGIC
function checkAchievements() {
    const { coins, portfolio } = getGameData();
    let totalTax = Number(localStorage.getItem('vv_total_tax')) || 0;
    let unlocked = JSON.parse(localStorage.getItem('vv_ach_unlocked')) || [];

    const criteria = [
        { id: 1, name: "Investor", check: Object.keys(portfolio).length > 0 },
        { id: 2, name: "Tax Payer", check: totalTax > 1000 },
        { id: 8, name: "Millionaire", check: coins >= 1000000 },
        { id: 10, name: "Crypto King", check: (portfolio['c1'] || 0) > 0 }
    ];

    criteria.forEach(ach => {
        if (ach.check && !unlocked.includes(ach.id)) {
            unlocked.push(ach.id);
            console.log("Achievement Unlocked: " + ach.name);
        }
    });
    localStorage.setItem('vv_ach_unlocked', JSON.stringify(unlocked));
}

// 5. MAIN HEARTBEAT (Runs every 1 second)
setInterval(() => {
    const { coins, hourlyIncome, portfolio } = getGameData();
    
    // Calculate Deductions (Tax & Bills)
    let bills = 500; 
    if (Object.keys(portfolio).length > 5) bills += 2000;
    let taxAmount = hourlyIncome * 0.15;
    
    // Net Income Per Second (Income - Expenses)
    let netIncomePerSec = (hourlyIncome - taxAmount - bills) / 3600;
    
    let newBal = coins + netIncomePerSec;
    localStorage.setItem('vv_coins', newBal);
    localStorage.setItem('vv_last_time', Date.now());

    // Update Tax Stats
    let totalTaxPaid = Number(localStorage.getItem('vv_total_tax')) || 0;
    localStorage.setItem('vv_total_tax', totalTaxPaid + (taxAmount / 3600));

    // Update UI if element exists
    const disp = document.getElementById('coinCount');
    if (disp) disp.innerText = Math.floor(newBal).toLocaleString();

    checkAchievements();
}, 1000);

// Offline Income Logic
window.addEventListener('load', () => {
    const { coins, hourlyIncome } = getGameData();
    const lastTime = localStorage.getItem('vv_last_time');
    const now = Date.now();

    if (lastTime && hourlyIncome > 0) {
        const seconds = Math.floor((now - lastTime) / 1000);
        if (seconds > 30) {
            const earned = Math.floor(seconds * (hourlyIncome / 3600));
            document.getElementById('offlineAmount').innerText = "🟡 " + earned.toLocaleString();
            document.getElementById('offlineModal').style.display = 'flex';
            localStorage.setItem('vv_coins', coins + earned);
        }
    }
});

window.toggleSettings = (show) => document.getElementById('settingsModal').style.display = show ? 'flex' : 'none';
window.closeOffline = () => document.getElementById('offlineModal').style.display = 'none';