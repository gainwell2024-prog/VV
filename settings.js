// 1. UNIVERSAL STYLES
const universalStyles = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;700;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; outline: none; -webkit-tap-highlight-color: transparent; }
    html, body { width: 100vw; height: 100vh; overflow: hidden !important; position: fixed; font-family: 'Kanit', sans-serif; background: #020617; color: white; }
    ::-webkit-scrollbar { display: none !important; }
    
    .header-bar { padding: 0 20px; display: flex; justify-content: space-between; align-items: center; background: rgba(15, 23, 42, 0.9); height: 60px; border-bottom: 2px solid #fbbf24; width: 100%; position: fixed; top:0; z-index: 100; }
    .game-logo-text { font-weight: 900; font-size: 1.2rem; letter-spacing: 1px; color: #fbbf24; italic; }
    
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

// 2. AUDIO ENGINE
const audio = {
    bg: new Audio('bg-music.mp3'),
    tap: new Audio('tap.mp3')
};
audio.bg.loop = true;

window.playSound = (type) => {
    if (localStorage.getItem('vv_sound') !== 'off') {
        if(type === 'tap') { audio.tap.currentTime = 0; audio.tap.play(); }
    }
}

// 3. UI INJECTION
function injectUI() {
    const header = `
        <div class="header-bar">
            <div class="game-logo-text">VIRTUAL VENTURES</div>
            <i class="fas fa-cog" onclick="openSettings()" style="color:#fbbf24; font-size:1.3rem; cursor:pointer"></i>
        </div>
    `;

    const footer = `
        <div class="bottom-nav">
            <a href="dashboard.html" class="nav-item ${window.location.href.includes('dashboard')?'active':''}">
                <i class="fas fa-hand-pointer"></i><span>WORK</span>
            </a>
            <a href="business.html" class="nav-item ${window.location.href.includes('business')?'active':''}">
                <i class="fas fa-briefcase"></i><span>EMPIRE</span>
            </a>
            <a href="market.html" class="nav-item ${window.location.href.includes('market')?'active':''}">
                <i class="fas fa-chart-line"></i><span>INVEST</span>
            </a>
            <a href="events.html" class="nav-item ${window.location.href.includes('events')?'active':''}">
                <i class="fas fa-bolt"></i><span>EVENTS</span>
            </a>
            <a href="profile.html" class="nav-item ${window.location.href.includes('profile')?'active':''}">
                <i class="fas fa-user-circle"></i><span>PROFILE</span>
            </a>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', header);
    document.body.insertAdjacentHTML('beforeend', footer + `
        <div id="settingsModal">
            <div class="set-card">
                <h3 style="text-align:center; margin-bottom:20px; letter-spacing:2px">SETTINGS</h3>
                <div class="set-row"><span>Music</span><div id="musicToggle" class="toggle" onclick="toggleMusic()"></div></div>
                <div class="set-row"><span>SFX</span><div id="soundToggle" class="toggle" onclick="toggleSFX()"></div></div>
                <button onclick="closeSettings()" style="width:100%; background:#fbbf24; border:none; padding:12px; border-radius:15px; font-weight:900; margin-top:10px">SAVE</button>
            </div>
        </div>
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

window.toggleSFX = () => {
    let s = localStorage.getItem('vv_sound') === 'off' ? 'on' : 'off';
    localStorage.setItem('vv_sound', s);
    renderSettings();
};

function renderSettings() {
    document.getElementById('musicToggle').className = `toggle ${localStorage.getItem('vv_music')!=='off'?'on':''}`;
    document.getElementById('soundToggle').className = `toggle ${localStorage.getItem('vv_sound')!=='off'?'on':''}`;
}

// Global Music Trigger for Autoplay
window.addEventListener('touchstart', () => { if(localStorage.getItem('vv_music') !== 'off') audio.bg.play().catch(()=>{}); }, {once:true});

injectUI();