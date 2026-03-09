/**
 * app.js - Motor Lógico Optimizado
 * Diseño Minimalista - Cero Dependencias - Vanilla JS Moderno
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ESTADOS Y REFERENCIAS AL DOM
    // ==========================================
    const state = {
        themes: Object.keys(window.EXERCISES_DATA || {}).sort((a,b) => Number(a) - Number(b)),
        currentThemeId: null,
        currentExercise: null,
        currentStep: -1,
        proofs: { 
            ...(window.TEMA1_PROOFS || {}), 
            ...(window.TEMA2_PROOFS || {}), 
            ...(window.TEMA3_PROOFS || {}), 
            ...(window.TEMA4_PROOFS || {}), 
            ...(window.TEMA5_PROOFS || {}), 
            ...(window.TEMA6_PROOFS || {})
        }
    };

    const DOM = {
        screens: {
            intro: document.getElementById('intro-screen'),
            mainApp: document.getElementById('main-app')
        },
        views: {
            exercises: document.getElementById('exercises-view'),
            isabelle: document.getElementById('isabelle-view'),
            wiki: document.getElementById('wiki-view')
        },
        intro: {
            text: document.getElementById('intro-text'),
            sub: document.getElementById('sub-text'),
            btn: document.getElementById('logic-btn'),
            reveal: document.getElementById('intro-reveal')
        },
        globalHeader: document.getElementById('global-header'),
        globalBack: document.getElementById('global-back'),
        themeToggle: document.getElementById('theme-toggle'),
        themeNav: document.getElementById('theme-nav'),
        exercisesGrid: document.getElementById('exercises-grid'),
        currentThemeTitle: document.getElementById('current-theme-title'),
        isabelle: {
            title: document.getElementById('exercise-title'),
            btnBack: document.getElementById('back-btn'),
            codeContainer: document.getElementById('code-container'),
            explanation: document.getElementById('explanation-text'),
            hypotheses: document.getElementById('active-hypotheses'),
            progress: document.getElementById('progress-bar'),
            btnPrev: document.getElementById('btn-prev'),
            btnNext: document.getElementById('btn-next'),
            codeScroll: document.getElementById('code-scroll')
        }
    };

    // ==========================================
    // THEME TOGGLE (Modo Oscuro/Claro)
    // ==========================================
    function initTheme() {
        // Mirar la caché
        const isDark = localStorage.getItem('pepeweb_theme') === 'dark';
        if (isDark) {
            document.body.classList.add('dark-mode');
            DOM.themeToggle.checked = true;
        }

        DOM.themeToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('pepeweb_theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('pepeweb_theme', 'light');
            }
        });
    }
    initTheme();

    // ==========================================
    // CUSTOM CURSOR (Contraste dinámico)
    // ==========================================
    function initCustomCursor() {
        const cursor = document.createElement('div');
        cursor.id = 'custom-cursor';
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        document.body.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (target.closest('button, a, input, .wiki-subsummary, .exercise-card, .light-switch, .icon-btn')) {
                cursor.classList.add('hover');
            }
        });
        
        document.body.addEventListener('mouseout', (e) => {
            const target = e.target;
            if (target.closest('button, a, input, .wiki-subsummary, .exercise-card, .light-switch, .icon-btn')) {
                cursor.classList.remove('hover');
            }
        });
    }

    if (window.matchMedia("(pointer: fine)").matches) {
        initCustomCursor();
    }


    // ==========================================
    // 1. ANIMACIONES NATIVAS (Web Animations API)
    // ==========================================
    
    async function playIntroSequence() {
        // Fase 1: Aparece @pepelluba
        await DOM.intro.text.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], { duration: 1000, easing: 'ease-out', fill: 'forwards' }).finished;

        // Breve pausa extra para notar el centrado
        await new Promise(r => setTimeout(r, 300));

        // Fase 2: Transición de Lógica Matemática y subtítulo
        DOM.intro.reveal.classList.remove('hidden');
        
        DOM.intro.reveal.animate([
            { opacity: 0, transform: 'translateY(-20px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 1000, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' });
    }

    async function transitionToApp(withAnimation = true) {
        if (withAnimation) {
            // Animación de salida de la intro
            const exitAnim = DOM.screens.intro.animate([
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(1.1)' }
            ], { 
                duration: 600, 
                easing: 'ease-in', 
                fill: 'forwards' 
            });
            await exitAnim.finished;
            window.location.hash = '#/logica'; // Actualiza URL
        }
        
        DOM.screens.intro.classList.replace('active', 'hidden');
        DOM.screens.mainApp.classList.replace('hidden', 'active');
        DOM.globalHeader.classList.remove('hidden-element');
        
        if (withAnimation) {
            // Fade in suave para la app
            DOM.screens.mainApp.animate([
                { opacity: 0, transform: 'translateX(-20px)' },
                { opacity: 1, transform: 'translateX(0)' }
            ], { duration: 600, easing: 'ease-out', fill: 'forwards' });
        } 
        
        renderSidebar();
    }

    DOM.intro.btn.addEventListener('click', () => transitionToApp(true));

    function checkInitialRoute() {
        if (window.location.hash === '#/logica') {
            transitionToApp(false);
            DOM.intro.reveal.classList.remove('hidden');
            DOM.intro.reveal.style.opacity = '1';
            DOM.intro.reveal.style.transform = 'translateY(0)';
            DOM.intro.text.style.opacity = '1';
        } else {
            playIntroSequence();
        }
    }

    // Navegar atrás al inicio
    DOM.globalBack.addEventListener('click', () => {
        window.location.hash = '';
        
        // Quitar la clase de carga directa si estaba puesta
        document.documentElement.classList.remove('direct-logica');

        DOM.globalHeader.classList.add('hidden-element');
        DOM.screens.mainApp.classList.replace('active', 'hidden');
        DOM.screens.intro.classList.replace('hidden', 'active');
        DOM.intro.reveal.classList.remove('hidden');
        
        DOM.screens.intro.animate([
            { opacity: 0, transform: 'scale(1.1)' },
            { opacity: 1, transform: 'scale(1)' }
        ], { duration: 600, easing: 'ease-out', fill: 'forwards' });
    });


    // ==========================================
    // 2. MAIN APP: SIDEBAR Y GRID
    // ==========================================

    function renderSidebar() {
        const frag = document.createDocumentFragment();

        // 1. Botón Guía/Wiki (Con Long Press para Admin Panel)
        const wikiBtn = document.createElement('button');
        wikiBtn.className = 'theme-btn active';
        wikiBtn.textContent = 'Guía / Wiki';

        let adminLongPressTimer;
        let isAdminFired = false;
        
        // Empezar a contar
        wikiBtn.addEventListener('pointerdown', (e) => {
            // Solo click primario
            if (e.button !== 0) return;
            isAdminFired = false;
            adminLongPressTimer = setTimeout(() => {
                isAdminFired = true;
                openAdminView();
            }, 3000); // 3 segundos
        });

        const cancelLongPress = () => clearTimeout(adminLongPressTimer);
        wikiBtn.addEventListener('pointerup', cancelLongPress);
        wikiBtn.addEventListener('pointerleave', cancelLongPress);
        
        wikiBtn.onclick = (e) => {
            cancelLongPress();
            if (isAdminFired) {
                // Si se acaba de activar el modo admin, evitar abrir la wiki
                e.preventDefault();
                return;
            }
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            wikiBtn.classList.add('active');
            state.currentThemeId = null;
            openWikiView();
        };
        frag.appendChild(wikiBtn);

        // 2. Lista de Temas
        state.themes.forEach((themeId) => {
            const btn = document.createElement('button');
            btn.className = 'theme-btn';
            btn.textContent = `Tema ${themeId}`;
            btn.onclick = () => {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.currentThemeId = themeId;
                renderThemeEjercicios();
            };
            frag.appendChild(btn);
        });
        
        DOM.themeNav.innerHTML = '';
        DOM.themeNav.appendChild(frag);
        
        // Iniciar en la Guía por defecto
        openWikiView();
    }

    function openWikiView() {
        if (DOM.views.exercises.classList.contains('active-view')) DOM.views.exercises.classList.replace('active-view', 'hidden-view');
        if (DOM.views.isabelle.classList.contains('active-view')) DOM.views.isabelle.classList.replace('active-view', 'hidden-view');
        
        const adminView = document.getElementById('admin-view');
        if (adminView && adminView.classList.contains('active-view')) adminView.classList.replace('active-view', 'hidden-view');
        
        DOM.views.wiki.classList.remove('hidden-view');
        DOM.views.wiki.classList.add('active-view');

        DOM.views.wiki.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 400, easing: 'ease-out' });
    }

    function renderThemeEjercicios() {
        if (!state.currentThemeId) return;
        
        if (DOM.views.wiki.classList.contains('active-view')) DOM.views.wiki.classList.replace('active-view', 'hidden-view');
        if (DOM.views.isabelle.classList.contains('active-view')) DOM.views.isabelle.classList.replace('active-view', 'hidden-view');
        
        const adminView = document.getElementById('admin-view');
        if (adminView && adminView.classList.contains('active-view')) adminView.classList.replace('active-view', 'hidden-view');
        
        DOM.views.exercises.classList.remove('hidden-view');
        DOM.views.exercises.classList.add('active-view');

        const themeData = window.EXERCISES_DATA[state.currentThemeId];
        DOM.currentThemeTitle.textContent = themeData.title || `Tema ${state.currentThemeId}`;
        
        const frag = document.createDocumentFragment();
        
        // Ordenar ejercicios
        let exEntries = Object.entries(themeData.exercises).sort((a, b) => {
            return parseInt(a[0].replace('exe', '')) - parseInt(b[0].replace('exe', ''));
        });

        exEntries.forEach(([exKey, exData]) => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            const num = exKey.replace('exe', '');
            
            card.innerHTML = `
                <div class="card-content">
                    <h4>${num.padStart(2, '0')}</h4>
                </div>
            `;
            
            // Animación Holográfica 3D (movimiento del ratón)
            card.addEventListener("pointermove", (e) => {
                const rect = card.getBoundingClientRect();
                const hw = rect.width / 2;
                const hh = rect.height / 2;
                const ratioX = (e.clientX - (rect.x + hw)) / hw;
                const ratioY = (e.clientY - (rect.y + hh)) / hh;
                // Guardamos los ratios como CSS Variables locales al card
                card.style.setProperty("--ratio-x", ratioX);
                card.style.setProperty("--ratio-y", ratioY);
                card.style.setProperty("--correction", "0%");
            });
            
            card.addEventListener("pointerleave", () => {
                // Resteable al estado reposo (sin rotación)
                card.style.setProperty("--ratio-x", 0);
                card.style.setProperty("--ratio-y", 0);
                card.style.setProperty("--correction", "100%");
            });
            
            card.onclick = () => openIsabelleView(exData);
            frag.appendChild(card);
        });

        DOM.exercisesGrid.innerHTML = '';
        DOM.exercisesGrid.appendChild(frag);
        
        // Pequeño fade in de los ejercicios
        DOM.exercisesGrid.animate([
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 400, easing: 'ease-out' });
    }

    // ==========================================
    // 3. VISTA ISABELLE (MOTOR)
    // ==========================================

    function openIsabelleView(exMetadata) {
        const proofId = exMetadata.name;
        const proofData = state.proofs[proofId];

        if (!proofData) {
            console.warn("Prueba no encontrada:", proofId);
            return;
        }

        state.currentExercise = proofData;
        state.currentStep = -1;

        DOM.isabelle.title.textContent = `${exMetadata.title} - ${exMetadata.defaultMethod}`;
        DOM.isabelle.codeContainer.innerHTML = '';
        DOM.isabelle.explanation.innerHTML = '<span style="color:var(--c-text-muted);font-style:italic">Presiona avanzar para iniciar.</span>';
        DOM.isabelle.hypotheses.innerHTML = '';
        DOM.isabelle.progress.style.width = '0%';
        DOM.isabelle.btnPrev.disabled = true;

        DOM.views.exercises.classList.replace('active-view', 'hidden-view');
        DOM.views.wiki.classList.replace('active-view', 'hidden-view');
        
        const adminView = document.getElementById('admin-view');
        if (adminView && adminView.classList.contains('active-view')) adminView.classList.replace('active-view', 'hidden-view');

        DOM.views.isabelle.classList.replace('hidden-view', 'active-view');
        
        // Reset botones de icono
        DOM.isabelle.btnNext.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
    }

    DOM.isabelle.btnBack.addEventListener('click', () => {
        DOM.views.isabelle.classList.replace('active-view', 'hidden-view');
        DOM.views.exercises.classList.replace('hidden-view', 'active-view');
        state.currentExercise = null;
    });

    // Highlighter Ultra-ligero
    function highlightSyntax(text, highlights = []) {
        const keywords = /\b(lemma|assumes|shows|proof|assume|hence|from|with|show|qed|have|by|auto|next|rule|contradiction)\b/g;
        let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        html = html.replace(keywords, '<span class="keyword">$1</span>');
        
        highlights.forEach(word => {
            const regex = new RegExp(`\\b(${word})\\b`, 'g');
            html = html.replace(regex, `<span class="highlight">${word}</span>`);
        });
        return html;
    }

    function renderStep() {
        const stepIdx = state.currentStep;
        if (!state.currentExercise || stepIdx < 0) return;

        const steps = state.currentExercise.steps;
        const currentData = steps[stepIdx];

        // Usar Fragment para DOM ultrarrápido (solo inyectar nueva línea si avanza, pero por sencillez de estructura reconstruimos limpio)
        // Para máxima optimización en steps grandes se haría append, pero el DOM aquí es muy pequeño
        const frag = document.createDocumentFragment();
        
        for (let i = 0; i <= stepIdx; i++) {
            const lines = steps[i].code.split('\n');
            lines.forEach((line) => {
                const div = document.createElement('div');
                div.className = 'isabelle-item visible';
                if (i === stepIdx) div.classList.add('active-line');
                
                div.innerHTML = highlightSyntax(line, i === stepIdx ? steps[i].highlights : []);
                frag.appendChild(div);
            });
        }

        DOM.isabelle.codeContainer.innerHTML = '';
        DOM.isabelle.codeContainer.appendChild(frag);

        // AutoScroll Nativo inmediato
        setTimeout(() => {
            DOM.isabelle.codeScroll.scrollTo({
                top: DOM.isabelle.codeScroll.scrollHeight,
                behavior: 'smooth'
            });
        }, 30);

        // Actualizar textos
        DOM.isabelle.explanation.innerHTML = currentData.explanation;
        
        // Hipotéis
        if (currentData.activeHyp && currentData.activeHyp.length > 0) {
            DOM.isabelle.hypotheses.innerHTML = currentData.activeHyp.map(hyp => 
                `<div class="hypothesis-box">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-text-muted)" stroke-width="2" style="flex-shrink:0;margin-top:2px"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                    <span>${hyp}</span>
                </div>`
            ).join('');
        } else {
            DOM.isabelle.hypotheses.innerHTML = '<div style="color:var(--c-text-muted);font-style:italic">Sin hipótesis activas.</div>';
        }

        // Barra de progreso y botones
        const pct = ((stepIdx + 1) / steps.length) * 100;
        DOM.isabelle.progress.style.width = `${pct}%`;
        
        DOM.isabelle.btnPrev.disabled = (stepIdx === -1);
        
        if (stepIdx === steps.length - 1) {
            // Fin de la prueba
            DOM.isabelle.btnNext.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
        } else {
            DOM.isabelle.btnNext.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
        }
    }

    DOM.isabelle.btnNext.addEventListener('click', () => {
        if (!state.currentExercise) return;
        if (state.currentStep < state.currentExercise.steps.length - 1) {
            state.currentStep++;
            renderStep();
        }
    });

    DOM.isabelle.btnPrev.addEventListener('click', () => {
        if (!state.currentExercise) return;
        if (state.currentStep > 0) {
            state.currentStep--;
            renderStep();
        } else if (state.currentStep === 0) {
            // Reset
            state.currentStep = -1;
            DOM.isabelle.codeContainer.innerHTML = '';
            DOM.isabelle.explanation.innerHTML = '<span style="color:var(--c-text-muted);font-style:italic">Prueba reiniciada.</span>';
            DOM.isabelle.hypotheses.innerHTML = '';
            DOM.isabelle.progress.style.width = '0%';
            DOM.isabelle.btnPrev.disabled = true;
        }
    });

    // ==========================================
    // 4. ADMIN PANEL (GitHub API)
    // ==========================================
    const adminDOM = {
        view: document.getElementById('admin-view'),
        closeBtn: document.getElementById('admin-close-btn'),
        loginBox: document.getElementById('admin-login-box'),
        dashboard: document.getElementById('admin-dashboard'),
        ghUser: document.getElementById('gh-user'),
        ghRepo: document.getElementById('gh-repo'),
        ghToken: document.getElementById('gh-token'),
        ghRemember: document.getElementById('gh-remember'),
        loginBtn: document.getElementById('admin-login-btn'),
        authMsg: document.getElementById('admin-auth-msg'),
        
        connectedUser: document.getElementById('admin-connected-user'),
        fileSelect: document.getElementById('admin-file-select'),
        codeInput: document.getElementById('admin-code-input'),
        pushBtn: document.getElementById('admin-push-btn'),
        pushMsg: document.getElementById('admin-push-msg')
    };

    function openAdminView() {
        if (!adminDOM.view) return;
        
        if (DOM.views.exercises.classList.contains('active-view')) DOM.views.exercises.classList.replace('active-view', 'hidden-view');
        if (DOM.views.isabelle.classList.contains('active-view')) DOM.views.isabelle.classList.replace('active-view', 'hidden-view');
        if (DOM.views.wiki.classList.contains('active-view')) DOM.views.wiki.classList.replace('active-view', 'hidden-view');
        
        adminDOM.view.classList.remove('hidden-view');
        adminDOM.view.classList.add('active-view');
        adminDOM.view.animate([{opacity: 0}, {opacity: 1}], {duration: 300});

        // Pre-rellenar datos conocidos + cargar token guardado
        adminDOM.ghUser.value = 'Zeus386';
        adminDOM.ghRepo.value = 'pepelluba';
        
        const savedCreds = localStorage.getItem('pepeweb_gh_creds');
        if (savedCreds) {
            try {
                const creds = JSON.parse(savedCreds);
                if (creds.token) adminDOM.ghToken.value = creds.token;
                adminDOM.ghRemember.checked = true;
            } catch (e) {}
        }
    }

    if (adminDOM.closeBtn) {
        adminDOM.closeBtn.addEventListener('click', () => {
            adminDOM.view.classList.replace('active-view', 'hidden-view');
            openWikiView(); // Volver a la wiki al cerrar
        });
    }

    if (adminDOM.loginBtn) {
        adminDOM.loginBtn.addEventListener('click', async () => {
            const user = adminDOM.ghUser.value.trim();
            const repo = adminDOM.ghRepo.value.trim();
            const token = adminDOM.ghToken.value.trim();

            if (!user || !repo || !token) {
                adminDOM.authMsg.className = 'admin-msg error';
                adminDOM.authMsg.textContent = 'Rellena todos los campos vacíos.';
                return;
            }

            adminDOM.authMsg.className = 'admin-msg';
            adminDOM.authMsg.textContent = 'Verificando con GitHub...';
            adminDOM.loginBtn.disabled = true;

            try {
                // Verificar si repo local es accesible con token
                const res = await fetch(`https://api.github.com/repos/${user}/${repo}`, {
                    headers: { 'Authorization': `token ${token}` }
                });

                if (res.ok) {
                    // Éxito: Guardar si marcó la casilla
                    if (adminDOM.ghRemember.checked) {
                        localStorage.setItem('pepeweb_gh_creds', JSON.stringify({ user, repo, token }));
                    } else {
                        localStorage.removeItem('pepeweb_gh_creds');
                    }

                    adminDOM.loginBox.classList.add('hidden');
                    adminDOM.dashboard.classList.remove('hidden');
                    adminDOM.connectedUser.textContent = `${user}/${repo}`;
                } else {
                    const errorObj = await res.json();
                    throw new Error(errorObj.message || 'Denegado. Revisa tus credenciales.');
                }
            } catch (err) {
                adminDOM.authMsg.className = 'admin-msg error';
                adminDOM.authMsg.textContent = err.message || 'Error de conexión con la API.';
            } finally {
                adminDOM.loginBtn.disabled = false;
            }
        });
    }

    // Encoder especial UTF8 a Base64 para GitHub
    function utf8ToBase64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }

    if (adminDOM.pushBtn) {
        adminDOM.pushBtn.addEventListener('click', async () => {
            const user = adminDOM.ghUser.value.trim();
            const repo = adminDOM.ghRepo.value.trim();
            const token = adminDOM.ghToken.value.trim();
            const filePath = adminDOM.fileSelect.value;
            const content = adminDOM.codeInput.value;

            if (!content) {
                adminDOM.pushMsg.className = 'admin-msg error';
                adminDOM.pushMsg.textContent = 'El contenido no puede estar vacío.';
                return;
            }

            adminDOM.pushMsg.className = 'admin-msg';
            adminDOM.pushMsg.textContent = `Buscando ${filePath} en GitHub...`;
            adminDOM.pushBtn.disabled = true;

            try {
                // 1. Obtener objeto original para sacar su SHA (Requisito para UPDATE)
                const url = `https://api.github.com/repos/${user}/${repo}/contents/${filePath}`;
                const getRes = await fetch(url + '?ref=main', {
                    headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
                });

                // Si no existe, GitHub da 404, pero igual podemos intentar crearlo en el PUT.
                let sha = null;
                if (getRes.ok) {
                    const data = await getRes.json();
                    sha = data.sha;
                } else if (getRes.status !== 404) {
                    throw new Error('No se pudo acceder a los archivos del repositorio.');
                }

                adminDOM.pushMsg.textContent = 'Realizando Commit remoto...';

                // 2. Hacer PUT con el nuevo contenido Base64
                const contentBase64 = utf8ToBase64(content);
                const bodyJson = {
                    message: `[⚙️ Admin Web Panel] Update ${filePath.split('/').pop()}`,
                    content: contentBase64,
                    branch: 'main'
                };
                if (sha) bodyJson.sha = sha;

                const putRes = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bodyJson)
                });

                if (putRes.ok) {
                    adminDOM.pushMsg.className = 'admin-msg success';
                    adminDOM.pushMsg.textContent = '¡Publicado con éxito! Tarda 1 min en reflejarse.';
                    adminDOM.codeInput.value = ''; // Limpiamos preventivamente
                } else {
                    const errObj = await putRes.json();
                    throw new Error(errObj.message || 'Error guardando archivo en GitHub.');
                }
            } catch (err) {
                adminDOM.pushMsg.className = 'admin-msg error';
                adminDOM.pushMsg.textContent = err.message;
            } finally {
                adminDOM.pushBtn.disabled = false;
            }
        });
    }

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (DOM.views.isabelle.classList.contains('active-view')) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                DOM.isabelle.btnNext.click();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                DOM.isabelle.btnPrev.click();
            } else if (e.key === 'Escape') {
                DOM.isabelle.btnBack.click();
            }
        }
    });

    // START
    checkInitialRoute();
});
