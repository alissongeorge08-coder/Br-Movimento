/* ====================================================
   BR + MOVIMENTO — main.js
   ==================================================== */

/* --------------- Configuração de Vídeos ---------------
   Em produção, os vídeos ficam no Cloudflare R2 (CDN gratuito).
   Em desenvolvimento local, são servidos da pasta videos/.

   Após subir os vídeos no R2, cole a URL pública aqui:
   ------------------------------------------------------ */
const VIDEO_CONFIG = (() => {
    const isLocal = location.hostname === 'localhost'
                 || location.hostname === '127.0.0.1'
                 || location.protocol === 'file:';

    // ← Cole aqui a URL pública do seu bucket R2
    // Exemplo: 'https://pub-abc123.r2.dev'
    const R2_BASE_URL = 'https://pub-093acdab6cfa44149c7c1afea00ec62f.r2.dev';

    return {
        isLocal,
        baseUrl: isLocal ? 'videos' : R2_BASE_URL
    };
})();

/* --------------- Playlist do Spotify ---------------
   Playlist oficial "Quadrilha" curada pelo Spotify.
   70 músicas · 66K saves · forró, baião e quadrilha clássica.
   Para usar uma playlist própria, substitua o ID abaixo.
   --------------------------------------------------- */
const SPOTIFY_PLAYLIST_URL = 'https://open.spotify.com/playlist/37i9dQZF1DXbFmIQ7xHuBO';
/* URI nativa (abre direto no app Spotify no celular) */
const SPOTIFY_URI = 'spotify:playlist:37i9dQZF1DXbFmIQ7xHuBO';

/* ====================================================
   SISTEMA DE ÁUDIO
   - Música de fundo: audio/quadrilha.mp3  (coloque o arquivo lá)
   - Efeitos sonoros sintetizados via Web Audio API
   ==================================================== */
const AudioSystem = {
    _ctx:      null,
    _bgAudio:  null,
    _musicOn:  true,
    _sfxOn:    true,
    _unlocked: false,

    init() {
        const prefs = JSON.parse(localStorage.getItem('brm_audio') || '{}');
        this._musicOn = prefs.music !== false;
        this._sfxOn   = prefs.sfx   !== false;

        // Faixa royalty-free: "Passos de Quadrilha" — Pixabay CDN (CC0)
        // Fallback local: coloque audio/quadrilha.mp3 para uso offline
        const cdnUrl   = 'https://cdn.pixabay.com/audio/2025/04/30/20-29-59-304.mp3';
        const localUrl = 'audio/quadrilha.mp3';
        this._bgAudio = new Audio(cdnUrl);
        this._bgAudio.addEventListener('error', () => {
            // Se CDN falhar, tenta arquivo local
            if (this._bgAudio.src !== localUrl) {
                this._bgAudio.src = localUrl;
                if (this._musicOn) this._bgAudio.play().catch(() => {});
            }
        });
        this._bgAudio.loop    = true;
        this._bgAudio.volume  = 0.3;
        this._bgAudio.preload = 'none';

        // Desbloqueia áudio no primeiro gesto (política de autoplay dos browsers)
        const unlock = () => {
            if (this._unlocked) return;
            this._unlocked = true;
            this._ensureCtx();
            if (this._musicOn) this._bgAudio.play().catch(() => {});
        };
        document.addEventListener('click',    unlock, { once: true });
        document.addEventListener('touchend', unlock, { once: true });

        this._updateBtn();
    },

    _ensureCtx() {
        if (!this._ctx) this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this._ctx.state === 'suspended') this._ctx.resume();
        return this._ctx;
    },

    /* Abaixa música enquanto vídeo toca */
    duck()   { if (this._bgAudio) this._bgAudio.volume = 0; },
    unduck() {
        const pref = localStorage.getItem('brm_music_pref');
        if (this._bgAudio && this._musicOn && pref !== 'spotify') this._bgAudio.volume = 0.3;
    },

    /* Para completamente (modo Spotify) */
    stopBg() {
        if (this._bgAudio) { this._bgAudio.pause(); this._bgAudio.currentTime = 0; }
        const btn  = document.getElementById('btn-music');
        if (btn) btn.style.display = 'none'; // esconde o controle de música no player
    },

    /* Retoma (voltou pro modo padrão) */
    resumeBg() {
        const btn = document.getElementById('btn-music');
        if (btn) btn.style.display = '';
        if (!this._musicOn) return;
        if (!this._unlocked) { this._unlocked = true; this._ensureCtx(); }
        if (this._bgAudio) this._bgAudio.play().catch(() => {});
    },

    toggleMusic() {
        this._musicOn = !this._musicOn;
        localStorage.setItem('brm_audio', JSON.stringify({ music: this._musicOn, sfx: this._sfxOn }));
        if (this._musicOn) {
            if (!this._unlocked) { this._unlocked = true; this._ensureCtx(); }
            this._bgAudio.volume = 0.3;
            this._bgAudio.play().catch(() => {});
        } else {
            this._bgAudio.pause();
        }
        this._updateBtn();
    },

    _updateBtn() {
        const btn  = document.getElementById('btn-music');
        const icon = document.getElementById('music-icon');
        if (!btn) return;
        if (icon) icon.className = this._musicOn ? 'ti ti-music' : 'ti ti-music-off';
        btn.setAttribute('aria-pressed', String(this._musicOn));
        btn.title = this._musicOn ? 'Pausar música' : 'Tocar música';
    },

    /* Efeito: faísca ascendente para o confete */
    sfxConfetti() {
        if (!this._sfxOn) return;
        try {
            const ctx = this._ensureCtx(), t0 = ctx.currentTime;
            [523, 659, 784, 1047, 1319].forEach((freq, i) => {
                const osc = ctx.createOscillator(), gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'sine'; osc.frequency.value = freq;
                const t = t0 + i * 0.07;
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.16, t + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
                osc.start(t); osc.stop(t + 0.23);
            });
        } catch (_) {}
    },

    /* Efeito: fanfarra triunfante para troféu */
    sfxTrophy() {
        if (!this._sfxOn) return;
        try {
            const ctx = this._ensureCtx(), t0 = ctx.currentTime;
            // Arpegio ascendente G4 → C5 → E5 → G5
            [392, 523, 659, 784].forEach((freq, i) => {
                const osc = ctx.createOscillator(), gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'triangle'; osc.frequency.value = freq;
                const t = t0 + i * 0.13;
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.20, t + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
                osc.start(t); osc.stop(t + 0.31);
            });
            // Acorde final C5–E5–G5 com sustain
            [523, 659, 784].forEach(freq => {
                const osc = ctx.createOscillator(), gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'sine'; osc.frequency.value = freq;
                const t = t0 + 0.62;
                gain.gain.setValueAtTime(0, t);
                gain.gain.linearRampToValueAtTime(0.14, t + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
                osc.start(t); osc.stop(t + 1.2);
            });
        } catch (_) {}
    }
};

/* --------------- Confete (Lottie) ---------------
   Dispara ao concluir a avaliação de uma aula.
   Arquivo: animations/celebration_confetti.json
   ------------------------------------------------ */
function playConfetti() {
    const el = document.getElementById('confetti-overlay');
    if (!el || typeof lottie === 'undefined') {
        console.warn('[Lottie] confetti: elemento não encontrado ou lottie.js não carregou.', { el, lottie: typeof lottie });
        return;
    }

    // Estilo do overlay (pointer-events:none para não bloquear cliques)
    Object.assign(el.style, {
        display: 'block',
        position: 'fixed',
        top: '0', left: '0',
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: '9999'
    });

    const anim = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: 'image/celebration_confetti.json'
    });

    anim.addEventListener('data_failed', () => {
        console.error('[Lottie] Falha ao carregar celebration_confetti.json. Verifique: (1) o arquivo existe em image/celebration_confetti.json, (2) o app está servido via HTTP (não file://).');
        el.style.display = 'none';
    });

    // Limpa o overlay ao terminar
    anim.addEventListener('complete', () => {
        el.style.display = 'none';
        anim.destroy();
    });

    // Segurança: força limpeza após 5s mesmo se o evento não disparar
    setTimeout(() => {
        el.style.display = 'none';
        try { anim.destroy(); } catch (_) {}
    }, 5000);
}

/* --------------- Troféu desbloqueado (Lottie) --------
   Dispara quando uma conquista é desbloqueada.
   Arquivo: image/trofeu.json
   ------------------------------------------------ */
function playTrophyUnlock(trophyName) {
    const el = document.getElementById('trophy-overlay');
    if (!el || typeof lottie === 'undefined') {
        console.warn('[Lottie] trophy: elemento não encontrado ou lottie.js não carregou.', { el, lottie: typeof lottie });
        return;
    }
    AudioSystem.sfxTrophy();

    // Fica limitado ao container do app (shell mobile 414px)
    const appContainer = document.getElementById('app-container');
    const rect = appContainer ? appContainer.getBoundingClientRect() : null;

    // Animação ocupa a metade superior do shell (centralizado, não tela toda)
    const appTop    = rect ? rect.top    : 0;
    const appLeft   = rect ? rect.left   : 0;
    const appWidth  = rect ? rect.width  : window.innerWidth;
    const appHeight = rect ? rect.height : window.innerHeight;
    const animH     = Math.round(appHeight * 0.55); // 55% da altura do shell

    Object.assign(el.style, {
        display:   'block',
        position:  'fixed',
        top:       (appTop + appHeight * 0.05) + 'px',  // 5% de margem do topo
        left:      appLeft + 'px',
        width:     appWidth + 'px',
        height:    animH + 'px',
        pointerEvents: 'none',
        zIndex:    '9999',
        overflow:  'hidden'
    });

    const anim = lottie.loadAnimation({
        container: el,
        renderer:  'svg',
        loop:      false,
        autoplay:  true,
        path:      'image/trofeu.json'
    });
    anim.setSpeed(0.6);

    anim.addEventListener('data_failed', () => {
        console.error('[Lottie] Falha ao carregar trofeu.json. Verifique: (1) o arquivo existe em image/trofeu.json, (2) o app está servido via HTTP (não file://).');
        el.style.display = 'none';
    });

    // Toast aparece logo abaixo da animação, centralizado no shell
    const toastTop = appTop + appHeight * 0.05 + animH + 8;
    const toast = document.createElement('div');
    Object.assign(toast.style, {
        position:      'fixed',
        top:           toastTop + 'px',
        left:          appLeft + 'px',
        width:         appWidth + 'px',
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '8px',
        zIndex:        '10000',
        pointerEvents: 'auto',
        cursor:        'pointer',
        opacity:       '0',
        transition:    'opacity 0.4s ease'
    });
    toast.innerHTML = `
        <div style="background:rgba(0,0,0,0.88); color:#fff; padding:14px 22px; border-radius:20px;
                    font-size:0.88rem; font-weight:700; text-align:center; box-shadow:0 4px 24px rgba(0,0,0,0.5);
                    border:1.5px solid rgba(254,208,45,0.4); max-width:88%;">
            🏆 Troféu desbloqueado!<br>
            <span style="color:var(--secondary); font-size:0.95rem;">${trophyName}</span>
        </div>
        <div style="display:flex; gap:10px;">
            <button id="trophy-btn-view"
                    style="background:var(--primary); color:#fff; border:none; padding:9px 20px; border-radius:32px;
                           font-size:0.8rem; font-weight:600; box-shadow:0 2px 12px rgba(253,94,41,0.4); cursor:pointer;">
                Ver troféus →
            </button>
            <button id="trophy-btn-dismiss"
                    style="background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.75); border:1px solid rgba(255,255,255,0.2);
                           padding:9px 20px; border-radius:32px; font-size:0.8rem; font-weight:500; cursor:pointer;">
                Continuar
            </button>
        </div>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });

    let cleaned = false;
    const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        el.style.display = 'none';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
        try { anim.destroy(); } catch (_) {}
    };

    toast.querySelector('#trophy-btn-view').addEventListener('click', () => {
        cleanup();
        app.navigate('trophies');
    });
    toast.querySelector('#trophy-btn-dismiss').addEventListener('click', cleanup);

    // Fecha sozinho após 7s se o usuário não interagir
    setTimeout(cleanup, 7000);
}

const app = {

    /* ---------- State ---------- */
    state: {
        currentView: 'landing',
        isMirrored: false,
        tipsOpen: false,
        minutesActive: 120,
        isLoggedIn: false,
        user: null,          // { name, email, password }
        users: [],            // simulated local "database"
        videoQuality: 'auto',
        qualityPanelOpen: false,
        pendingTrophyUnlock: null,
    },

    curriculum: {
        steps: [
            { id: '01', title: 'Marcação Básica', desc: 'Introdução e ritmo' },
            { id: '02', title: 'Caminhada e Deslocamento', desc: 'Movimentos pelo salão' },
            { id: '03', title: 'Giro Simples', desc: 'Noções de eixo e rotação' },
            { id: '04', title: 'Abertura e Lateral', desc: 'Exploração do espaço' },
            { id: '05', title: 'Giro Complexo', desc: 'Variações e dinâmicas' },
            { id: '06', title: 'Coreografia', desc: 'Encadeamento dos passos' }
        ],
        levels: [
            { id: 'A', name: 'Básico', icon: 'play_circle' },
            { id: 'B', name: 'Intermediário', icon: 'play_circle' },
            { id: 'C', name: 'Avançado', icon: 'play_circle' }
        ],
        roles: {
            'cavalheiro': { prefix: 'C', name: 'Cavalheiro' },
            'dama': { prefix: 'D', name: 'Dama' },
            'casal': { prefix: 'CASAL', name: 'Casal' }
        }
    },

    /* ======================================================
       INITIALIZATION
       ====================================================== */
    init() {
        // Seed demo user if none exist
        const savedUsers = localStorage.getItem('sertao_users');
        if (savedUsers) {
            this.state.users = JSON.parse(savedUsers);
        }
            // Quick demo login setup
            let anaUser = this.state.users.find(u => u.email === 'ana@sertaodanca.com');
            if (!anaUser) {
                anaUser = { name: 'Ana Paula Souza', email: 'ana@sertaodanca.com', password: 'demo123', role: 'student', progress: {} };
                this.state.users.push(anaUser);
            } else {
                anaUser.progress = {}; // Wipe mock data
            }
            localStorage.setItem('sertao_users', JSON.stringify(this.state.users));

            // Update active session if she is currently logged in
            const activeUser = localStorage.getItem('sertao_user');
            if (activeUser) {
                const parsed = JSON.parse(activeUser);
                if (parsed.email === 'ana@sertaodanca.com') {
                    parsed.progress = {}; // Wipe mock data
                    localStorage.setItem('sertao_user', JSON.stringify(parsed));
                    if (this.state.user && this.state.user.email === 'ana@sertaodanca.com') {
                        this.state.user.progress = {};
                    }
                }
            }

        if (!this.state.users.find(u => u.email === 'prof@sertaodanca.com')) {
            this.state.users.push({ name: 'Prof. Mestre Vitalino', email: 'prof@sertaodanca.com', password: 'admin123', role: 'educator' });
            localStorage.setItem('sertao_users', JSON.stringify(this.state.users));
        }

        // Restore session from localStorage
        const saved = localStorage.getItem('sertao_user');
        if (saved) {
            const user = JSON.parse(saved);
            this.state.user = user;
            this.state.isLoggedIn = true;
        }

        // Restore video quality preference
        const savedQuality = localStorage.getItem('sertao_quality');
        if (savedQuality) this.state.videoQuality = savedQuality;

        this._syncProfileUI();
        this._initTheme();
        this._updateNav('landing');

        // Bind modal forms
        const formLogin = document.getElementById('form-login');
        if (formLogin) formLogin.addEventListener('submit', e => { e.preventDefault(); this._handleLogin(); });

        const formRegister = document.getElementById('form-register');
        if (formRegister) formRegister.addEventListener('submit', e => { e.preventDefault(); this._handleRegister(); });

        // Close modal on backdrop click
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.addEventListener('click', e => {
                if (e.target === authModal) this.closeAuthModal();
            });
        }



        this.switchTrilhaTab('cavalheiro');
        this._initSeek();
        AudioSystem.init();

        // Garante que só valores válidos ficam no localStorage
        const savedPref = localStorage.getItem('brm_music_pref');
        if (savedPref && savedPref !== 'spotify' && savedPref !== 'default') {
            localStorage.removeItem('brm_music_pref'); // limpa valor inválido
        }

        this._syncMusicPrefUI();

        // Se preferência já for Spotify, oculta controle de música padrão no player
        if (localStorage.getItem('brm_music_pref') === 'spotify') AudioSystem.stopBg();
        console.log('Brasil em Movimento v2 initialized.');
    },

    /* ======================================================
       SEEK (drag-to-scrub progress bar)
       ====================================================== */
    _initSeek() {
        const track = document.getElementById('player-track');
        if (!track || track._seekInit) return;
        track._seekInit = true;

        const getPct = (e) => {
            const rect = track.getBoundingClientRect();
            const clientX = (e.touches ? e.touches[0] : e).clientX;
            return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        };

        const applySeek = (pct) => {
            const video = document.getElementById('main-video');
            const fill  = document.getElementById('player-fill');
            const thumb = document.getElementById('player-thumb');
            const curr  = document.getElementById('player-current');
            const p = pct * 100;
            if (fill)  { fill.style.transition  = 'none'; fill.style.width  = `${p}%`; }
            if (thumb) { thumb.style.transition = 'none'; thumb.style.left  = `${p}%`; }
            if (video && video.duration) {
                const t = pct * video.duration;
                if (curr) curr.innerText = `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
                video.currentTime = t;
            }
            this._showControls();
        };

        const onMove = (e) => {
            if (!this.state.isSeeking) return;
            e.preventDefault();
            applySeek(getPct(e));
        };

        const onEnd = () => {
            this.state.isSeeking = false;
            track.classList.remove('seeking');
            const fill  = document.getElementById('player-fill');
            const thumb = document.getElementById('player-thumb');
            if (fill)  fill.style.transition  = '';
            if (thumb) thumb.style.transition = '';
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup',   onEnd);
            document.removeEventListener('touchend',  onEnd);
        };

        track.addEventListener('mousedown', (e) => {
            this.state.isSeeking = true;
            track.classList.add('seeking');
            applySeek(getPct(e));
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup',   onEnd);
        });

        track.addEventListener('touchstart', (e) => {
            this.state.isSeeking = true;
            track.classList.add('seeking');
            applySeek(getPct(e));
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend',  onEnd);
        }, { passive: true });
    },

    /* ======================================================
       NAVIGATION
       ====================================================== */
    navigate(viewId) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const target = document.getElementById(`view-${viewId}`);
        if (target) target.classList.add('active');
        this.state.currentView = viewId;
        this._updateNav(viewId);

        if (viewId === 'settings') {
            this._syncMusicPrefUI();
        }

        if (viewId === 'trophies') {
            document.querySelectorAll('.trophy-card-viewer').forEach(container => {
                const viewer = container.querySelector('model-viewer');
                const type = container.getAttribute('data-trophy-color');
                if (viewer && type) this._applyTrophyColor(viewer, type);
            });
        }
    },

    _updateNav(viewId) {
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
            el.removeAttribute('aria-current');
        });
        const active = document.getElementById(`nav-${viewId}`);
        if (active) {
            active.classList.add('active');
            active.setAttribute('aria-current', 'page');
        }
    },

    /* ======================================================
       LESSONS
       ====================================================== */
    startLesson(title, videoFile, roleName = 'Prática') {
        this.state.currentDance = roleName;
        this.state.lessonTitle = title;
        this.state.currentVideoFile = videoFile;
        this.state.playerSeconds = 0;
        this.state.playerPlaying = false;   // inicia pausado — usuário dá play quando pronto
        this.state.feedbackShown = false;
        this.state.lastTapTime = 0;

        // Update player UI text
        document.getElementById('current-lesson-title').innerText = title;
        document.getElementById('video-lesson-top-title').innerText = title;
        document.getElementById('video-dance-tag').innerText = roleName;
        document.getElementById('current-lesson-sub').innerText = 'Duração flexível';

        // Load real video
        this._loadVideo(title, videoFile);

        this.navigate('experience');
        this._showControls();
        if (navigator.vibrate) navigator.vibrate(50);

        // Verifica preferência musical (mostra modal se for a 1ª vez)
        this._checkMusicPref();
    },

    navigateBack() {
        this._stopPlayerTimer();
        this._cancelHideTimer();
        const video = document.getElementById('main-video');
        if (video) { video.pause(); video.currentTime = 0; AudioSystem.unduck(); }
        // Close quality panel if open
        if (this.state.qualityPanelOpen) this.toggleQualityPanel();
        
        let dest = 'home';
        if (this.state.currentView === 'experience') dest = 'trilhas';
        else if (this.state.currentView === 'quadrilha' || this.state.currentView === 'xaxado') dest = 'home';
        else if (this.state.currentView === 'history') dest = 'profile';
        
        this.navigate(dest);
    },

    /* ======================================================
       VIDEO PLAYER SIMULATION
       ====================================================== */
    _startPlayerTimer() {
        this._stopPlayerTimer(); // Clear any existing
        this._playerInterval = setInterval(() => {
            if (!this.state.playerPlaying) return;
            this.state.playerSeconds++;
            this._updatePlayerUI();

            if (this.state.playerSeconds >= this.state.playerDuration) {
                this._stopPlayerTimer();
                // Vídeo simulado chegou ao fim — abre o feedback
                if (!this.state.feedbackShown) {
                    this.state.feedbackShown = true;
                    setTimeout(() => this._showFeedback(), 500);
                }
            }
        }, 1000);
    },

    _stopPlayerTimer() {
        if (this._playerInterval) { clearInterval(this._playerInterval); this._playerInterval = null; }
    },

    _updatePlayerUI() {
        const s = this.state.playerSeconds;
        const dur = this.state.playerDuration;
        const pct = Math.min((s / dur) * 100, 100);
        const fmt = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

        const fill = document.getElementById('player-fill');
        const thumb = document.getElementById('player-thumb');
        const curr = document.getElementById('player-current');
        if (fill) fill.style.width = `${pct}%`;
        if (thumb) thumb.style.left = `${pct}%`;
        if (curr) curr.innerText = fmt(s);
    },

    togglePlay() {
        const video  = document.getElementById('main-video');
        const icon   = document.querySelector('#main-play-btn i');
        const ppIcon = document.getElementById('play-pause-icon');
        const bigIcon = ppIcon ? ppIcon.querySelector('i') : null;

        if (video && (video.src || video.currentSrc || this.state.currentVideoFile)) {
            // Real video control
            if (video.paused || video.ended) {
                if (video.ended) video.currentTime = 0;
                video.play();
                this.state.playerPlaying = true;
                AudioSystem.duck();
            } else {
                video.pause();
                this.state.playerPlaying = false;
                AudioSystem.unduck();
            }
        } else {
            // Simulated fallback
            this.state.playerPlaying = !this.state.playerPlaying;
        }

        const cls = this.state.playerPlaying ? 'ti ti-player-pause-filled' : 'ti ti-player-play-filled';
        if (icon) icon.className = cls;
        if (bigIcon) bigIcon.className = cls;

        if (ppIcon) {
            ppIcon.classList.add('visible');
            setTimeout(() => ppIcon.classList.remove('visible'), 700);
        }
        this._showControls();
    },

    /* ======================================================
       CONTROLES AUTO-HIDE
       ====================================================== */
    handleVideoTap() {
        const now = Date.now();
        const ui = document.getElementById('player-ui');
        const isVisible = ui && ui.classList.contains('controls-visible');

        if (isVisible) {
            // segundo toque rápido (< 400ms) = pause/play
            if (now - this.state.lastTapTime < 400) {
                this.togglePlay();
                return;
            }
            // controles já visíveis: esconde ou reinicia timer
            this._startHideTimer();
        } else {
            // controles ocultos: mostra
            this._showControls();
        }
        this.state.lastTapTime = now;
    },

    _showControls() {
        const ui = document.getElementById('player-ui');
        if (ui) ui.classList.add('controls-visible');
        this._startHideTimer();
    },

    _startHideTimer() {
        this._cancelHideTimer();
        this._hideTimer = setTimeout(() => {
            const ui = document.getElementById('player-ui');
            if (ui) ui.classList.remove('controls-visible');
        }, 3000);
    },

    _cancelHideTimer() {
        if (this._hideTimer) { clearTimeout(this._hideTimer); this._hideTimer = null; }
    },

    seekBack() {
        const video = document.getElementById('main-video');
        if (video && video.readyState > 0) {
            video.currentTime = Math.max(0, video.currentTime - 10);
        } else {
            this.state.playerSeconds = Math.max(0, this.state.playerSeconds - 10);
            this._updatePlayerUI();
        }
        this._showControls();
    },

    seekForward() {
        const video = document.getElementById('main-video');
        if (video && video.readyState > 0) {
            video.currentTime = Math.min(video.duration, video.currentTime + 10);
        } else {
            this.state.playerSeconds = Math.min(this.state.playerDuration, this.state.playerSeconds + 10);
            this._updatePlayerUI();
        }
        this._showControls();
    },

    /* ======================================================
       VIDEO SOURCE MANAGEMENT
       ====================================================== */
    _loadVideo(title, videoFile) {
        const video = document.getElementById('main-video');
        const source = document.getElementById('video-source');
        if (!video || !source) return;

        const filename = videoFile || this.state.currentVideoFile;
        if (!filename) {
            console.warn('No video mapped for:', title);
            // Fallback: keep poster image, run simulated timer
            video.removeAttribute('src');
            source.removeAttribute('src');
            this.state.playerDuration = 300;
            document.getElementById('player-total').innerText = '5:00';
            this._startPlayerTimer();
            return;
        }

        const quality = this.state.videoQuality === 'auto' ? '720p' : this.state.videoQuality;
        // Local: videos/720p/arquivo.mp4
        // R2:    https://pub-xxx.r2.dev/720/arquivo.mp4 (sem o "p")
        const folder = VIDEO_CONFIG.isLocal ? quality : quality.replace('p', '');
        const videoPath = `${VIDEO_CONFIG.baseUrl}/${folder}/${filename}`;

        source.src = videoPath;
        video.load();

        video.onloadedmetadata = () => {
            this.state.playerDuration = Math.floor(video.duration);
            const fmt = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
            document.getElementById('player-total').innerText = fmt(this.state.playerDuration);
        };

        video.ontimeupdate = () => {
            if (!video.duration || this.state.isSeeking) return;
            this.state.playerSeconds = Math.floor(video.currentTime);
            const pct = (video.currentTime / video.duration) * 100;
            const fmt = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
            const fill = document.getElementById('player-fill');
            const thumb = document.getElementById('player-thumb');
            const curr = document.getElementById('player-current');
            if (fill) fill.style.width = `${pct}%`;
            if (thumb) thumb.style.left = `${pct}%`;
            if (curr) curr.innerText = fmt(Math.floor(video.currentTime));

        };

        video.onended = () => {
            if (!video.loop) {
                video.currentTime = 0;
                video.pause();
            }
            this.state.playerPlaying = false;
            AudioSystem.unduck();
            const icon = document.querySelector('#main-play-btn i');
            if (icon) icon.className = 'ti ti-player-play-filled';
            // Vídeo chegou ao fim — abre o feedback de avaliação
            if (!this.state.feedbackShown) {
                this.state.feedbackShown = true;
                setTimeout(() => this._showFeedback(), 600);
            }
        };

        video.onerror = () => {
            console.warn('Video not found at:', videoPath, '— using simulated player.');
            AudioSystem.unduck();
            this.state.playerDuration = 300;
            document.getElementById('player-total').innerText = '5:00';
            this._startPlayerTimer();
        };

        // Play→pause imediato: força o browser a decodificar e exibir o 1º frame
        // sem iniciar a reprodução de fato (respeita a decisão do usuário sobre música).
        video.play()
            .then(() => { video.pause(); })
            .catch(() => { /* autoplay bloqueado — frame pode não aparecer, tudo bem */ });

        this.state.playerPlaying = false;
        const _playIcon = document.querySelector('#main-play-btn i');
        const _bigIcon  = document.querySelector('#play-pause-icon i');
        if (_playIcon) _playIcon.className = 'ti ti-player-play-filled';
        if (_bigIcon)  _bigIcon.className  = 'ti ti-player-play-filled';
    },

    /* ======================================================
       QUALITY PANEL
       ====================================================== */
    toggleQualityPanel() {
        this.state.qualityPanelOpen = !this.state.qualityPanelOpen;
        const panel = document.getElementById('quality-panel');
        const btn = document.getElementById('btn-quality');
        if (panel) {
            panel.classList.toggle('show', this.state.qualityPanelOpen);
            panel.setAttribute('aria-hidden', String(!this.state.qualityPanelOpen));
        }
        if (btn) {
            btn.classList.toggle('active', this.state.qualityPanelOpen);
            btn.setAttribute('aria-pressed', String(this.state.qualityPanelOpen));
        }
        // Close tips if open
        if (this.state.qualityPanelOpen && this.state.tipsOpen) {
            this.toggleTips();
        }
        this._showControls();
    },

    setVideoQuality(quality) {
        this.state.videoQuality = quality;
        localStorage.setItem('sertao_quality', quality);

        // Update active state in panel
        document.querySelectorAll('.quality-opt').forEach(opt => {
            const isActive = opt.getAttribute('data-quality') === quality;
            opt.classList.toggle('active', isActive);
            opt.setAttribute('aria-checked', String(isActive));
        });

        // If a video is currently playing, reload with new quality
        const video = document.getElementById('main-video');
        if (video && this.state.lessonTitle && video.currentTime > 0) {
            const currentTime = video.currentTime;
            const wasPlaying = !video.paused;
            this._loadVideo(this.state.lessonTitle, this.state.currentVideoFile);
            video.onloadedmetadata = () => {
                video.currentTime = currentTime;
                if (wasPlaying) video.play();
                this.state.playerDuration = Math.floor(video.duration);
                const fmt = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
                document.getElementById('player-total').innerText = fmt(this.state.playerDuration);
            };
        }

        // Close panel after selection
        setTimeout(() => {
            this.state.qualityPanelOpen = false;
            const panel = document.getElementById('quality-panel');
            const btn = document.getElementById('btn-quality');
            if (panel) { panel.classList.remove('show'); panel.setAttribute('aria-hidden', 'true'); }
            if (btn) { btn.classList.remove('active'); btn.setAttribute('aria-pressed', 'false'); }
        }, 300);
    },

    /* ======================================================
       DIFFICULTY FEEDBACK POPUP
       ====================================================== */
    _showFeedback() {
        const popup = document.getElementById('feedback-popup');
        if (popup) { popup.classList.add('show'); popup.setAttribute('aria-hidden', 'false'); }
    },

    closeFeedback() {
        const popup = document.getElementById('feedback-popup');
        if (popup) { popup.classList.remove('show'); popup.setAttribute('aria-hidden', 'true'); }
    },

    submitFeedback(isOk) {
        const msg = isOk
            ? 'Ótimo! Continuaremos recomendando este nível para você. 🎉'
            : 'Entendido! Vamos ajustar as sugestões para você. 👍';
        console.log('Feedback:', isOk ? 'OK' : 'NOT OK');
        this.closeFeedback();
        // Brief toast (replace emoji label)
        const tag = document.getElementById('video-dance-tag');
        if (tag) {
            const orig = tag.innerText;
            tag.innerText = isOk ? '✓ Obrigado!' : '✓ Anotado!';
            setTimeout(() => { tag.innerText = orig; }, 2500);
        }
    },

    finishLesson() {
        this._stopPlayerTimer();
        if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
        this.state.minutesActive += 5;
        const statEl = document.getElementById('stat-minutes');
        if (statEl) statEl.innerText = this.state.minutesActive;

        const btn = document.querySelector('.btn-check');
        if (btn) btn.style.transform = 'scale(1.18)';
        setTimeout(() => {
            if (btn) btn.style.transform = '';
            this.navigateBack();
        }, 280);
    },

    /* ======================================================
       FITNESS FEEDBACK MODAL (POST-LESSON)
       ====================================================== */
    openFitnessFeedback() {
        const v = document.getElementById('main-video');
        if (v && !v.paused) this.togglePlay();
        
        if (navigator.vibrate) navigator.vibrate([40, 20, 40]);

        const modal = document.getElementById('fitness-modal');
        const warn = document.getElementById('fitness-guest-warning');
        if (warn) warn.style.display = this.state.isLoggedIn ? 'none' : 'flex';
        const guestNotice = document.getElementById('guest-eval-notice');
        if (guestNotice) guestNotice.style.display = this.state.isLoggedIn ? 'none' : 'block';

        // Reset Steps UI
        const step1 = document.getElementById('fitness-step-eval');
        const step2 = document.getElementById('fitness-step-share');
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';

        // Reset Diff UI
        this.state.currentDifficulty = null;
        document.querySelectorAll('.feedback-btn').forEach(btn => btn.classList.remove('active', 'selected'));

        // Reset stars
        this.state.currentFitnessRating = 0;
        document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById('fitness-label').innerText = 'Selecione as estrelas';
        document.getElementById('btn-fitness-submit').disabled = true;

        if (modal) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        }
    },

    closeFitnessFeedback() {
        const modal = document.getElementById('fitness-modal');
        if (modal) {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
        }
        this.navigateBack();
        // Failsafe: disparar troféu pendente mesmo se vier por aqui diretamente
        if (this.state.pendingTrophyUnlock) {
            const name = this.state.pendingTrophyUnlock;
            this.state.pendingTrophyUnlock = null;
            setTimeout(() => playTrophyUnlock(name), 400);
        }
    },

    continueFromFeedback() {
        this.closeFitnessFeedback();
    },

    rateDifficulty(isAdequate) {
        this.state.currentDifficulty = isAdequate;
        const btnYes = document.getElementById('btn-diff-yes');
        const btnNo = document.getElementById('btn-diff-no');
        if (btnYes && btnNo) {
            btnYes.classList.toggle('selected', isAdequate === true);
            btnNo.classList.toggle('selected', isAdequate === false);
        }
        this._checkFitnessSubmit();
    },

    rateFitness(stars) {
        this.state.currentFitnessRating = stars;
        document.querySelectorAll('.star-btn').forEach(btn => {
            const val = parseInt(btn.getAttribute('data-val'));
            btn.classList.toggle('active', val <= stars);
        });

        const labels = {
            1: { title: 'Apenas assisti', desc: 'Apenas visualização.' },
            2: { title: 'Tentei seguir', desc: 'Forte dependência do vídeo.' },
            3: { title: 'Acompanhei', desc: 'Consigo executar espelhando o vídeo.' },
            4: { title: 'Quase lá', desc: 'Execução fluida, poucas consultas.' },
            5: { title: 'Dominei!', desc: 'Executo com autonomia total.' }
        };

        const labelEl = document.getElementById('fitness-label');
        if (labelEl) {
            labelEl.innerHTML = `<strong>${labels[stars].title}</strong> - ${labels[stars].desc}`;
        }
        
        if (navigator.vibrate) navigator.vibrate(20);
        this._checkFitnessSubmit();
    },

    _checkFitnessSubmit() {
        const btn = document.getElementById('btn-fitness-submit');
        if (btn) {
            btn.disabled = !(this.state.currentFitnessRating > 0 && this.state.currentDifficulty !== null);
        }
    },

    // Retorna snapshot dos troféus desbloqueados no estado atual
    _getTrophySnapshot() {
        const unlocked = new Set();
        if (!this.state.isLoggedIn || !this.state.user) return unlocked;
        const progress = this.state.user.progress || {};
        ['Casal', 'Dama', 'Cavalheiro'].forEach(role => {
            const lessons = progress[role] || [];
            const stars = lessons.reduce((s, l) => s + parseInt(l.stars || 0), 0);
            if (lessons.length >= 1) unlocked.add(`Calouro do Salão (${role})`);
            if (stars >= 45)         unlocked.add(`Rei da Marcação (${role})`);
            if (stars >= 90)         unlocked.add(`Patrimônio Vivo (${role})`);
        });
        const hasShared = this.state.user.achievements && this.state.user.achievements.sharedFirstTime;
        if (hasShared) unlocked.add('Embaixador Junino');
        return unlocked;
    },

    submitFitnessFeedback() {
        if (!this.state.currentFitnessRating || this.state.currentDifficulty === null) return;

        // Snapshot ANTES de salvar — para detectar novos desbloqueios (só importa se logado)
        const before = this._getTrophySnapshot();

        const dance = this.state.currentDance || 'Casal';
        const lessonEntry = {
            title: this.state.lessonTitle,
            stars: this.state.currentFitnessRating,
            difficultyAdequate: this.state.currentDifficulty,
            date: new Date().toISOString()
        };

        if (this.state.isLoggedIn && this.state.user) {
            // Usuário logado: salva no perfil
            if (!this.state.user.progress) this.state.user.progress = {};
            if (!this.state.user.progress[dance]) this.state.user.progress[dance] = [];

            const existingIdx = this.state.user.progress[dance].findIndex(l => l.title === this.state.lessonTitle);
            if (existingIdx !== -1) {
                this.state.user.progress[dance][existingIdx] = { ...this.state.user.progress[dance][existingIdx], ...lessonEntry };
            } else {
                this.state.user.progress[dance].push(lessonEntry);
            }

            const idx = this.state.users.findIndex(u => u.email === this.state.user.email);
            if (idx > -1) {
                this.state.users[idx] = this.state.user;
                localStorage.setItem('sertao_users', JSON.stringify(this.state.users));
                localStorage.setItem('sertao_user', JSON.stringify(this.state.user));
            }
        } else {
            // Visitante: salva progresso local (sem troféus/títulos)
            const guestProgress = JSON.parse(localStorage.getItem('sertao_guest_progress') || '{}');
            if (!guestProgress[dance]) guestProgress[dance] = [];
            const gi = guestProgress[dance].findIndex(l => l.title === this.state.lessonTitle);
            if (gi !== -1) {
                guestProgress[dance][gi] = { ...guestProgress[dance][gi], ...lessonEntry };
            } else {
                guestProgress[dance].push(lessonEntry);
            }
            localStorage.setItem('sertao_guest_progress', JSON.stringify(guestProgress));
        }

        // Update UI logic
        this.renderTrilhas(this.state.currentTrilhaTab || 'casal');
        this.updateHomeResumeCard();
        this._syncProfileUI();

        // Confete sempre ao avaliar uma aula
        playConfetti();
        AudioSystem.sfxConfetti();

        // Detectar troféus recém-desbloqueados — guardar para disparar ao voltar à trilha
        const after = this._getTrophySnapshot();
        const newTrophies = [...after].filter(t => !before.has(t));
        if (newTrophies.length > 0) {
            this.state.pendingTrophyUnlock = newTrophies[0];
        }

        // Switch to Share Step
        const step1 = document.getElementById('fitness-step-eval');
        const step2 = document.getElementById('fitness-step-share');
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'block';
    },

    /* ======================================================
       PREFERÊNCIA MUSICAL
       ====================================================== */

    // Verifica preferência ao iniciar uma aula.
    // Só age se o usuário NUNCA escolheu — exibe o modal uma única vez.
    // Se já escolheu (spotify ou default), não faz nada automaticamente.
    _checkMusicPref() {
        const pref = localStorage.getItem('brm_music_pref');
        if (!pref) {
            // Primeira vez em qualquer aula: mostra modal
            setTimeout(() => this._openMusicPrefModal(), 1200);
        }
        // Preferência já salva → respeita sem abrir nada automaticamente
    },

    _openMusicPrefModal() {
        const modal = document.getElementById('music-pref-modal');
        if (!modal) return;
        const sheet = modal.querySelector('div');
        if (sheet) {
            sheet.style.transition = 'none';
            sheet.style.transform  = 'translateY(100%)';
        }
        modal.style.display = 'flex';
        // setTimeout garante que o browser renderiza display:flex antes de animar
        setTimeout(() => {
            if (sheet) {
                sheet.style.transition = 'transform .35s cubic-bezier(.32,1,.5,1)';
                sheet.style.transform  = 'translateY(0)';
            }
        }, 20);
    },

    _closeMusicPrefModal() {
        const modal = document.getElementById('music-pref-modal');
        if (!modal) return;
        const sheet = modal.firstElementChild;
        if (sheet) {
            sheet.style.transform = 'translateY(100%)';
            setTimeout(() => { modal.style.display = 'none'; }, 360);
        } else {
            modal.style.display = 'none';
        }
    },

    setMusicPref(pref) {
        localStorage.setItem('brm_music_pref', pref);
        this._closeMusicPrefModal();
        this._syncMusicPrefUI();

        if (pref === 'spotify') {
            // Para a música padrão (se estava tocando) e abre o Spotify
            AudioSystem.stopBg();
            this.openSpotifyPlaylist();
        } else {
            // Garante que a música padrão inicie
            AudioSystem.resumeBg();
        }
    },

    dismissMusicPref() {
        // "Decidir depois" — fecha o modal mas não salva preferência.
        // Continuará usando a música padrão até o usuário escolher.
        this._closeMusicPrefModal();
        AudioSystem.resumeBg();
    },

    openSpotifyPlaylist() {
        // Nunca abre nova aba — tudo na mesma janela do navegador.
        const isAndroid = /android/i.test(navigator.userAgent);
        const isIOS     = /iphone|ipad|ipod/i.test(navigator.userAgent);

        if (isAndroid) {
            // Intent URL: abre o app Spotify se instalado; se não, vai à Play Store.
            // Tudo dentro da mesma aba — sem window.open.
            const playlistId = '37i9dQZF1DXbFmIQ7xHuBO';
            window.location.href =
                'intent://playlist/' + playlistId +
                '#Intent;scheme=spotify;package=com.spotify.music;' +
                'S.browser_fallback_url=' + encodeURIComponent(SPOTIFY_PLAYLIST_URL) + ';end';

        } else if (isIOS) {
            // Deep link nativo iOS; se o app não estiver instalado,
            // redireciona para a versão web na mesma aba após 1.5s.
            window.location.href = SPOTIFY_URI;
            setTimeout(() => {
                if (!document.hidden) window.location.href = SPOTIFY_PLAYLIST_URL;
            }, 1500);

        } else {
            // Desktop: mesma aba (não abre nova janela).
            window.location.href = SPOTIFY_PLAYLIST_URL;
        }
    },

    resetMusicPref() {
        localStorage.removeItem('brm_music_pref');
        this._syncMusicPrefUI();
        AudioSystem.resumeBg();
        // Feedback visual rápido no botão
        const btn = document.getElementById('btn-reset-music-pref');
        if (btn) {
            const orig = btn.textContent;
            btn.textContent = 'Redefinido ✓';
            btn.disabled = true;
            setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000);
        }
    },

    _syncMusicPrefUI() {
        const pref  = localStorage.getItem('brm_music_pref') || 'default';
        const lblEl = document.getElementById('lbl-music-pref');
        const btnSp = document.getElementById('sm-spotify');
        const btnDf = document.getElementById('sm-default');
        const rowSp = document.getElementById('row-spotify-open');

        if (lblEl) lblEl.textContent = pref === 'spotify' ? 'Spotify' : 'Música padrão do app';
        if (btnSp) btnSp.classList.toggle('active', pref === 'spotify');
        if (btnDf) btnDf.classList.toggle('active', pref === 'default');
        if (rowSp) rowSp.style.display = pref === 'spotify' ? '' : 'none';
    },

    async shareProgress() {
        // Log achievement
        const alreadyShared = this.state.user && this.state.user.achievements && this.state.user.achievements.sharedFirstTime;

        if (this.state.isLoggedIn && this.state.user) {
            if (!this.state.user.achievements) this.state.user.achievements = {};
            this.state.user.achievements.sharedFirstTime = true;

            // Save to current user and users array
            localStorage.setItem('sertao_user', JSON.stringify(this.state.user));
            const idx = this.state.users.findIndex(u => u.email === this.state.user.email);
            if (idx > -1) {
                this.state.users[idx] = this.state.user;
                localStorage.setItem('sertao_users', JSON.stringify(this.state.users));
            }
        }

        // Troféu Embaixador Junino — primeira vez que compartilha
        if (!alreadyShared) {
            setTimeout(() => playTrophyUnlock('Embaixador Junino'), 1000);
        }

        const shareText = `Acabei de concluir a aula '${this.state.lessonTitle}' no app Brasil em Movimento! Vem dançar também!`;
        const shareUrl = window.location.origin + window.location.pathname;

        try {
            // Baixa a imagem para compartilhar (isso ativa o Instagram Stories no celular)
            const response = await fetch('image/Quadrilha.jpeg');
            const blob = await response.blob();
            const file = new File([blob], 'brasil_em_movimento.jpg', { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Brasil em Movimento',
                    text: shareText,
                    files: [file]
                });
            } else if (navigator.share) {
                // Fallback sem imagem
                await navigator.share({
                    title: 'Brasil em Movimento',
                    text: shareText,
                    url: shareUrl
                });
            } else {
                alert('Progresso salvo para compartilhar!');
            }
        } catch (e) {
            console.error('Compartilhamento cancelado ou falhou:', e);
        } finally {
            this.continueFromFeedback();
        }
    },

    openHistory(danceFilter) {
        this.navigate('history');
        const container = document.getElementById('history-container');
        container.innerHTML = '';

        if (!this.state.isLoggedIn || !this.state.user || !this.state.user.progress) {
            container.innerHTML = `<div style="text-align:center; padding:40px 20px; color:var(--text-light);"><i  class="ti ti-history" style="font-size:48px; opacity:0.5; margin-bottom:12px; display:block;"></i><p>Faça login para ver o seu currículo e salvar as avaliações.</p></div>`;
            return;
        }

        const progress = this.state.user.progress;

        const renderCurriculum = (danceKey, title) => {
            const lessons = this.curriculum[danceKey];
            if (!lessons) return '';

            let html = `<h3 style="margin-bottom: 12px; font-size: 1.1rem; color: var(--primary); text-transform: capitalize;">${title}</h3><div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px;">`;

            const userProgress = progress[danceKey] || [];
            const unlockedCount = userProgress.length;

            lessons.forEach((lesson, index) => {
                const evalData = userProgress.find(p => p.title === lesson.title);

                let iconHtml = '';
                let sideHtml = '';
                let opacity = '1';

                if (evalData) {
                    let starsHtml = '';
                    for (let i = 1; i <= 5; i++) {
                        starsHtml += `<i  class="ti ti-star-filled" style="font-size:16px; color:${i <= evalData.stars ? 'var(--secondary)' : 'rgba(0,0,0,0.15)'}; font-variation-settings: 'FILL' 1;"></i>`;
                    }
                    const dateStr = new Date(evalData.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

                    iconHtml = `<i  class="ti ti-circle-check-filled" style="color: var(--primary);"></i>`;
                    sideHtml = `<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                                    <div style="display: flex; gap: 2px;">${starsHtml}</div>
                                    <span style="font-size: 0.75rem; color: var(--text-light);">${dateStr}</span>
                                </div>`;
                } else if (index <= unlockedCount) {
                    iconHtml = `<i  class="ti ti-play-circle" style="color: var(--primary);"></i>`;
                    sideHtml = `<span style="font-size: 0.75rem; color: var(--primary); padding: 4px 8px; background: rgba(253,94,41,0.09); border-radius: 12px; font-weight: 600;">Pendente</span>`;
                } else {
                    opacity = '0.6';
                    iconHtml = `<i  class="ti ti-lock" style="color: var(--text-light);"></i>`;
                    sideHtml = `<span style="font-size: 0.75rem; color: var(--text-light);">Bloqueado</span>`;
                }

                html += `
                    <div style="background: var(--bg-card); padding: 16px; border-radius: var(--radius); box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center; opacity: ${opacity};">
                        <div style="display: flex; align-items: center; gap: 12px; flex: 1; padding-right: 12px;">
                            ${iconHtml}
                            <div>
                                <h4 style="font-size: 0.95rem; margin-bottom: 2px; line-height: 1.3;">${lesson.title}</h4>
                                <span style="font-size: 0.75rem; color: var(--text-light);">${lesson.duration}</span>
                            </div>
                        </div>
                        ${sideHtml}
                    </div>
                `;
            });
            html += `</div>`;
            return html;
        };

        if (danceFilter) {
            container.innerHTML += renderCurriculum(danceFilter, danceFilter);
        } else {
            container.innerHTML += renderCurriculum('quadrilha', 'Quadrilha');
            container.innerHTML += renderCurriculum('xaxado', 'Xaxado');
        }
    },

    _applyTrophyColor(viewer, type) {
        let color = null; // RGBA
        if (type === 'bronze') color = [0.8, 0.45, 0.15, 1];
        else if (type === 'gold') color = [1.0, 0.84, 0.0, 1];
        else if (type === 'platinum') color = [0.85, 0.85, 0.9, 1];

        const applyColor = () => {
            if (viewer && viewer.model && viewer.model.materials) {
                viewer.model.materials.forEach(mat => {
                    if (mat.pbrMetallicRoughness) {
                        mat.pbrMetallicRoughness.setBaseColorFactor(color);
                        mat.pbrMetallicRoughness.setRoughnessFactor(0.2);
                        mat.pbrMetallicRoughness.setMetallicFactor(1.0);
                    }
                });
            }
        };

        if (viewer.model) applyColor();
        else viewer.addEventListener('load', applyColor, { once: true });
    },

    openTrophyInspection(type, isLocked = false, danceName = '') {
        const modal = document.getElementById('trophy-inspection-modal');
        const img = document.getElementById('fullscreen-trophy-img');
        const titleEl = document.getElementById('fs-trophy-title');
        const descEl = document.getElementById('fs-trophy-desc');

        let title = '';
        let desc = '';
        let imgSrc = '';

        if (type === 'bronze') {
            title = 'Calouro do Salão';
            desc = 'Você deu os primeiros passos. Chegue à metade da trilha para conquistar este troféu.';
            imgSrc = 'image/conquista1.jpeg';
        } else if (type === 'gold') {
            title = 'Rei da Marcação';
            desc = 'O chamado foi feito e você respondeu. Finalize a trilha para entrar no salão dos mestres.';
            imgSrc = 'image/conquista2.jpeg';
        } else if (type === 'plat' || type === 'platinum') {
            title = 'Patrimônio Vivo';
            desc = 'A dança vive em você. Conquiste 5 estrelas em todas as aulas e torne-se parte da tradição.';
            imgSrc = 'image/conquista3.jpeg';
        } else if (type === 'influencer' || type === 'social') {
            title = 'Embaixador Junino';
            desc = 'Você levou o ritmo para além da tela. Compartilhe seu progresso para conquistar este troféu.';
            imgSrc = 'image/conquista4.jpeg';
        }

        if (titleEl) {
            let extraInfo = '';
            if (danceName) extraInfo += ` <span style="font-size: 0.7em; opacity: 0.8;">(${danceName})</span>`;
            if (isLocked) extraInfo += ` <i  class="ti ti-lock" style="font-size: 20px; vertical-align: text-bottom; color: var(--secondary);" title="Bloqueado"></i>`;
            titleEl.innerHTML = title + extraInfo;
        }
        if (descEl) descEl.innerText = desc;
        if (img) img.src = imgSrc;

        if (modal) {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
        }
    },

    closeTrophyInspection() {
        const modal = document.getElementById('trophy-inspection-modal');
        if (modal) {
            modal.classList.remove('open');
            modal.setAttribute('aria-hidden', 'true');
        }
    },

    /* ======================================================
       TRILHA TABS
       ====================================================== */
    switchTrilhaTab(tab) {
        ['cavalheiro', 'dama', 'casal'].forEach(t => {
            const btn = document.getElementById(`ttab-${t}`);
            if (btn) btn.classList.toggle('active', t === tab);
        });

        // Aplica tema de cor conforme a função
        const view = document.getElementById('view-trilhas');
        if (view) {
            view.classList.remove('theme-cavalheiro', 'theme-dama', 'theme-casal');
            view.classList.add(`theme-${tab}`);
        }

        this.renderTrilhas(tab);
    },

    updateJornada(role) {
        const fillEl  = document.getElementById('jornada-fill');
        const dotsEl  = document.getElementById('jornada-dots');
        const trackEl = document.getElementById('jornada-track');
        if (!fillEl) return;

        const rProgress    = this.state.user?.progress?.[role.name] || [];
        const levelNames   = this.curriculum.levels.map(l => l.name);
        const totalLessons = this.curriculum.steps.length * levelNames.length;
        const pct          = Math.min(100, Math.floor((Math.min(rProgress.length, totalLessons) / totalLessons) * 100));

        fillEl.style.width = pct + '%';
        if (trackEl) trackEl.setAttribute('aria-valuenow', pct);

        // Milestone dots — one per step
        if (dotsEl) {
            let dotsHtml = '';
            this.curriculum.steps.forEach((step, sIdx) => {
                const pos       = Math.round(((sIdx + 1) / this.curriculum.steps.length) * 100);
                const isReached = pct >= pos;
                dotsHtml += `<div class="jornada-dot${isReached ? ' reached' : ''}" style="left:${pos}%" title="Passo ${sIdx + 1}: ${step.title}"></div>`;
            });
            dotsEl.innerHTML = dotsHtml;
        }
    },

    renderTrilhas(tab) {
        const container = document.getElementById('trilhas-container');
        if (!container) return;
        
        const role = this.curriculum.roles[tab];
        if(!role) return;

        let html = '';

        this.curriculum.steps.forEach((step, idx) => {
            // Determine if this step is unlocked
            let isUnlocked = idx === 0; // Step 1 is always unlocked
            
            if (idx > 0) {
                const prevStep = this.curriculum.steps[idx - 1];
                const prevStepTitles = this.curriculum.levels.map(l => `${prevStep.title} - ${l.name}`);
                const roleProgress = this.state.user?.progress?.[role.name] || [];
                const hasEvaluatedPrev = roleProgress.some(p => prevStepTitles.includes(p.title) && p.stars > 0);
                isUnlocked = hasEvaluatedPrev;
            }

            // Determine if step is fully completed (all 3 levels evaluated) or just active
            const currentStepTitles = this.curriculum.levels.map(l => `${step.title} - ${l.name}`);
            const roleProgress = this.state.user?.progress?.[role.name] || [];
            const evaluatedCount = currentStepTitles.filter(title => roleProgress.some(p => p.title === title)).length;
            
            const isCompleted = evaluatedCount === 3;
            const isActive = isUnlocked && !isCompleted;
            
            const isNotStarted = isUnlocked && !isCompleted && evaluatedCount === 0;
            const isInProgress = isUnlocked && !isCompleted && evaluatedCount > 0;
            const badgeClass = isCompleted ? 'module-badge--done'
                : (isInProgress ? 'module-badge--active'
                : (isNotStarted ? 'module-badge--pending' : ''));
            const badgeIcon = isCompleted ? 'check'
                : (isInProgress ? 'play_arrow'
                : (isNotStarted ? 'circle-dashed' : 'lock'));
            const borderClass = isCompleted ? 'trilha-completed'
                : (isInProgress ? 'active-module'
                : (isNotStarted ? 'module-not-started' : ''));
            const pct = isUnlocked ? Math.floor(evaluatedCount / 3 * 100) + '%' : '0%';
            const pctNum = isUnlocked ? Math.floor(evaluatedCount / 3 * 100) : 0;

            let lessonsHtml = '';
            this.curriculum.levels.forEach((level, lidx) => {
                const lessonTitle = `${step.title} - ${level.name}`;
                const videoFile = `${role.prefix}-${step.id}-${level.id}.mp4`;
                const isLocked = !isUnlocked;
                
                // Check if this specific lesson was evaluated
                const evalRecord = roleProgress.find(p => p.title === lessonTitle);
                const hasStars = !!evalRecord;
                
                let iconClass = isLocked ? 'locked' : (hasStars ? 'completed' : '');
                let iconName = isLocked ? 'lock' : (hasStars ? 'check_circle' : level.icon);
                
                let lessonMeta = "Vídeo Aula";
                if (hasStars) {
                    const starsHTML = '<span style="color: var(--secondary); font-size: 1rem;">' + '★'.repeat(evalRecord.stars) + '<span style="opacity:0.25;">☆</span>'.repeat(5 - evalRecord.stars) + '</span>';
                    lessonMeta = starsHTML;
                }
                
                lessonsHtml += `
                    <li class="lesson-item ${iconClass}" ${isLocked ? 'aria-disabled="true"' : `onclick="app.startLesson('${lessonTitle}', '${videoFile}', '${role.name}')" role="button" tabindex="0"`}>
                        <i  class="ti ti-${iconName}"></i>
                        <span class="title">${level.name}</span>
                        <span class="lesson-duration">${lessonMeta}</span>
                    </li>
                `;
            });

            html += `
                <div class="trilha-module ${borderClass}">
                    <div class="module-header">
                        <div class="module-title-group">
                            <span class="module-badge ${badgeClass}">
                                <i  class="ti ti-${badgeIcon}"></i>
                            </span>
                            <div>
                                <h3>Passo ${step.id}: ${step.title}</h3>
                                <p class="module-desc">${step.desc}</p>
                            </div>
                        </div>
                        <span class="progress-text">${pct}</span>
                    </div>
                    <div class="progress-bar" role="progressbar" aria-valuenow="${pctNum}" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-fill" style="width: ${pct};"></div>
                    </div>
                    <ul class="lesson-list" role="list">
                        ${lessonsHtml}
                    </ul>
                    ${isActive ? `<button class="btn-primary module-cta" onclick="app.startLesson('${step.title} - ${this.curriculum.levels[0].name}', '${role.prefix}-${step.id}-${this.curriculum.levels[0].id}.mp4', '${role.name}')">
                        <i  class="ti ti-player-play-filled"></i>
                        Continuar Prática
                    </button>` : ''}
                </div>
            `;
        });

        container.innerHTML = html;

        // Update barra de jornada
        this.updateJornada(role);
    },

    /* ======================================================
       QUICK LOGIN (demo account)
       ====================================================== */
    quickLogin() {
        const demo = this.state.users.find(u => u.email === 'ana@sertaodanca.com');
        if (demo) {
            this._loginSuccess(demo);
            this.navigate('profile');
        } else {
            this.openAuthModal('login');
        }
    },

    /* ======================================================
       SETTINGS
       ====================================================== */
    /* setQuality — moved to video player as setVideoQuality() */

    setFontSize(size, btn) {
        document.querySelectorAll('.seg-control [id^="sf-"]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const labels = { small: 'Pequeno', normal: 'Normal', large: 'Grande' };
        const lbl = document.getElementById('lbl-font');
        if (lbl) lbl.innerText = labels[size] || size;
        // Apply to app container
        const sizes = { small: '14px', normal: '16px', large: '18px' };
        document.getElementById('app-container').style.fontSize = sizes[size] || '';
    },

    toggleSetting(key, btn) {
        const isActive = btn.classList.toggle('active');
        btn.setAttribute('aria-checked', String(isActive));
    },

    /* ---- Theme Management ---- */
    setTheme(mode, btn) {
        // Update UI buttons
        document.querySelectorAll('.seg-control [id^="st-"]').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');

        const root = document.documentElement;
        const labels = { system: 'Sistema', light: 'Claro', dark: 'Escuro' };
        const lbl = document.getElementById('lbl-theme');
        if (lbl) lbl.innerText = labels[mode] || mode;

        // Remove manual overrides
        root.classList.remove('dark-theme', 'light-theme');

        if (mode === 'dark') {
            root.classList.add('dark-theme');
        } else if (mode === 'light') {
            root.classList.add('light-theme');
        }
        // 'system' → no class added, CSS media query handles it

        localStorage.setItem('sertao_theme', mode);
    },

    _initTheme() {
        const saved = localStorage.getItem('sertao_theme') || 'system';
        const btn = document.getElementById(`st-${saved}`);
        this.setTheme(saved, btn);
    },

    /* ======================================================
       VIDEO CONTROLS
       ====================================================== */
    toggleMirror() {
        const video = document.getElementById('lesson-video');
        const btn = document.getElementById('btn-mirror');
        if (!video || !btn) return;
        video.classList.toggle('mirrored');
        this.state.isMirrored = !this.state.isMirrored;
        btn.setAttribute('aria-pressed', this.state.isMirrored ? 'true' : 'false');
        if (this.state.isMirrored) {
            btn.classList.add('active');
            btn.querySelector('.material-symbols-rounded').style.color = 'var(--primary)';
        } else {
            btn.classList.remove('active');
            btn.querySelector('.material-symbols-rounded').style.color = '';
        }
        this._showControls();
    },

    toggleLoop() {
        const video = document.getElementById('main-video');
        const btn = document.getElementById('btn-loop');
        if (!video || !btn) return;
        video.loop = !video.loop;
        btn.setAttribute('aria-pressed', video.loop ? 'true' : 'false');
        if (video.loop) {
            btn.classList.add('active');
            btn.querySelector('.material-symbols-rounded').style.color = 'var(--primary)';
        } else {
            btn.classList.remove('active');
            btn.querySelector('.material-symbols-rounded').style.color = 'white';
        }
    },

    toggleTips() {
        // Close quality panel if open
        if (this.state.qualityPanelOpen) this.toggleQualityPanel();
        this.state.tipsOpen = !this.state.tipsOpen;
        const panel = document.getElementById('posture-tips');
        const btn = document.getElementById('btn-tips');
        panel.classList.toggle('show', this.state.tipsOpen);
        panel.setAttribute('aria-hidden', String(!this.state.tipsOpen));
        btn.classList.toggle('active', this.state.tipsOpen);
        btn.setAttribute('aria-pressed', String(this.state.tipsOpen));
        this._showControls();
    },

    /* ======================================================
       AUTH MODAL
       ====================================================== */
    openAuthModal(tab = 'login') {
        const modal = document.getElementById('auth-modal');
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        this.switchAuthTab(tab);
    },

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        this._clearAuthErrors();
    },

    switchAuthTab(tab) {
        document.getElementById('form-login').classList.toggle('hidden', tab !== 'login');
        document.getElementById('form-register').classList.toggle('hidden', tab !== 'register');
        document.getElementById('tab-login').classList.toggle('active', tab === 'login');
        document.getElementById('tab-register').classList.toggle('active', tab === 'register');
        document.getElementById('tab-login').setAttribute('aria-selected', String(tab === 'login'));
        document.getElementById('tab-register').setAttribute('aria-selected', String(tab === 'register'));
        this._clearAuthErrors();
    },

    togglePassword(inputId, btn) {
        const input = document.getElementById(inputId);
        const icon = btn.querySelector('.material-symbols-rounded');
        if (input.type === 'password') {
            input.type = 'text';
            icon.innerText = 'visibility_off';
        } else {
            input.type = 'password';
            icon.innerText = 'visibility';
        }
    },

    /* ======================================================
       AUTH LOGIC
       ====================================================== */
    _handleLogin() {
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        if (!email || !password) {
            errorEl.innerText = 'Preencha todos os campos.';
            return;
        }

        const found = this.state.users.find(u => u.email === email && u.password === password);
        if (!found) {
            errorEl.innerText = 'E-mail ou senha incorretos.';
            return;
        }

        this._loginSuccess(found);
    },

    _handleRegister() {
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const password = document.getElementById('reg-password').value;
        const errorEl = document.getElementById('reg-error');

        if (!name || !email || !password) {
            errorEl.innerText = 'Preencha todos os campos.';
            return;
        }
        if (!email.includes('@')) {
            errorEl.innerText = 'Informe um e-mail válido.';
            return;
        }
        if (password.length < 6) {
            errorEl.innerText = 'A senha deve ter ao menos 6 caracteres.';
            return;
        }
        if (this.state.users.find(u => u.email === email)) {
            errorEl.innerText = 'Este e-mail já está cadastrado.';
            return;
        }

        const newUser = { name, email, password, progress: {}, achievements: {} };

        // Migra progresso feito como visitante para a conta recém-criada
        const guestProgress = JSON.parse(localStorage.getItem('sertao_guest_progress') || '{}');
        if (Object.keys(guestProgress).length > 0) {
            newUser.progress = guestProgress;
            localStorage.removeItem('sertao_guest_progress');
        }

        this.state.users.push(newUser);
        localStorage.setItem('sertao_users', JSON.stringify(this.state.users));

        this._loginSuccess(newUser);
    },

    _loginSuccess(user) {
        this.state.user = user;
        this.state.isLoggedIn = true;
        localStorage.setItem('sertao_user', JSON.stringify(user));
        this.closeAuthModal();
        this._syncProfileUI();
        // Reset form fields
        document.getElementById('form-login').reset();
        document.getElementById('form-register').reset();
    },

    logout() {
        this.state.user = null;
        this.state.isLoggedIn = false;
        localStorage.removeItem('sertao_user');
        this._syncProfileUI();
    },

    quickEducatorLogin() {
        const prof = this.state.users.find(u => u.role === 'educator');
        if (prof) this._loginSuccess(prof);
    },

    /* ---- Keep profile UI in sync with auth state ---- */
    _syncProfileUI() {
        const guestEl = document.getElementById('profile-guest');
        const loggedEl = document.getElementById('profile-logged-in');
        const educatorEl = document.getElementById('profile-educator-in');
        const logoutBtn = document.getElementById('btn-logout');
        const settingsBtn = document.getElementById('btn-settings');
        const headerEl = document.getElementById('profile-header-title');

        if (this.state.isLoggedIn && this.state.user) {
            guestEl.style.display = 'none';
            logoutBtn.style.display = 'flex';
            if (settingsBtn) settingsBtn.style.display = 'flex';

            if (this.state.user.role === 'educator') {
                if (loggedEl) loggedEl.style.display = 'none';
                if (educatorEl) educatorEl.style.display = 'flex';
                if (headerEl) headerEl.innerText = `Dashboard do Mestre`;

                const edName = document.getElementById('educator-display-name');
                const edEmail = document.getElementById('educator-display-email');
                if (edName) edName.innerText = this.state.user.name;
                if (edEmail) edEmail.innerText = this.state.user.email;
            } else {
                if (loggedEl) loggedEl.style.display = 'flex';
                if (educatorEl) educatorEl.style.display = 'none';
                if (headerEl) headerEl.innerText = `Olá, ${this.state.user.name.split(' ')[0]}! 👋`;

                const stuName = document.getElementById('user-display-name');
                const stuEmail = document.getElementById('user-display-email');
                if (stuName) stuName.innerText = this.state.user.name;
                if (stuEmail) stuEmail.innerText = this.state.user.email;
                
                // Calc real progress for Student
                let totalLessonsEvaluated = 0;
                let totalStars = 0;
                if (this.state.user.progress) {
                    Object.keys(this.state.user.progress).forEach(danceKey => {
                        const lessons = this.state.user.progress[danceKey];
                        totalLessonsEvaluated += lessons.length;
                        lessons.forEach(l => {
                            totalStars += parseInt(l.stars || 0);
                        });
                    });
                }
                
                const calculatedLevel = Math.floor(totalLessonsEvaluated / 3) + 1;
                
                const lvlEl = document.getElementById('user-level');
                const lessonsEl = document.getElementById('stat-lessons');
                const starsEl = document.getElementById('stat-stars');
                
                if (lvlEl) lvlEl.innerText = 'Lvl ' + calculatedLevel;
                if (lessonsEl) lessonsEl.innerText = totalLessonsEvaluated;
                if (starsEl) starsEl.innerText = totalStars;
                
                const getTitleForLessons = (count) => {
                    if (count < 9) return 'Iniciante do Salão';
                    if (count < 18) return 'Pé de Valsa';
                    if (count < 36) return 'Dançarino(a) de Fogo';
                    if (count < 54) return 'Mestre(a) do Terreiro';
                    return 'Lenda do Sertão';
                };
                
                const titleBadgeEl = document.getElementById('user-title-badge');
                if (titleBadgeEl) titleBadgeEl.innerText = getTitleForLessons(totalLessonsEvaluated);
                
                // Render Titles Gallery
                const titlesContainer = document.getElementById('profile-titles');
                if (titlesContainer) {
                    const allTitles = [
                        { name: 'Iniciante do Salão', req: 0,  icon: 'ti-music',        color: 'orange' },
                        { name: 'Pé de Valsa',        req: 9,  icon: 'ti-shoe',          color: 'yellow' },
                        { name: 'Dançarino(a) de Fogo', req: 18, icon: 'ti-flame-filled', color: 'pink'   },
                        { name: 'Mestre(a) do Terreiro', req: 36, icon: 'ti-star-filled', color: 'blue'   },
                        { name: 'Lenda do Sertão',    req: 54, icon: 'ti-crown',         color: 'maroon' },
                    ];
                    let titlesHtml = '';
                    allTitles.forEach(t => {
                        const unlocked = totalLessonsEvaluated >= t.req;
                        const chipClass = unlocked
                            ? `title-chip title-chip--${t.color}`
                            : 'title-chip title-chip--locked';
                        titlesHtml += `<div class="${chipClass}"><i class="ti ${t.icon}"></i>${t.name}</div>`;
                    });
                    titlesContainer.innerHTML = titlesHtml;
                }

                this.updateHomeResumeCard();

                // Dynamic Progress Update & Trophies Gallery Unified
                const trophiesAll = document.getElementById('trophies-all');
                let trophiesHtml = '';

                // ── Helpers ──────────────────────────────────────────
                const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

                // Collect per-role data
                const roles = ['Casal', 'Dama', 'Cavalheiro'];
                const roleData = roles.map(r => {
                    const lessons   = this.state.user.progress?.[r] ?? [];
                    const doneCount = lessons.length;
                    let stars = 0;
                    lessons.forEach(l => { stars += parseInt(l.stars || 0); });
                    // also update progress bars in trilha view
                    const id = r.toLowerCase();
                    const pctEl = document.getElementById(`pct-${id}`);
                    const barEl = document.getElementById(`bar-${id}`);
                    const pct = Math.round((doneCount / 18) * 100);
                    if (pctEl) pctEl.innerText = `${pct}%`;
                    if (barEl) { barEl.style.width = `${pct}%`; barEl.parentElement.setAttribute('aria-valuenow', pct); }
                    return { r, doneCount, stars };
                });

                // Count unlocked per trophy type
                const bronzeUnlocked = roleData.filter(d => d.doneCount >= 1).length;
                const goldUnlocked   = roleData.filter(d => d.stars >= 45).length;
                const platUnlocked   = roleData.filter(d => d.stars >= 90).length;
                const hasShared      = !!(this.state.user.achievements?.sharedFirstTime);

                const typeToImage = {
                    'social': 'conquista4.jpeg',
                    'bronze': 'conquista1.jpeg',
                    'gold':   'conquista2.jpeg',
                    'plat':   'conquista3.jpeg'
                };

                // Progress % for stacked gold/plat badges = best-performing role
                const bestGoldPct = Math.min(Math.max(...roleData.map(d => (d.stars / 45) * 100)), 100);
                const bestPlatPct = Math.min(Math.max(...roleData.map(d => (d.stars / 90) * 100)), 100);

                let unlockedCount = (hasShared ? 1 : 0) + bronzeUnlocked + goldUnlocked + platUnlocked;

                // ── Stacked badge builder ─────────────────────────────
                // unlockedN = how many of the 3 roles have this trophy
                const makeStackedBadge = (type, emoji, name, unlockedN, progPct) => {
                    const nLayers  = Math.min(unlockedN, 1); // show stack only when >= 1
                    const locked   = unlockedN === 0;
                    const pct      = Math.round(Math.min(progPct, 100));
                    const dots     = roles.map((_, i) =>
                        `<span class="trophy-role-dot${i < unlockedN ? ' done' : ''}"></span>`
                    ).join('');
                    const layers   = unlockedN >= 1
                        ? `<div class="trophy-badge-layer trophy-badge-layer--2"></div>
                           <div class="trophy-badge-layer trophy-badge-layer--3"></div>`
                        : '';
                    const countPip = unlockedN > 0
                        ? `<div class="trophy-badge-count">${unlockedN}/3</div>` : '';

                    return `
                    <div class="trophy-card" onclick="app.openTrophyInspection('${type}')">
                        <div class="trophy-badge trophy-badge--${type}${locked ? ' trophy-badge--locked' : ''}">
                            ${layers}
                            <div class="trophy-badge-outer">
                                <div class="trophy-badge-inner">
                                    <img src="image/${typeToImage[type]}" class="trophy-img" alt="${name}">
                                    ${locked ? '<div class="trophy-badge-lock-ico"><i class="ti ti-lock" aria-hidden="true"></i></div>' : ''}
                                </div>
                            </div>
                            ${countPip}
                        </div>
                        <h4>${name}</h4>
                        <div class="trophy-role-dots">${dots}</div>
                        <div class="trophy-prog" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
                            <div class="trophy-prog-fill trophy-prog-fill--${type}" style="width:${pct}%"></div>
                        </div>
                    </div>`;
                };

                // ── Single badge (social) ─────────────────────────────
                const makeSingleBadge = (type, emoji, name, isUnlocked) => {
                    const locked = !isUnlocked;
                    return `
                    <div class="trophy-card" onclick="app.openTrophyInspection('influencer')">
                        <div class="trophy-badge trophy-badge--${type}${locked ? ' trophy-badge--locked' : ''}">
                            <div class="trophy-badge-outer">
                                <div class="trophy-badge-inner">
                                    <img src="image/${typeToImage[type]}" class="trophy-img" alt="${name}">
                                    ${locked ? '<div class="trophy-badge-lock-ico"><i class="ti ti-lock" aria-hidden="true"></i></div>' : ''}
                                </div>
                            </div>
                        </div>
                        <h4>${name}</h4>
                        <span class="trophy-card-sub" style="font-size:.58rem;opacity:.5;color:var(--text-main)">1 share</span>
                        <div class="trophy-prog" role="progressbar" aria-valuenow="${isUnlocked?100:0}" aria-valuemin="0" aria-valuemax="100">
                            <div class="trophy-prog-fill trophy-prog-fill--${type}" style="width:${isUnlocked?100:0}%"></div>
                        </div>
                    </div>`;
                };

                // ── Section header ────────────────────────────────────
                const sectionHeader = (label, chip, soon = false) => `
                    <div class="trophy-section-header">
                        <span class="trophy-section-label">${label}</span>
                        <div class="trophy-section-line"></div>
                        <span class="trophy-section-chip${soon ? ' trophy-section-chip--soon' : ''}">${chip}</span>
                    </div>`;

                // ── Coming-soon row (3 phantom badges) ───────────────
                const soonRow = () => `
                    <div class="trophy-soon-row" aria-hidden="true">
                        <div class="trophy-soon-badge"></div>
                        <div class="trophy-soon-badge"></div>
                        <div class="trophy-soon-badge"></div>
                        <div class="trophy-soon-badge"></div>
                    </div>`;

                // ── Build HTML ────────────────────────────────────────
                // Quadrilha section
                trophiesHtml += sectionHeader('Quadrilha', 'disponível');
                trophiesHtml += makeSingleBadge('social', '🌸', 'Embaixador Junino', hasShared);
                trophiesHtml += makeStackedBadge('bronze', '👟', 'Calouro do Salão', bronzeUnlocked, bronzeUnlocked > 0 ? 100 : 0);
                trophiesHtml += makeStackedBadge('gold',   '🪗', 'Rei da Marcação',  goldUnlocked,   bestGoldPct);
                trophiesHtml += makeStackedBadge('plat',   '💃', 'Patrimônio Vivo',  platUnlocked,   bestPlatPct);

                // Coming soon sections
                trophiesHtml += sectionHeader('Afro', 'em breve', true) + soonRow();
                trophiesHtml += sectionHeader('Hip-Hop', 'em breve', true) + soonRow();
                trophiesHtml += sectionHeader('Gaúcha', 'em breve', true) + soonRow();

                if (trophiesAll) trophiesAll.innerHTML = trophiesHtml;

                // Update count in header
                const countEl = document.getElementById('trophies-unlocked-count');
                if (countEl) countEl.textContent = unlockedCount;
            }
        } else {
            guestEl.style.display = 'flex';
            if (loggedEl) loggedEl.style.display = 'none';
            if (educatorEl) educatorEl.style.display = 'none';
            logoutBtn.style.display = 'none';
            if (settingsBtn) settingsBtn.style.display = 'none';
            if (headerEl) headerEl.innerText = 'Meu Perfil';
        }
    },

    _clearAuthErrors() {
        document.getElementById('login-error').innerText = '';
        document.getElementById('reg-error').innerText = '';
    },

    updateHomeResumeCard() {
        const card = document.getElementById('resume-card');
        const tagEl = document.getElementById('resume-tag');
        const titleEl = document.getElementById('resume-title');
        const pctEl = document.getElementById('resume-pct');
        const fillEl = document.getElementById('resume-progress-fill');
        const timeEl = document.getElementById('resume-time');
        
        if (!card || !titleEl) return;

        if (!this.state.isLoggedIn || !this.state.user || !this.state.user.progress) {
            const headingEl = document.getElementById('resume-section-title');
            if (headingEl) headingEl.innerText = 'Sua jornada começa aqui';
            if (tagEl) tagEl.innerText = 'QUADRILHA - CASAL';
            if (titleEl) titleEl.innerText = 'Marcação Básica';
            if (pctEl) pctEl.innerText = '0% concluído';
            if (fillEl) fillEl.style.width = '0%';
            if (timeEl) timeEl.innerText = 'Comece agora';
            card.onclick = () => this.navigate('trilhas');
            return;
        }

        // Find the role with the most recent progress
        let lastDance = null;
        let lastLesson = null;
        let highestDate = 0;

        Object.keys(this.state.user.progress).forEach(danceKey => {
            this.state.user.progress[danceKey].forEach(lesson => {
                const d = new Date(lesson.date).getTime();
                if (d > highestDate) {
                    highestDate = d;
                    lastDance = danceKey;
                    lastLesson = lesson;
                }
            });
        });

        if (!lastDance) {
            // Tem conta mas nenhuma aula concluída ainda
            const headingEl = document.getElementById('resume-section-title');
            if (headingEl) headingEl.innerText = 'Sua jornada começa aqui';
            if (tagEl) tagEl.innerText = 'QUADRILHA - CASAL';
            if (titleEl) titleEl.innerText = 'Marcação Básica';
            if (pctEl) pctEl.innerText = '0% concluído';
            if (fillEl) fillEl.style.width = '0%';
            if (timeEl) timeEl.innerText = 'Comece agora';
            card.onclick = () => this.navigate('trilhas');
            return;
        }

        const tabName = lastDance.toLowerCase();
        const roleProgress = this.state.user.progress[lastDance] || [];
        const evaluatedCount = roleProgress.length;
        const totalLessons = 18; // 6 steps × 3 levels per role
        const pct = Math.min(100, Math.round((evaluatedCount / totalLessons) * 100));
        
        // Find next unevaluated lesson for this role
        let nextLessonTitle = lastLesson.title;
        const evaluatedTitles = roleProgress.map(p => p.title);
        
        for (const step of this.curriculum.steps) {
            for (const level of this.curriculum.levels) {
                const title = `${step.title} - ${level.name}`;
                if (!evaluatedTitles.includes(title)) {
                    nextLessonTitle = title;
                    break;
                }
            }
            if (nextLessonTitle !== lastLesson.title) break;
        }

        const headingEl = document.getElementById('resume-section-title');
        if (headingEl) headingEl.innerText = 'Continue de onde parou';
        if (tagEl) tagEl.innerText = `QUADRILHA - ${lastDance.toUpperCase()}`;
        if (titleEl) titleEl.innerText = nextLessonTitle;
        if (pctEl) pctEl.innerText = `${pct}% concluído`;
        if (fillEl) fillEl.style.width = pct + '%';
        if (timeEl) timeEl.innerText = `${evaluatedCount} de ${totalLessons} aulas`;
        
        card.onclick = () => {
            this.navigate('trilhas');
            this.switchTrilhaTab(tabName);
        };
    }
};

/* ======================================================
   BOOTSTRAP
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => app.init());

