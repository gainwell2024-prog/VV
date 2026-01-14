// 1. UNIVERSAL STYLES (same as before)
const universalStyles = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;700;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
    html, body { width: 100vw; height: 100vh; overflow: hidden !important; position: fixed; font-family: 'Kanit', sans-serif; background: #020617; color: white; }
    ::-webkit-scrollbar { display: none !important; }
    
    .header-bar { padding: 0 20px; display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.9); height: 60px; border-bottom: 2px solid #fbbf24; width: 100%; position: fixed; top:0; z-index: 100; }
    .game-logo-text { font-weight: 900; font-size: 1.2rem; letter-spacing: 1px; color: #fbbf24; font-style: italic; }
    
    .bottom-nav { position: fixed; bottom: 0; width: 100%; background: #0f172a; display: flex; justify-content: space-around; padding: 12px 0; border-top: 2px solid #1e293b; z-index: 100; }
    .nav-item { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: #64748b; font-size: 0.65rem; gap: 4px; transition: 0.3s; font-weight: bold; }
    .nav-item.active { color: #fbbf24; }
    .nav-item i { font-size: 1.1rem; }

    #settingsModal { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: none; align-items: center; justify-content: center; z-index: 2000; }
    .set-card { background: #1e293b; width: 85%; max-width: 320px; border-radius: 30px; border: 1px solid #fbbf24; padding: 25px; box-shadow: 0 0 30px rgba(251, 191, 36, 0.2); }
    .set-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .toggle { width: 45px; height: 24px; background: #334155; border-radius: 50px; position: relative; cursor: pointer; }
    .toggle.on { background: #fbbf24; }
    .toggle::after { content: ''; position: absolute; width: 18px; height: 18px; background: white; border-radius: 50%; top: 3px; left: 3px; transition: 0.3s; }
    .toggle.on::after { left: 24px; }
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
`;

document.head.insertAdjacentHTML('beforeend', universalStyles);

// 2. UNIVERSAL NUMBER FORMATTER (unchanged)
window.formatBalance = function(num) {
    if (num === null || num === undefined || isNaN(num)) return "0";
    let negative = num < 0;
    let absNum = Math.abs(num);
    
    let formatted = "";
    if (absNum < 1000) {
        formatted = Math.floor(absNum).toString();
    } else {
        const suffixes = ["", "k", "M", "B", "T", "Q"];
        const suffixNum = Math.floor(("" + Math.floor(absNum)).length / 3);
        let shortValue = parseFloat((suffixNum != 0 ? (absNum / Math.pow(1000, suffixNum)) : absNum).toPrecision(3));
        if (shortValue % 1 != 0) shortValue = shortValue.toFixed(2);
        formatted = shortValue + suffixes[suffixNum];
    }
    return (negative ? "-" : "") + formatted;
};

// 3. AUDIO & UI INJECTION (footer updated here)
const audio = { bg: new Audio('bg-music.mp3'), tap: new Audio('tap.mp3') };
audio.bg.loop = true;

window.playSound = (type) => {
    if (localStorage.getItem('vv_sound') !== 'off') {
        if(type === 'tap') { audio.tap.currentTime = 0; audio.tap.play().catch(()=>{}); }
    }
}

function injectUI() {
    const header = `<div class="header-bar"><div class="game-logo-text">VIRTUAL VENTURES</div><i class="fas fa-cog" onclick="openSettings()" style="color:#fbbf24; font-size:1.3rem; cursor:pointer"></i></div>`;
    const footer = `<div class="bottom-nav">
        <a href="dashboard.html" class="nav-item ${window.location.href.includes('dashboard')?'active':''}">
            <i class="fas fa-hand-pointer"></i><span>WORK</span></a>
        <a href="business.html" class="nav-item ${window.location.href.includes('business')?'active':''}">
            <i class="fas fa-briefcase"></i><span>EMPIRE</span></a>
        <a href="market.html" class="nav-item ${window.location.href.includes('market')?'active':''}">
            <i class="fas fa-chart-line"></i><span>INVEST</span></a>
        <a href="#" class="nav-item" onclick="alert('Events Coming Soon! 🔥'); return false;">
            <i class="fas fa-calendar-alt"></i><span>EVENT</span></a>
        <a href="profile.html" class="nav-item ${window.location.href.includes('profile')?'active':''}">
            <i class="fas fa-user-circle"></i><span>PROFILE</span></a>
    </div>`;

    document.body.insertAdjacentHTML('afterbegin', header);
    document.body.insertAdjacentHTML('beforeend', footer + `
        <div id="settingsModal"><div class="set-card">
            <h3 style="text-align:center; margin-bottom:20px; letter-spacing:2px">SETTINGS</h3>
            <div class="set-row"><span>Music</span><div id="musicToggle" class="toggle" onclick="toggleMusic()"></div></div>
            <div class="set-row"><span>SFX</span><div id="soundToggle" class="toggle" onclick="toggleSFX()"></div></div>
            <button onclick="closeSettings()" style="width:100%; background:#fbbf24; border:none; padding:12px; border-radius:15px; font-weight:900; margin-top:10px">SAVE</button>
        </div></div>
    `);
}

window.openSettings = () => { document.getElementById('settingsModal').style.display = 'flex'; renderSettings(); };
window.closeSettings = () => { document.getElementById('settingsModal').style.display = 'none'; };
window.toggleMusic = () => {
    let m = localStorage.getItem('vv_music') === 'off' ? 'on' : 'off';
    localStorage.setItem('vv_music', m);
    if(m === 'on') audio.bg.play().catch(()=>{}); else audio.bg.pause();
    renderSettings();
};
window.toggleSFX = () => { localStorage.setItem('vv_sound', localStorage.getItem('vv_sound') === 'off' ? 'on' : 'off'); renderSettings(); };
function renderSettings() {
    document.getElementById('musicToggle').className = `toggle ${localStorage.getItem('vv_music')!=='off'?'on':''}`;
    document.getElementById('soundToggle').className = `toggle ${localStorage.getItem('vv_sound')!=='off'?'on':''}`;
}
injectUI();

// 4. FINANCE ENGINE (unchanged)
function processFinances() {
    const lastCheck = localStorage.getItem('vv_last_finance_check');
    const now = Date.now();
    
    const myBiz = JSON.parse(localStorage.getItem('vv_biz')) || [];
    const hourlyIncome = myBiz.reduce((total, biz) => {
        const income = biz.income || 0;
        const levelBonus = biz.count > 1 ? (income * 0.25 * (biz.count - 1)) : 0;
        return total + (biz.count * (income + levelBonus));
    }, 0);
    
    const dietCost = Number(localStorage.getItem('vv_diet_cost')) || 10;
    const liveCost = Number(localStorage.getItem('vv_live_cost')) || 20;
    const transCost = Number(localStorage.getItem('vv_trans_cost')) || 0;
    const totalHourlyExpense = dietCost + liveCost + transCost;

    let taxRate = hourlyIncome > 1000000000 ? 0.20 : (hourlyIncome > 1000000 ? 0.10 : 0);
    const hourlyTax = hourlyIncome * taxRate;
    const netHourly = hourlyIncome - totalHourlyExpense - hourlyTax;

    if (lastCheck) {
        const secondsPassed = Math.floor((now - Number(lastCheck)) / 1000);
        if (secondsPassed > 0) {
            const netEarned = (netHourly / 3600) * secondsPassed;
            let currentBalance = Number(localStorage.getItem('vv_balance')) || 0;
            localStorage.setItem('vv_balance', currentBalance + netEarned);

            if (secondsPassed > 300) showFinancePopup(netEarned, secondsPassed);
        }
    }
    localStorage.setItem('vv_last_finance_check', now);
}

function showFinancePopup(amount, seconds) {
    const isLoss = amount < 0;
    const popupHtml = `
    <div id="financeModal" style="position:fixed; inset:0; background:rgba(2,6,23,0.95); backdrop-filter:blur(15px); display:flex; align-items:center; justify-content:center; z-index:9999; padding:20px;">
        <div style="background:rgba(15,23,42,0.95); width:100%; max-width:320px; border-radius:30px; border:2px solid ${isLoss ? '#ef4444' : '#fbbf24'}; padding:30px; text-align:center;">
            <div style="font-size:3rem; margin-bottom:10px;">${isLoss ? '📉' : '📈'}</div>
            <h2 style="font-weight:900; color:#fff;">FINANCIAL REPORT</h2>
            <p style="font-size:0.75rem; color:#94a3b8; margin-bottom:15px;">Report for last ${(seconds/3600).toFixed(1)} hours</p>
            <div style="background:rgba(255,255,255,0.05); border-radius:15px; padding:15px; margin-bottom:20px;">
                <span style="color:${isLoss ? '#ef4444' : '#4ade80'}; font-size:1.8rem; font-weight:900;">${window.formatBalance(amount)}</span>
                <p style="font-size:0.6rem; color:#64748b; margin-top:5px;">(Net Profit/Loss)</p>
            </div>
            <button onclick="document.getElementById('financeModal').remove()" style="width:100%; background:#fbbf24; color:#020617; border:none; padding:15px; border-radius:15px; font-weight:900;">COLLECT</button>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

// 5. ENERGY ENGINE (unchanged)
function syncEnergy() {
    const lastCheck = localStorage.getItem('vv_last_energy_check');
    const now = Date.now();
    if (lastCheck) {
        const secondsPassed = Math.floor((now - Number(lastCheck)) / 1000);
        if (secondsPassed > 0) {
            let energy = Number(localStorage.getItem('vv_energy')) || 0;
            const maxE = Number(localStorage.getItem('vv_max_energy')) || 500;
            const dietCost = Number(localStorage.getItem('vv_diet_cost')) || 10;
            const rates = { 10: 0.15, 40: 0.3, 150: 0.5, 500: 0.75, 2000: 1.25 };
            energy = Math.min(maxE, energy + (secondsPassed * (rates[dietCost] || 0.15)));
            localStorage.setItem('vv_energy', energy);
        }
    }
    localStorage.setItem('vv_last_energy_check', now);
}

// 6. INFLATION ENGINE (unchanged)
function applyInflation() {
    const lastUpdate = localStorage.getItem('vv_last_inflation_date');
    const now = Date.now();
    if (!lastUpdate) {
        localStorage.setItem('vv_last_inflation_date', now);
        localStorage.setItem('vv_inflation_rate', 1.15);
        return;
    }
    if (now - Number(lastUpdate) >= 86400000) {
        let currentRate = Number(localStorage.getItem('vv_inflation_rate')) || 1.15;
        let dailyRise = (Math.random() * (0.035 - 0.015) + 0.015);
        localStorage.setItem('vv_inflation_rate', currentRate + dailyRise);
        localStorage.setItem('vv_last_inflation_date', now);
    }
}
window.getInflationRate = () => Number(localStorage.getItem('vv_inflation_rate')) || 1.15;

// 7. EXECUTION
setTimeout(() => {
    processFinances(); 
    syncEnergy();
    applyInflation();
    setInterval(() => { 
        processFinances(); 
        syncEnergy(); 
    }, 60000);
}, 2000);