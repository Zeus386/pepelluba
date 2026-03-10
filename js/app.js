/**
 * app.js - Motor Lógico Optimizado
 * Diseño Minimalista - Cero Dependencias - Vanilla JS Moderno
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // ESTADOS Y REFERENCIAS AL DOM
    // ==========================================

    // Merge admin changes from localStorage over original file data
    (function mergeAdminCache() {
        try {
            const cachedConfig = localStorage.getItem('pepeweb_admin_config');
            if (cachedConfig) {
                const parsed = JSON.parse(cachedConfig);
                window.EXERCISES_DATA = parsed;
            }
            const cachedProofs = localStorage.getItem('pepeweb_admin_proofs');
            if (cachedProofs) {
                const parsed = JSON.parse(cachedProofs);
                Object.keys(parsed).forEach(k => {
                    window[`TEMA${k}_PROOFS`] = parsed[k];
                });
            }
        } catch(e) { console.warn('Admin cache parse error', e); }
    })();

    const state = {
        themes: Object.keys(window.EXERCISES_DATA || {}).sort((a,b) => Number(a) - Number(b)),
        currentThemeId: null,
        currentExercise: null,
        currentStep: -1,
        sidebarInitialized: false,
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
        themeToggles: document.querySelectorAll('.theme-toggle'),
        themeNav: document.getElementById('theme-nav'),
        exercisesGrid: document.getElementById('exercises-grid'),
        currentThemeTitle: document.getElementById('current-theme-title'),
        isabelle: {
            title: document.getElementById('exercise-title'),
            codeContainer: document.getElementById('code-container'),
            explanation: document.getElementById('explanation-text'),
            hypotheses: document.getElementById('active-hypotheses'),
            progress: document.getElementById('progress-bar'),
            btnPrev: document.getElementById('btn-prev'),
            btnNext: document.getElementById('btn-next'),
            codeScroll: document.getElementById('code-scroll')
        },
        adminView: document.getElementById('admin-view'), // Cache the admin view
        themeBtns: [] // To be filled in renderSidebar
    };

    // ==========================================
    // THEME TOGGLE (Modo Oscuro/Claro)
    // ==========================================
    function initTheme() {
        // Handle all theme-toggle elements
        const theme = localStorage.getItem('pepeweb_theme') || 'light';
        const isDark = (theme === 'dark');
        const htmlEl = document.documentElement;

        // Al cargar, trasladamos el estado de preload al body
        if (isDark) {
            document.body.classList.add('dark-mode');
        }
        // Una vez que JS está activo, ya no necesitamos la clase de preload
        if (htmlEl.classList.contains('dark-mode-preload')) {
            htmlEl.classList.remove('dark-mode-preload');
        }
        
        DOM.themeToggles.forEach(t => {
            t.checked = isDark;
            t.onchange = () => { // Use onchange for simpler assignment
                const checked = t.checked;
                // Sync all toggles to the same state
                DOM.themeToggles.forEach(other => other.checked = checked);
                
                if (checked) {
                    document.body.classList.add('dark-mode');
                    htmlEl.classList.remove('dark-mode-preload');
                    localStorage.setItem('pepeweb_theme', 'dark');
                } else {
                    document.body.classList.remove('dark-mode');
                    htmlEl.classList.remove('dark-mode-preload');
                    localStorage.setItem('pepeweb_theme', 'light');
                }
            };
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
            if (e.target.closest('button, a, input, .wiki-subsummary, .exercise-card, .light-switch, .icon-btn')) {
                cursor.classList.add('hover');
            }
        });
        
        document.body.addEventListener('mouseout', (e) => {
            if (e.target.closest('button, a, input, .wiki-subsummary, .exercise-card, .light-switch, .icon-btn')) {
                cursor.classList.remove('hover');
            }
        });
    }

    if (window.matchMedia("(pointer: fine)").matches) {
        initCustomCursor();
    }

    // ==========================================
    // BACKGROUND PARALLAX (Fondo se mueve con cursor)
    // ==========================================
    function initBackgroundParallax() {
        let raf = 0;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        const strength = 12; // px (sutil/clean)

        function commit() {
            // Lerp para suavidad extrema
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;

            document.documentElement.style.setProperty('--bg-x', `${currentX}px`);
            document.documentElement.style.setProperty('--bg-y', `${currentY}px`);

            if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
                raf = requestAnimationFrame(commit);
            } else {
                raf = 0;
            }
        }

        document.addEventListener('mousemove', (e) => {
            targetX = (e.clientX / window.innerWidth - 0.5) * strength * 2;
            targetY = (e.clientY / window.innerHeight - 0.5) * strength * 2;
            if (!raf) raf = requestAnimationFrame(commit);
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
            if (!raf) raf = requestAnimationFrame(commit);
        });
    }

    if (window.matchMedia("(pointer: fine)").matches) {
        initBackgroundParallax();
    }

    // Add artistic label to global back
    if (DOM.globalBack) {
        DOM.globalBack.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            <span style="font-family:'Outfit';font-weight:300;letter-spacing:1px;font-size:0.9rem;">VOLVER</span>
        `;
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
            { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ], { duration: 1000, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' });
    }

    async function transitionToApp(withAnimation = true) {
        // Cancel all ongoing animations
        [DOM.screens.intro, DOM.screens.mainApp].forEach(el => {
            el.getAnimations().forEach(anim => anim.cancel());
        });

        if (withAnimation) {
            // Animación de salida de la intro (agrandar y difuminar)
            const exitAnim = DOM.screens.intro.animate([
                { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
                { opacity: 0, transform: 'scale(1.1)', filter: 'blur(15px)' }
            ], { 
                duration: 600, 
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)', 
                fill: 'forwards' 
            });
            await exitAnim.finished;
            exitAnim.cancel(); // Cancel after finished to let class styles take over
        }
        
        DOM.screens.intro.classList.replace('active', 'hidden');
        DOM.screens.mainApp.classList.replace('hidden', 'active');
        DOM.globalHeader.classList.remove('hidden-element');
        
        if (withAnimation) {
            DOM.screens.mainApp.animate([
                { opacity: 0, transform: 'translate3d(30px, 0, 0) scale(0.98)' },
                { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
            ], { duration: 600, easing: 'ease-out', fill: 'forwards' });
        } 
        
        if (!state.sidebarInitialized) {
            renderSidebar();
            state.sidebarInitialized = true;
        }
    }

    async function transitionToIntro(withAnimation = true) {
        // Cancel all ongoing animations
        [DOM.screens.intro, DOM.screens.mainApp].forEach(el => {
            el.getAnimations().forEach(anim => anim.cancel());
        });

        if (withAnimation) {
            // Animación de salida de la APP (encoger y difuminar)
            const exitAnim = DOM.screens.mainApp.animate([
                { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
                { opacity: 0, transform: 'scale(0.95)', filter: 'blur(15px)' }
            ], { 
                duration: 500, 
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)', 
                fill: 'forwards' 
            });
            await exitAnim.finished;
            exitAnim.cancel();
        }

        document.documentElement.classList.remove('direct-logica');
        DOM.globalHeader.classList.add('hidden-element');
        DOM.screens.mainApp.classList.replace('active', 'hidden');
        DOM.screens.intro.classList.replace('hidden', 'active');

        // Reset manual
        DOM.screens.intro.style.opacity = '1';
        DOM.screens.intro.style.transform = 'scale(1)';

        if (withAnimation) {
            DOM.intro.text.style.opacity = '0';
            DOM.intro.reveal.classList.add('hidden');
            playIntroSequence();
        } else {
            DOM.intro.reveal.classList.remove('hidden');
            DOM.intro.reveal.style.opacity = '1';
            DOM.intro.text.style.opacity = '1';
        }
    }

    DOM.intro.btn.addEventListener('click', () => {
        window.location.hash = '#/logica';
    });

    function showIntro(withAnimation = true) {
        // Wrapper para llamar a la transición correcta
        transitionToIntro(withAnimation);
    }

    function checkInitialRoute() {
        router();
    }

    // Router Multinivel (Intro / Main / Exercise)
    function router() {
        const hash = window.location.hash;
        
        if (hash.startsWith('#/logica')) {
            // Mostrar App
            const wasInIntro = DOM.screens.intro.classList.contains('active');
            if (wasInIntro) {
                transitionToApp(true);
            } else {
                // Si ya estamos en la app pero estamos ocultos (ej: carga directa)
                if (!DOM.screens.mainApp.classList.contains('active')) {
                   DOM.screens.intro.classList.replace('active', 'hidden');
                   DOM.screens.mainApp.classList.replace('hidden', 'active');
                   DOM.globalHeader.classList.remove('hidden-element');
                }
                if (!state.sidebarInitialized) {
                    renderSidebar();
                    state.sidebarInitialized = true;
                }
            }

            // Sub-routing para Ejercicios
            const parts = hash.split('/');
            if (parts.length > 2) {
                const exName = parts[parts.length - 1];
                const exData = findExerciseIdByName(exName);
                if (exData && (!state.currentExercise || state.currentExercise.name !== exName)) {
                    // Animación interna de entrada al editor
                    openIsabelleView(exData, false);
                }
            } else {
                // Si estamos en la raíz de logica pero estábamos en editor, salir suavemente
                if (DOM.views.isabelle.classList.contains('active-view')) {
                    exitExerciseView(false);
                }
            }
        } else {
            // Mostrar Intro
            const wasInApp = DOM.screens.mainApp.classList.contains('active');
            if (wasInApp) {
                transitionToIntro(true);
            } else {
                showIntro(false); // Carga inicial
            }
        }
    }

    function findExerciseIdByName(name) {
        // Búsqueda profunda en todos los temas
        for (const [id, data] of Object.entries(window.EXERCISES_DATA || {})) {
            const found = Object.values(data.exercises || {}).find(e => e.name === name);
            if (found) return found;
        }
        return null;
    }

    window.addEventListener('hashchange', router);

    // Navegar atrás (Multinivel)
    DOM.globalBack.addEventListener('click', () => {
        const hash = window.location.hash;
        if (DOM.views.isabelle.classList.contains('active-view')) {
            // Si estamos en ejercicio, volver a la lista general de logica
            window.location.hash = '#/logica';
        } else {
            // Si estamos en el menú de logica, volver al inicio
            window.location.hash = '';
        }
    });


    // ==========================================
    // 2. MAIN APP: SIDEBAR Y GRID
    // ==========================================

    function renderSidebar() {
        const frag = document.createDocumentFragment();

        // 1. Botón Guía/Wiki (Con Long Press para Admin Panel)
        const wikiBtn = document.createElement('button');
        wikiBtn.className = 'theme-btn active';
        wikiBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>';
        wikiBtn.title = 'Guía / Wiki';

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
                e.preventDefault();
                return;
            }

            // Si estamos en un modo editor, darle preferencia al botón de volver del sidebar
            if (DOM.views.isabelle.classList.contains('active-view')) {
                exitExerciseView();
            }

            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            wikiBtn.classList.add('active');
            state.currentThemeId = null;
            openWikiView();
        };
        frag.appendChild(wikiBtn);

        // 2. Lista de Temas
        DOM.themeBtns = [];
        state.themes.forEach((themeId) => {
            const btn = document.createElement('button');
            btn.className = 'theme-btn';
            btn.textContent = `T${themeId}`;
            btn.title = `Tema ${themeId}`;
            btn.onclick = () => {
                DOM.themeBtns.forEach(b => b.classList.remove('active'));
                wikiBtn.classList.remove('active');
                btn.classList.add('active');
                state.currentThemeId = themeId;
                renderThemeEjercicios();
            };
            DOM.themeBtns.push(btn);
            frag.appendChild(btn);
        });
        DOM.themeBtns.push(wikiBtn); // Track wikiBtn too
        
        DOM.themeNav.innerHTML = '';
        DOM.themeNav.appendChild(frag);
        
        // Iniciar en la Guía por defecto
        openWikiView();
    }

    function openWikiView() {
        if (DOM.views.exercises.classList.contains('active-view')) DOM.views.exercises.classList.replace('active-view', 'hidden-view');
        if (DOM.views.isabelle.classList.contains('active-view')) DOM.views.isabelle.classList.replace('active-view', 'hidden-view');
        
        if (DOM.adminView && DOM.adminView.classList.contains('active-view')) DOM.adminView.classList.replace('active-view', 'hidden-view');
        
        DOM.views.wiki.classList.remove('hidden-view');
        DOM.views.wiki.classList.add('active-view');

        DOM.views.wiki.animate([
            { opacity: 0, transform: 'translate3d(0, 10px, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ], { duration: 400, easing: 'ease-out' });
    }

    function renderThemeEjercicios() {
        if (!state.currentThemeId) return;
        
        if (DOM.views.wiki.classList.contains('active-view')) DOM.views.wiki.classList.replace('active-view', 'hidden-view');
        if (DOM.views.isabelle.classList.contains('active-view')) DOM.views.isabelle.classList.replace('active-view', 'hidden-view');
        
        if (DOM.adminView && DOM.adminView.classList.contains('active-view')) DOM.adminView.classList.replace('active-view', 'hidden-view');
        
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
            card.className = 'exercise-card liquidGlass-wrapper';
            const num = exKey.replace('exe', '');
            
            card.innerHTML = `
                <div class="liquidGlass-effect"></div>
                <div class="liquidGlass-tint"></div>
                <div class="liquidGlass-shine"></div>
                <div class="liquidGlass-text card-content">
                    <h4>${num.padStart(2, '0')}</h4>
                </div>
            `;
            
            // Animación Holográfica 3D Eficiente
            let cardRect = null;
            card.addEventListener("pointerenter", () => {
                cardRect = card.getBoundingClientRect();
            });

            card.addEventListener("pointermove", (e) => {
                if (!cardRect) return;
                const hw = cardRect.width / 2;
                const hh = cardRect.height / 2;
                const ratioX = (e.clientX - (cardRect.x + hw)) / hw;
                const ratioY = (e.clientY - (cardRect.y + hh)) / hh;
                
                card.style.setProperty("--ratio-x", ratioX);
                card.style.setProperty("--ratio-y", ratioY);
                card.style.setProperty("--correction", "0%");
            }, { passive: true });
            
            card.addEventListener("pointerleave", () => {
                cardRect = null;
                card.style.setProperty("--ratio-x", 0);
                card.style.setProperty("--ratio-y", 0);
                card.style.setProperty("--correction", "100%");
            });
            
            card.onclick = () => {
                window.location.hash = `#/logica/${exData.name}`;
            };
            frag.appendChild(card);
        });

        DOM.exercisesGrid.innerHTML = '';
        DOM.exercisesGrid.appendChild(frag);
        
        // Pequeño fade in de los ejercicios
        DOM.exercisesGrid.animate([
            { opacity: 0, transform: 'translate3d(0, 10px, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ], { duration: 400, easing: 'ease-out' });
    }

    // ==========================================
    // 3. VISTA ISABELLE (MOTOR)
    // ==========================================

    function openIsabelleView(exMetadata, updateHistory = true) {
        if (updateHistory) window.location.hash = `#/logica/${exMetadata.name}`;
        
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
        // Mantener global header pero limpio de back-mode experimental anterior
        DOM.globalHeader.classList.remove('hidden-element');

        // Reset botones de icono
        DOM.isabelle.btnNext.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
    }

    function exitExerciseView(updateHistory = true) {
        if (updateHistory) window.location.hash = '#/logica';
        DOM.views.isabelle.classList.replace('active-view', 'hidden-view');
        DOM.views.exercises.classList.replace('hidden-view', 'active-view');
        state.currentExercise = null;
    }

    // El listener ya no es necesario sobre btnBack porque ya no existe en el DOM
    // Pero mantenemos la lógica para cuando se llama desde otros sitios (como sidebar)

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

    // Navegación suave con rueda del ratón dentro del editor
    let lastWheelTime = 0;
    const WHEEL_THROTTLE_MS = 220;
    document.addEventListener('wheel', (e) => {
        if (!DOM.views.isabelle.classList.contains('active-view')) return;
        const now = Date.now();
        if (now - lastWheelTime < WHEEL_THROTTLE_MS) return;
        lastWheelTime = now;

        if (e.deltaY > 0) {
            DOM.isabelle.btnNext.click();
        } else if (e.deltaY < 0) {
            DOM.isabelle.btnPrev.click();
        }
    }, { passive: true });

    // ==========================================
    // 4. ADMIN PANEL (GitHub API - CRUD Visual)
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
        // CRUD screens
        screenThemes: document.getElementById('adm-themes'),
        screenExercises: document.getElementById('adm-exercises'),
        screenEditor: document.getElementById('adm-editor'),
        themeList: document.getElementById('adm-theme-list'),
        exTitle: document.getElementById('adm-ex-title'),
        exList: document.getElementById('adm-ex-list'),
        newExBtn: document.getElementById('adm-new-ex'),
        backThemes: document.getElementById('adm-back-themes'),
        backExs: document.getElementById('adm-back-exs'),
        editorTitle: document.getElementById('adm-editor-title'),
        exTitleInput: document.getElementById('adm-ex-titleinput'),
        exName: document.getElementById('adm-ex-name'),
        exMethod: document.getElementById('adm-ex-method'),
        stepsContainer: document.getElementById('adm-steps-container'),
        addStepBtn: document.getElementById('adm-add-step'),
        saveBtn: document.getElementById('adm-save-ex'),
        saveMsg: document.getElementById('adm-save-msg'),
        // AI Import
        importAiBtn: document.getElementById('adm-import-ai'),
        screenImportAi: document.getElementById('adm-ai-import'),
        backExsFromAi: document.getElementById('adm-back-exs-from-ai'),
        aiCopyPromptBtn: document.getElementById('adm-ai-copy-prompt'),
        aiCopyMsg: document.getElementById('adm-ai-copy-msg'),
        aiJsonInput: document.getElementById('adm-ai-json-input'),
        aiProcessBtn: document.getElementById('adm-ai-process'),
        aiErrorMsg: document.getElementById('adm-ai-error-msg')
    };

    let admState = { themeId: null, exKey: null, isNew: false };

    function admShowScreen(screen) {
        [adminDOM.screenThemes, adminDOM.screenExercises, adminDOM.screenEditor, adminDOM.screenImportAi].forEach(s => {
            if (s) s.classList.add('hidden');
        });
        if (screen) screen.classList.remove('hidden');
    }

    function openAdminView() {
        if (!adminDOM.view) return;
        if (DOM.views.exercises.classList.contains('active-view')) DOM.views.exercises.classList.replace('active-view', 'hidden-view');
        if (DOM.views.isabelle.classList.contains('active-view')) DOM.views.isabelle.classList.replace('active-view', 'hidden-view');
        if (DOM.views.wiki.classList.contains('active-view')) DOM.views.wiki.classList.replace('active-view', 'hidden-view');
        adminDOM.view.classList.remove('hidden-view');
        adminDOM.view.classList.add('active-view');
        adminDOM.view.animate([{opacity: 0}, {opacity: 1}], {duration: 300});

        adminDOM.ghUser.value = 'Zeus386';
        adminDOM.ghRepo.value = 'pepelluba';
        const savedCreds = localStorage.getItem('pepeweb_gh_creds');
        if (savedCreds) {
            try { const c = JSON.parse(savedCreds); if (c.token) adminDOM.ghToken.value = c.token; adminDOM.ghRemember.checked = true; } catch(e){}
        }
    }

    if (adminDOM.closeBtn) {
        adminDOM.closeBtn.addEventListener('click', () => {
            adminDOM.view.classList.replace('active-view', 'hidden-view');
            openWikiView();
        });
    }

    // GitHub helpers
    function ghHeaders() {
        return { 'Authorization': `token ${adminDOM.ghToken.value.trim()}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };
    }
    function ghUrl(path) {
        return `https://api.github.com/repos/${adminDOM.ghUser.value.trim()}/${adminDOM.ghRepo.value.trim()}/contents/${path}`;
    }
    function utf8ToBase64(str) { return window.btoa(unescape(encodeURIComponent(str))); }

    async function ghReadFile(path) {
        const res = await fetch(ghUrl(path) + '?ref=main', { headers: ghHeaders() });
        if (!res.ok) return null;
        const data = await res.json();
        return { content: decodeURIComponent(escape(atob(data.content.replace(/\n/g, '')))), sha: data.sha };
    }

    async function ghWriteFile(path, content) {
        // Always read fresh SHA before writing to avoid stale SHA errors
        const current = await ghReadFile(path);
        const body = { message: `[Admin Panel] Update ${path.split('/').pop()}`, content: utf8ToBase64(content), branch: 'main' };
        if (current && current.sha) body.sha = current.sha;
        const res = await fetch(ghUrl(path), { method: 'PUT', headers: ghHeaders(), body: JSON.stringify(body) });
        if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Error writing to GitHub'); }
        return true;
    }

    // Login
    if (adminDOM.loginBtn) {
        adminDOM.loginBtn.addEventListener('click', async () => {
            const user = adminDOM.ghUser.value.trim();
            const repo = adminDOM.ghRepo.value.trim();
            const token = adminDOM.ghToken.value.trim();
            if (!user || !repo || !token) { adminDOM.authMsg.className = 'admin-msg error'; adminDOM.authMsg.textContent = 'Rellena todos los campos.'; return; }
            adminDOM.authMsg.className = 'admin-msg'; adminDOM.authMsg.textContent = 'Verificando...';
            adminDOM.loginBtn.disabled = true;
            try {
                const res = await fetch(`https://api.github.com/repos/${user}/${repo}`, { headers: { 'Authorization': `token ${token}` } });
                if (res.ok) {
                    if (adminDOM.ghRemember.checked) localStorage.setItem('pepeweb_gh_creds', JSON.stringify({ token }));
                    else localStorage.removeItem('pepeweb_gh_creds');
                    adminDOM.loginBox.classList.add('hidden');
                    adminDOM.dashboard.classList.remove('hidden');
                    adminDOM.connectedUser.textContent = `${user}/${repo}`;
                    admRenderThemes();
                } else { throw new Error('Token inválido o repo no encontrado.'); }
            } catch(err) { adminDOM.authMsg.className = 'admin-msg error'; adminDOM.authMsg.textContent = err.message; }
            finally { adminDOM.loginBtn.disabled = false; }
        });
    }

    // Screen 1: Themes
    function admRenderThemes() {
        admShowScreen(adminDOM.screenThemes);
        adminDOM.themeList.innerHTML = '';
        const themes = window.EXERCISES_DATA || {};
        Object.keys(themes).sort((a,b) => Number(a)-Number(b)).forEach(id => {
            const card = document.createElement('div');
            card.className = 'adm-theme-card';
            card.textContent = `Tema ${id}`;
            card.onclick = () => { admState.themeId = id; admRenderExercises(); };
            adminDOM.themeList.appendChild(card);
        });
    }

    // Screen 2: Exercises list
    function admRenderExercises() {
        admShowScreen(adminDOM.screenExercises);
        const themeData = window.EXERCISES_DATA[admState.themeId];
        adminDOM.exTitle.textContent = themeData.title || `Tema ${admState.themeId}`;
        adminDOM.exList.innerHTML = '';

        const entries = Object.entries(themeData.exercises || {}).sort((a,b) => parseInt(a[0].replace('exe','')) - parseInt(b[0].replace('exe','')));
        if (entries.length === 0) {
            adminDOM.exList.innerHTML = '<p style="color:var(--c-text-muted);font-style:italic;text-align:center;padding:2rem;">Sin ejercicios. Pulsa el botón de abajo para crear uno.</p>';
        }

        entries.forEach(([key, ex]) => {
            const item = document.createElement('div');
            item.className = 'adm-ex-item';
            item.innerHTML = `
                <div class="adm-ex-info">
                    <strong>${key.replace('exe','')}. ${ex.title}</strong>
                    <span>${ex.name} — ${ex.defaultMethod}</span>
                </div>
                <div class="adm-ex-actions">
                    <button class="edit" title="Editar">✏️</button>
                    <button class="delete" title="Borrar">🗑️</button>
                </div>`;
            item.querySelector('.edit').onclick = () => { admState.exKey = key; admState.isNew = false; admOpenEditor(ex); };
            item.querySelector('.delete').onclick = () => admDeleteExercise(key, ex);
            adminDOM.exList.appendChild(item);
        });
    }

    if (adminDOM.backThemes) adminDOM.backThemes.addEventListener('click', admRenderThemes);
    if (adminDOM.newExBtn) adminDOM.newExBtn.addEventListener('click', () => {
        const entries = Object.keys(window.EXERCISES_DATA[admState.themeId].exercises || {});
        const maxNum = entries.reduce((max, k) => Math.max(max, parseInt(k.replace('exe','')) || 0), 0);
        admState.exKey = `exe${maxNum + 1}`;
        admState.isNew = true;
        admOpenEditor({ title: '', name: `${admState.themeId}_${maxNum+1}`, defaultMethod: '' });
    });

    // Sub-Screen 4: Import AI Logic
    if (adminDOM.importAiBtn) adminDOM.importAiBtn.addEventListener('click', () => {
        admShowScreen(adminDOM.screenImportAi);
        adminDOM.aiJsonInput.value = '';
        adminDOM.aiErrorMsg.textContent = '';
        adminDOM.aiCopyMsg.textContent = '';
    });

    if (adminDOM.backExsFromAi) adminDOM.backExsFromAi.addEventListener('click', admRenderExercises);

    if (adminDOM.aiCopyPromptBtn) adminDOM.aiCopyPromptBtn.addEventListener('click', () => {
        const promptInfo = `Actúa como un profesor experto en lógica e Isabelle/HOL. 
Crea un nuevo ejercicio didáctico de deducción natural para el Tema ${admState.themeId}.
Devuélveme ÚNICAMENTE un objeto JSON con la siguiente estructura, sin texto adicional ni bloques de markdown (ni \`\`\`json):

{
  "title": "Nombre legible del ejercicio (ej: Modus Ponens, Silogismo Disyuntivo...)",
  "name": "${admState.themeId}_[ID_unico_breve_sin_espacios]",
  "defaultMethod": "Deducción por Tareas",
  "steps": [
    {
      "code": "lemma ...",
      "explanation": "Breve explicación de por qué hacemos esto",
      "activeHyp": ["Hipótesis 1", "Hipótesis 2"],
      "highlights": ["Regla a aplicar"]
    }
  ]
}`;
        navigator.clipboard.writeText(promptInfo).then(() => {
            adminDOM.aiCopyMsg.style.color = 'var(--c-accent-dark)';
            adminDOM.aiCopyMsg.textContent = '¡Prompt copiado al portapapeles!';
            setTimeout(() => { adminDOM.aiCopyMsg.textContent = ''; }, 3000);
        }).catch(err => {
            adminDOM.aiCopyMsg.style.color = '#d93025';
            adminDOM.aiCopyMsg.textContent = 'Error al copiar: ' + err;
        });
    });

    if (adminDOM.aiProcessBtn) adminDOM.aiProcessBtn.addEventListener('click', () => {
        try {
            const rawText = adminDOM.aiJsonInput.value.trim();
            if (!rawText) throw new Error("Pega la respuesta JSON primero.");

            // Basic cleanup if Gemini includes markdown blocks
            let cleanText = rawText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
            const aiData = JSON.parse(cleanText);

            if (!aiData.title || !aiData.name || !Array.isArray(aiData.steps)) {
                throw new Error("El JSON no tiene la estructura correcta (title, name, steps).");
            }

            // Route to editor
            const entries = Object.keys(window.EXERCISES_DATA[admState.themeId].exercises || {});
            const maxNum = entries.reduce((max, k) => Math.max(max, parseInt(k.replace('exe','')) || 0), 0);
            admState.exKey = `exe${maxNum + 1}`;
            admState.isNew = true;
            
            // Put it in local fake state so the editor can load the steps
            state.proofs[aiData.name] = { steps: aiData.steps };

            admOpenEditor({ 
                title: aiData.title, 
                name: aiData.name, 
                defaultMethod: aiData.defaultMethod || "Deducción por Tareas" 
            });

        } catch(err) {
            adminDOM.aiErrorMsg.textContent = "Error JSON: " + err.message;
        }
    });

    // Screen 3: Editor
    function admOpenEditor(ex) {
        admShowScreen(adminDOM.screenEditor);
        adminDOM.editorTitle.textContent = admState.isNew ? 'Crear Ejercicio' : `Editar ${admState.exKey.replace('exe', '')}`;
        adminDOM.exTitleInput.value = ex.title;
        adminDOM.exName.value = ex.name;
        adminDOM.exMethod.value = ex.defaultMethod;
        adminDOM.saveMsg.textContent = '';
        adminDOM.stepsContainer.innerHTML = '';

        // Load existing steps from proofs
        const proofData = state.proofs[ex.name];
        if (proofData && proofData.steps) {
            proofData.steps.forEach(step => admAddStepUI(step));
        } else if (!admState.isNew) {
            // No steps loaded locally, show empty
        }
    }

    function admAddStepUI(stepData = {}) {
        const idx = adminDOM.stepsContainer.children.length + 1;
        const card = document.createElement('div');
        card.className = 'adm-step-card';
        card.innerHTML = `
            <div class="adm-step-header">
                <strong>Paso ${idx}</strong>
                <button title="Eliminar paso">✕</button>
            </div>
            <label>Código Isabelle</label>
            <textarea class="code-font step-code" rows="3" placeholder="lemma ejercicio:\\n  assumes...">${stepData.code || ''}</textarea>
            <label>Explicación</label>
            <textarea class="step-explanation" rows="2" placeholder="Descripción paso a paso...">${stepData.explanation || ''}</textarea>
            <label>Hipótesis Activas (separadas por coma)</label>
            <textarea class="step-hyp" rows="1" placeholder="P ⟶ Q, P">${(stepData.activeHyp || []).join(', ')}</textarea>
            <label>Highlights (separadas por coma)</label>
            <textarea class="step-highlights" rows="1" placeholder="auto, impI">${(stepData.highlights || []).join(', ')}</textarea>`;
        card.querySelector('.adm-step-header button').onclick = () => { card.remove(); admRenumberSteps(); };
        adminDOM.stepsContainer.appendChild(card);
    }

    function admRenumberSteps() {
        Array.from(adminDOM.stepsContainer.children).forEach((card, i) => {
            card.querySelector('.adm-step-header strong').textContent = `Paso ${i + 1}`;
        });
    }

    if (adminDOM.addStepBtn) adminDOM.addStepBtn.addEventListener('click', () => admAddStepUI());
    if (adminDOM.backExs) adminDOM.backExs.addEventListener('click', admRenderExercises);

    // SAVE: Build files and push to GitHub
    if (adminDOM.saveBtn) {
        adminDOM.saveBtn.addEventListener('click', async () => {
            const title = adminDOM.exTitleInput.value.trim();
            const name = adminDOM.exName.value.trim();
            const method = adminDOM.exMethod.value.trim();
            if (!title || !name || !method) { adminDOM.saveMsg.className = 'admin-msg error'; adminDOM.saveMsg.textContent = 'Rellena título, nombre y método.'; return; }

            // Collect steps from UI
            const stepCards = adminDOM.stepsContainer.querySelectorAll('.adm-step-card');
            const steps = Array.from(stepCards).map(card => ({
                code: card.querySelector('.step-code').value,
                explanation: card.querySelector('.step-explanation').value,
                activeHyp: card.querySelector('.step-hyp').value.split(',').map(s => s.trim()).filter(Boolean),
                highlights: card.querySelector('.step-highlights').value.split(',').map(s => s.trim()).filter(Boolean)
            }));

            if (steps.length === 0) { adminDOM.saveMsg.className = 'admin-msg error'; adminDOM.saveMsg.textContent = 'Añade al menos un paso.'; return; }

            adminDOM.saveMsg.className = 'admin-msg'; adminDOM.saveMsg.textContent = 'Leyendo archivos de GitHub...';
            adminDOM.saveBtn.disabled = true;

            try {
                const temaNum = admState.themeId;
                const configPath = 'js/data/main_config.js';
                const temaPath = `js/data/TEMA${temaNum}.js`;

                // 1. Update main_config: modify, serialize
                const configData = { ...window.EXERCISES_DATA };
                if (!configData[temaNum]) configData[temaNum] = { title: `Tema ${temaNum}`, exercises: {} };
                configData[temaNum].exercises[admState.exKey] = { title, name, defaultMethod: method };
                const configContent = buildConfigJS(configData);

                // 2. Update TEMA{N}.js: modify, serialize
                let proofs = {};
                Object.keys(state.proofs).forEach(k => {
                    if (k.startsWith(`${temaNum}_`)) proofs[k] = state.proofs[k];
                });
                proofs[name] = { title: `Tema ${temaNum} - ${title}`, steps };
                const temaContent = buildTemaJS(temaNum, proofs);

                // 3. Push both files (ghWriteFile reads fresh SHA automatically)
                adminDOM.saveMsg.textContent = 'Subiendo main_config.js...';
                await ghWriteFile(configPath, configContent);

                adminDOM.saveMsg.textContent = `Subiendo TEMA${temaNum}.js...`;
                await ghWriteFile(temaPath, temaContent);

                // 6. Update local state + localStorage cache
                window.EXERCISES_DATA = configData;
                state.proofs[name] = { title: `Tema ${temaNum} - ${title}`, steps };
                admSaveLocalCache();

                adminDOM.saveMsg.className = 'admin-msg success';
                adminDOM.saveMsg.textContent = '¡Publicado! Se actualizará en ~1 min.';

                // Return to exercise list after success
                setTimeout(() => admRenderExercises(), 1500);
            } catch(err) {
                adminDOM.saveMsg.className = 'admin-msg error';
                adminDOM.saveMsg.textContent = err.message;
            } finally {
                adminDOM.saveBtn.disabled = false;
            }
        });
    }

    // DELETE exercise
    async function admDeleteExercise(exKey, exData) {
        // Temporarily show native cursor for the confirm dialog
        document.body.classList.add('native-cursor');
        const confirmed = confirm(`¿Seguro que quieres borrar el ejercicio "${exKey.replace('exe','')}: ${exData.title}"?`);
        document.body.classList.remove('native-cursor');
        if (!confirmed) return;

        try {
            const temaNum = admState.themeId;
            const configPath = 'js/data/main_config.js';
            const temaPath = `js/data/TEMA${temaNum}.js`;

            // Remove from config
            const configData = { ...window.EXERCISES_DATA };
            delete configData[temaNum].exercises[exKey];
            const configContent = buildConfigJS(configData);

            // Remove from proofs
            const proofs = {};
            Object.keys(state.proofs).forEach(k => {
                if (k.startsWith(`${temaNum}_`) && k !== exData.name) proofs[k] = state.proofs[k];
            });
            const temaContent = buildTemaJS(temaNum, proofs);

            // Push (ghWriteFile reads fresh SHA automatically)
            await ghWriteFile(configPath, configContent);
            await ghWriteFile(temaPath, temaContent);

            // Update local + cache
            window.EXERCISES_DATA = configData;
            delete state.proofs[exData.name];
            admSaveLocalCache();

            admRenderExercises();
        } catch(err) {
            document.body.classList.add('native-cursor');
            alert('Error al borrar: ' + err.message);
            document.body.classList.remove('native-cursor');
        }
    }

    // Save current state to localStorage so it persists across page refreshes
    function admSaveLocalCache() {
        try {
            localStorage.setItem('pepeweb_admin_config', JSON.stringify(window.EXERCISES_DATA));
            // Group proofs by tema
            const proofsByTema = {};
            Object.keys(state.proofs).forEach(k => {
                const temaNum = k.split('_')[0];
                if (!proofsByTema[temaNum]) proofsByTema[temaNum] = {};
                proofsByTema[temaNum][k] = state.proofs[k];
            });
            localStorage.setItem('pepeweb_admin_proofs', JSON.stringify(proofsByTema));
        } catch(e) { console.warn('Error saving admin cache', e); }
    }

    // Serializers: Object → JS source code
    function escJS(s) { return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n'); }

    function buildConfigJS(data) {
        let out = '// main_config.js - Configuración visual y de metadatos de los ejercicios\n\nconst EXERCISES_DATA = {\n';
        Object.keys(data).sort((a,b) => Number(a)-Number(b)).forEach(tid => {
            const t = data[tid];
            out += `    "${tid}": {\n        title: "${escJS(t.title)}",\n        exercises: {\n`;
            Object.entries(t.exercises || {}).forEach(([ek, ex]) => {
                out += `            "${ek}": { title: "${escJS(ex.title)}", name: "${escJS(ex.name)}", defaultMethod: "${escJS(ex.defaultMethod)}" },\n`;
            });
            out += `        }\n    },\n`;
        });
        out += '};\n\nwindow.EXERCISES_DATA = EXERCISES_DATA;\n';
        return out;
    }

    function buildTemaJS(temaNum, proofs) {
        const varName = `TEMA${temaNum}_PROOFS`;
        let out = `// TEMA${temaNum}.js - Pruebas para Tema ${temaNum}\n\nconst ${varName} = {\n`;
        Object.entries(proofs).forEach(([pName, pData]) => {
            out += `    "${escJS(pName)}": {\n`;
            out += `        title: "${escJS(pData.title)}",\n`;
            out += `        steps: [\n`;
            (pData.steps || []).forEach(step => {
                out += `            {\n`;
                out += `                code: "${escJS(step.code)}",\n`;
                out += `                explanation: "${escJS(step.explanation)}",\n`;
                out += `                activeHyp: [${(step.activeHyp||[]).map(h => `"${escJS(h)}"`).join(', ')}],\n`;
                out += `                highlights: [${(step.highlights||[]).map(h => `"${escJS(h)}"`).join(', ')}]\n`;
                out += `            },\n`;
            });
            out += `        ]\n    },\n`;
        });
        out += `};\n\nwindow.${varName} = ${varName};\n`;
        return out;
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
                exitExerciseView();
            }
        }
    });

    // START
    checkInitialRoute();
});
