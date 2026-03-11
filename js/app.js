/**
 * PEPELLUBA LOGIC ENGINE - BUNDLED
 * Diseño Optimizado para Ejecución Local (File Protocol Friendly)
 */

(function() {
    'use strict';

    // ==========================================
    // 0. SHARED NAMESPACE & GLOBALS
    // ==========================================
    const state = {
        themes: [],
        currentThemeId: null,
        currentRelationId: null,
        currentExercise: null,
        currentStep: -1,
        sidebarInitialized: false,
        proofs: {},
        progress: {}
    };

    const DOM = {
        screens: { intro: null, mainApp: null },
        views: { exercises: null, isabelle: null, wiki: null, relations: null },
        intro: { text: null, sub: null, btn: null, reveal: null },
        globalHeader: null,
        globalBack: null,
        themeToggles: null,
        themeNav: null,
        exercisesGrid: null,
        relationsGrid: null,
        currentThemeTitle: null,
        currentRelationThemeTitle: null,
        isabelle: {
            title: null, codeContainer: null, explanation: null, hypotheses: null,
            progress: null, btnPrev: null, btnNext: null, btnCompleted: null, codeScroll: null
        },
        adminView: null,
        themeBtns: [],
        modal: { overlay: null, btnDecl: null, btnAppl: null, btnCancel: null }
    };

    // Helper: Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // ==========================================
    // 1. STATE MODULE
    // ==========================================
    function initState() {
        state.themes = Object.keys(window.EXERCISES_DATA || {}).sort((a, b) => Number(a) - Number(b));
        state.proofs = { ...(window.ALL_PROOFS || {}) };
        
        try {
            const savedProgress = localStorage.getItem('pepeweb_progress');
            if (savedProgress) {
                state.progress = JSON.parse(savedProgress);
            }
        } catch (e) { console.warn('Progress load error', e); }

        try {
            const cachedConfig = localStorage.getItem('pepeweb_admin_config');
            if (cachedConfig) {
                const parsed = JSON.parse(cachedConfig);
                if (isHierarchicalConfig(parsed)) {
                    window.EXERCISES_DATA = parsed;
                    state.themes = Object.keys(window.EXERCISES_DATA || {}).sort((a, b) => Number(a) - Number(b));
                } else {
                    localStorage.removeItem('pepeweb_admin_config');
                    localStorage.removeItem('pepeweb_admin_proofs');
                }
            }

            const cachedProofs = localStorage.getItem('pepeweb_admin_proofs');
            if (cachedProofs) {
                const parsed = JSON.parse(cachedProofs);
                const flatProofs = flattenProofs(parsed);
                window.ALL_PROOFS = { ...(window.ALL_PROOFS || {}), ...flatProofs };
                state.proofs = { ...(window.ALL_PROOFS || {}) };
            }
        } catch (e) {
            console.warn('Admin cache parse error', e);
            localStorage.removeItem('pepeweb_admin_config');
            localStorage.removeItem('pepeweb_admin_proofs');
        }
    }

    function isHierarchicalConfig(cfg) {
        if (!cfg || typeof cfg !== 'object') return false;
        return Object.values(cfg).every(theme =>
            theme && typeof theme === 'object' && theme.relations && typeof theme.relations === 'object'
        );
    }

    function flattenProofs(proofs) {
        if (!proofs || typeof proofs !== 'object') return {};
        const maybeNested = Object.values(proofs).some(v => v && typeof v === 'object' && !Array.isArray(v) && !v.steps);
        if (!maybeNested) return proofs;
        const flat = {};
        Object.values(proofs).forEach(group => {
            if (!group || typeof group !== 'object') return;
            Object.entries(group).forEach(([k, v]) => { flat[k] = v; });
        });
        return flat;
    }

    // ==========================================
    // 2. DOM MODULE
    // ==========================================
    function initDOM() {
        DOM.screens.intro = document.getElementById('intro-screen');
        DOM.screens.mainApp = document.getElementById('main-app');

        DOM.views.exercises = document.getElementById('exercises-view');
        DOM.views.isabelle = document.getElementById('isabelle-view');
        DOM.views.wiki = document.getElementById('wiki-view');
        DOM.views.relations = document.getElementById('relations-view');

        DOM.intro.text = document.getElementById('intro-text');
        DOM.intro.sub = document.getElementById('sub-text');
        DOM.intro.btn = document.getElementById('logic-btn');
        DOM.intro.reveal = document.getElementById('intro-reveal');

        DOM.globalHeader = document.getElementById('global-header');
        DOM.globalBack = document.getElementById('global-back');
        DOM.themeToggles = document.querySelectorAll('.theme-toggle');
        DOM.themeNav = document.getElementById('theme-nav');
        
        DOM.exercisesGrid = document.getElementById('exercises-grid');
        DOM.relationsGrid = document.getElementById('relations-grid');
        
        DOM.currentThemeTitle = document.getElementById('current-theme-title');
        DOM.currentRelationThemeTitle = document.getElementById('current-relation-theme-title');

        DOM.isabelle.title = document.getElementById('exercise-title');
        DOM.isabelle.codeContainer = document.getElementById('code-container');
        DOM.isabelle.explanation = document.getElementById('explanation-text');
        DOM.isabelle.hypotheses = document.getElementById('active-hypotheses');
        DOM.isabelle.progress = document.getElementById('progress-bar');
        DOM.isabelle.btnPrev = document.getElementById('btn-prev');
        DOM.isabelle.btnNext = document.getElementById('btn-next');
        DOM.isabelle.btnCompleted = document.getElementById('btn-completed');
        DOM.isabelle.codeScroll = document.getElementById('code-scroll');

        DOM.modal.overlay = document.getElementById('mode-selection-modal');
        DOM.modal.btnDecl = document.getElementById('btn-mode-decl');
        DOM.modal.btnAppl = document.getElementById('btn-mode-appl');
        DOM.modal.btnCancel = document.getElementById('btn-mode-cancel');

        DOM.adminView = document.getElementById('admin-view');
    }

    // ==========================================
    // 3. UI THEME MODULE
    // ==========================================
    function initTheme() {
        const theme = localStorage.getItem('pepeweb_theme') || 'light';
        const isDark = (theme === 'dark');
        const htmlEl = document.documentElement;

        if (isDark) {
            document.body.classList.add('dark-mode');
        }
        
        if (htmlEl.classList.contains('dark-mode-preload')) {
            htmlEl.classList.remove('dark-mode-preload');
        }

        if (DOM.themeToggles) {
            DOM.themeToggles.forEach(t => {
                t.checked = isDark;
                t.onchange = () => {
                    const checked = t.checked;
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
    }

    // ==========================================
    // 4. UI EFFECTS MODULE
    // ==========================================
    function initEffects() {
        if (window.matchMedia("(pointer: fine)").matches) {
            initCustomCursor();
            initBackgroundParallax();
        }
        
        if (DOM.globalBack) {
            DOM.globalBack.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                <span style="font-family:'Outfit';font-weight:300;letter-spacing:1px;font-size:0.9rem;">VOLVER</span>
            `;
        }
    }

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

    function initBackgroundParallax() {
        let raf = 0;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        const strength = 12;

        function commit() {
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

        const onMove = throttle((e) => {
            targetX = (e.clientX / window.innerWidth - 0.5) * strength * 2;
            targetY = (e.clientY / window.innerHeight - 0.5) * strength * 2;
            if (!raf) raf = requestAnimationFrame(commit);
        }, 50);

        document.addEventListener('mousemove', onMove, { passive: true });

        document.addEventListener('mouseleave', () => {
            targetX = 0;
            targetY = 0;
            if (!raf) raf = requestAnimationFrame(commit);
        });
    }

    async function playIntroSequence() {
        await DOM.intro.text.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], { duration: 1000, easing: 'ease-out', fill: 'forwards' }).finished;

        await new Promise(r => setTimeout(r, 300));

        DOM.intro.reveal.classList.remove('hidden');
        DOM.intro.reveal.animate([
            { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ], { duration: 1000, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' });
    }

    // ==========================================
    // 5. ADMIN MODULE
    // ==========================================
    const adminDOM = {
        view: null, closeBtn: null, loginBox: null, dashboard: null,
        ghUser: null, ghRepo: null, ghToken: null, ghRemember: null,
        loginBtn: null, authMsg: null, connectedUser: null,
        screenThemes: null, screenExercises: null, screenEditor: null,
        themeList: null, exTitle: null, exList: null, newExBtn: null,
        backThemes: null, backExs: null, editorTitle: null, exTitleInput: null,
        exName: null, exMethod: null, stepsContainer: null, addStepBtn: null,
        saveBtn: null, saveMsg: null, importAiBtn: null, screenImportAi: null,
        backExsFromAi: null, aiCopyPromptBtn: null, aiCopyMsg: null,
        aiJsonInput: null, aiProcessBtn: null, aiErrorMsg: null
    };

    let admState = { themeId: null, exKey: null, isNew: false, relationId: null };

    function initAdmin() {
        adminDOM.view = document.getElementById('admin-view');
        adminDOM.closeBtn = document.getElementById('admin-close-btn');
        adminDOM.loginBox = document.getElementById('admin-login-box');
        adminDOM.dashboard = document.getElementById('admin-dashboard');
        adminDOM.ghUser = document.getElementById('gh-user');
        adminDOM.ghRepo = document.getElementById('gh-repo');
        adminDOM.ghToken = document.getElementById('gh-token');
        adminDOM.ghRemember = document.getElementById('gh-remember');
        adminDOM.loginBtn = document.getElementById('admin-login-btn');
        adminDOM.authMsg = document.getElementById('admin-auth-msg');
        adminDOM.connectedUser = document.getElementById('admin-connected-user');
        
        adminDOM.screenThemes = document.getElementById('adm-themes');
        adminDOM.screenExercises = document.getElementById('adm-exercises');
        adminDOM.screenEditor = document.getElementById('adm-editor');
        adminDOM.themeList = document.getElementById('adm-theme-list');
        adminDOM.exTitle = document.getElementById('adm-ex-title');
        adminDOM.exList = document.getElementById('adm-ex-list');
        adminDOM.newExBtn = document.getElementById('adm-new-ex');
        adminDOM.backThemes = document.getElementById('adm-back-themes');
        adminDOM.backExs = document.getElementById('adm-back-exs');
        adminDOM.editorTitle = document.getElementById('adm-editor-title');
        adminDOM.exTitleInput = document.getElementById('adm-ex-titleinput');
        adminDOM.exName = document.getElementById('adm-ex-name');
        adminDOM.exMethod = document.getElementById('adm-ex-method');
        adminDOM.stepsContainer = document.getElementById('adm-steps-container');
        adminDOM.addStepBtn = document.getElementById('adm-add-step');
        adminDOM.saveBtn = document.getElementById('adm-save-ex');
        adminDOM.saveMsg = document.getElementById('adm-save-msg');
        
        adminDOM.importAiBtn = document.getElementById('adm-import-ai');
        adminDOM.screenImportAi = document.getElementById('adm-ai-import');
        adminDOM.backExsFromAi = document.getElementById('adm-back-exs-from-ai');
        adminDOM.aiCopyPromptBtn = document.getElementById('adm-ai-copy-prompt');
        adminDOM.aiCopyMsg = document.getElementById('adm-ai-copy-msg');
        adminDOM.aiJsonInput = document.getElementById('adm-ai-json-input');
        adminDOM.aiProcessBtn = document.getElementById('adm-ai-process');
        adminDOM.aiErrorMsg = document.getElementById('adm-ai-error-msg');

        if (adminDOM.closeBtn) {
            adminDOM.closeBtn.addEventListener('click', () => {
                adminDOM.view.classList.replace('active-view', 'hidden-view');
                window.location.hash = '#/logica';
            });
        }

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
                } catch (err) { adminDOM.authMsg.className = 'admin-msg error'; adminDOM.authMsg.textContent = err.message; }
                finally { adminDOM.loginBtn.disabled = false; }
            });
        }

        if (adminDOM.backThemes) adminDOM.backThemes.addEventListener('click', admRenderThemes);
        if (adminDOM.newExBtn) adminDOM.newExBtn.addEventListener('click', () => {
            const relationData = window.EXERCISES_DATA[admState.themeId]?.relations?.[admState.relationId] || { exercises: {} };
            const entries = Object.keys(relationData.exercises || {});
            const maxNum = entries.reduce((max, k) => Math.max(max, parseInt(k.replace('exe', '')) || 0), 0);
            admState.exKey = `exe${maxNum + 1}`;
            admState.isNew = true;
            admOpenEditor({ title: '', name: `${admState.themeId}_${admState.relationId}_${maxNum + 1}`, defaultMethod: '' });
        });

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

                let cleanText = rawText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
                const aiData = JSON.parse(cleanText);

                if (!aiData.title || !aiData.name || !Array.isArray(aiData.steps)) {
                    throw new Error("El JSON no tiene la estructura correcta (title, name, steps).");
                }

                const relationData = window.EXERCISES_DATA[admState.themeId]?.relations?.[admState.relationId] || { exercises: {} };
                const entries = Object.keys(relationData.exercises || {});
                const maxNum = entries.reduce((max, k) => Math.max(max, parseInt(k.replace('exe', '')) || 0), 0);
                admState.exKey = `exe${maxNum + 1}`;
                admState.isNew = true;

                state.proofs[aiData.name] = { steps: aiData.steps };

                admOpenEditor({
                    title: aiData.title,
                    name: aiData.name,
                    defaultMethod: aiData.defaultMethod || "Deducción por Tareas"
                });

            } catch (err) {
                adminDOM.aiErrorMsg.textContent = "Error JSON: " + err.message;
            }
        });

        if (adminDOM.addStepBtn) adminDOM.addStepBtn.addEventListener('click', () => admAddStepUI());
        if (adminDOM.backExs) adminDOM.backExs.addEventListener('click', admRenderExercises);

        if (adminDOM.saveBtn) {
            adminDOM.saveBtn.addEventListener('click', async () => {
                const title = adminDOM.exTitleInput.value.trim();
                const name = adminDOM.exName.value.trim();
                const method = adminDOM.exMethod.value.trim();
                if (!title || !name || !method) { adminDOM.saveMsg.className = 'admin-msg error'; adminDOM.saveMsg.textContent = 'Rellena título, nombre y método.'; return; }

                const stepCards = adminDOM.stepsContainer.querySelectorAll('.adm-step-card');
                const steps = Array.from(stepCards).map(card => ({
                    code: card.querySelector('.step-code').value,
                    explanation: card.querySelector('.step-explanation').value,
                    activeHyp: card.querySelector('.step-hyp').value.split(',').map(s => s.trim()).filter(Boolean),
                    highlights: card.querySelector('.step-highlights').value.split(',').map(s => s.trim()).filter(Boolean)
                }));

                if (steps.length === 0) { adminDOM.saveMsg.className = 'admin-msg error'; adminDOM.saveMsg.textContent = 'Añade al menos un paso.'; return; }

                adminDOM.saveMsg.className = 'admin-msg';
                adminDOM.saveMsg.textContent = 'Publicando cambios...';
                adminDOM.saveBtn.disabled = true;

                try {
                    const themeId = admState.themeId;
                    const configPath = 'js/data/main_config.js';
                    const meta = getProofFileMeta(themeId);

                    const configData = JSON.parse(JSON.stringify(window.EXERCISES_DATA || {}));
                    if (!configData[themeId]) configData[themeId] = { title: `Tema ${themeId}`, relations: {} };
                    if (!configData[themeId].relations) configData[themeId].relations = {};
                    if (!admState.relationId) admState.relationId = Object.keys(configData[themeId].relations)[0] || 'rel1';
                    if (!configData[themeId].relations[admState.relationId]) configData[themeId].relations[admState.relationId] = { title: `Relación ${admState.relationId}`, exercises: {} };

                    configData[themeId].relations[admState.relationId].exercises[admState.exKey] = { title, name, defaultMethod: method };
                    const configContent = buildConfigJS(configData);

                    const proofs = { ...(window[meta.varName] || {}) };
                    proofs[name] = { title, steps };
                    const proofContent = buildProofJS(meta.varName, meta.header, proofs);

                    await ghWriteFile(configPath, configContent);
                    await ghWriteFile(meta.path, proofContent);

                    window.EXERCISES_DATA = configData;
                    window[meta.varName] = proofs;
                    window.ALL_PROOFS = { ...(window.ALL_PROOFS || {}), [name]: { title, steps } };
                    state.proofs = { ...(window.ALL_PROOFS || {}) };
                    admSaveLocalCache();

                    adminDOM.saveMsg.className = 'admin-msg success';
                    adminDOM.saveMsg.textContent = '¡Publicado! Se actualizará en ~1 min.';
                    setTimeout(() => admRenderExercises(), 1200);
                } catch (err) {
                    adminDOM.saveMsg.className = 'admin-msg error';
                    adminDOM.saveMsg.textContent = err.message;
                } finally {
                    adminDOM.saveBtn.disabled = false;
                }
            });
        }
    }

    function openAdminView() {
        if (!adminDOM.view) return;
        const views = document.querySelectorAll('.view');
        views.forEach(v => v.classList.replace('active-view', 'hidden-view'));
        adminDOM.view.classList.remove('hidden-view');
        adminDOM.view.classList.add('active-view');
        adminDOM.view.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });

        adminDOM.ghUser.value = 'Zeus386';
        adminDOM.ghRepo.value = 'pepelluba';
        const savedCreds = localStorage.getItem('pepeweb_gh_creds');
        if (savedCreds) {
            try { const c = JSON.parse(savedCreds); if (c.token) adminDOM.ghToken.value = c.token; adminDOM.ghRemember.checked = true; } catch (e) { }
        }
    }

    function admShowScreen(screen) {
        [adminDOM.screenThemes, adminDOM.screenExercises, adminDOM.screenEditor, adminDOM.screenImportAi].forEach(s => {
            if (s) s.classList.add('hidden');
        });
        if (screen) screen.classList.remove('hidden');
    }

    function admRenderThemes() {
        admShowScreen(adminDOM.screenThemes);
        adminDOM.themeList.innerHTML = '';
        const themes = window.EXERCISES_DATA || {};
        
        const ids = Object.keys(themes).sort((a, b) => {
            const isNumA = !isNaN(a);
            const isNumB = !isNaN(b);
            if (isNumA && isNumB) return Number(a) - Number(b);
            if (isNumA) return -1;
            if (isNumB) return 1;
            return a.localeCompare(b);
        });

        ids.forEach(id => {
            const card = document.createElement('div');
            card.className = 'adm-theme-card';
            card.textContent = (id.startsWith('P') || id === 'C') ? themes[id].title : `Tema ${id}`;
            card.onclick = () => { 
                admState.themeId = id; 
                admRenderRelations(); 
            };
            adminDOM.themeList.appendChild(card);
        });
    }

    function admRenderRelations() {
        admShowScreen(adminDOM.screenExercises);
        const themeData = window.EXERCISES_DATA[admState.themeId];
        adminDOM.exTitle.textContent = `Relaciones - ${themeData.title || admState.themeId}`;
        adminDOM.exList.innerHTML = '';

        const relations = themeData.relations || {};
        const entries = Object.entries(relations);

        if (entries.length === 0) {
            adminDOM.exList.innerHTML = '<p style="color:var(--c-text-muted);font-style:italic;text-align:center;padding:2rem;">Sin relaciones configuradas.</p>';
        }

        entries.forEach(([relId, relData]) => {
            const card = document.createElement('div');
            card.className = 'adm-ex-card';
            card.innerHTML = `
                <div class="adm-ex-info">
                    <span class="adm-ex-num">${relId.replace('rel', '')}</span>
                    <span class="adm-ex-title">${relData.title}</span>
                </div>
                <div class="adm-ex-actions">
                    <button class="adm-btn-icon edit" title="Editar Relación"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button>
                </div>
            `;
            card.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:1rem;border:1px solid rgba(0,0,0,0.05);border-radius:12px;margin-bottom:0.5rem;background:var(--c-bg);cursor:pointer;';
            
            card.onclick = (e) => {
                if (e.target.closest('button')) return;
                admState.relationId = relId; 
                admRenderExercises(); 
            };
            adminDOM.exList.appendChild(card);
        });
    }

    function admRenderExercises() {
        admShowScreen(adminDOM.screenExercises);
        const themeData = window.EXERCISES_DATA[admState.themeId];
        const relationData = themeData.relations[admState.relationId];
        adminDOM.exTitle.textContent = relationData.title || `Relación ${admState.relationId}`;
        adminDOM.exList.innerHTML = '';

        const entries = Object.entries(relationData.exercises || {}).sort((a, b) => parseInt(a[0].replace('exe', '')) - parseInt(b[0].replace('exe', '')));
        if (entries.length === 0) {
            adminDOM.exList.innerHTML = '<p style="color:var(--c-text-muted);font-style:italic;text-align:center;padding:2rem;">Sin ejercicios. Pulsa el botón de abajo para crear uno.</p>';
        }

        entries.forEach(([key, ex]) => {
            const item = document.createElement('div');
            item.className = 'adm-ex-item';
            item.innerHTML = `
                <div class="adm-ex-info">
                    <strong>${key.replace('exe', '')}. ${ex.title}</strong>
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

    function admOpenEditor(ex) {
        admShowScreen(adminDOM.screenEditor);
        adminDOM.editorTitle.textContent = admState.isNew ? 'Crear Ejercicio' : `Editar ${admState.exKey.replace('exe', '')}`;
        adminDOM.exTitleInput.value = ex.title;
        adminDOM.exName.value = ex.name;
        adminDOM.exMethod.value = ex.defaultMethod;
        adminDOM.saveMsg.textContent = '';
        adminDOM.stepsContainer.innerHTML = '';

        const proofData = state.proofs[ex.name];
        if (proofData && proofData.steps) {
            proofData.steps.forEach(step => admAddStepUI(step));
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
        const current = await ghReadFile(path);
        const body = { message: `[Admin Panel] Update ${path.split('/').pop()}`, content: utf8ToBase64(content), branch: 'main' };
        if (current && current.sha) body.sha = current.sha;
        const res = await fetch(ghUrl(path), { method: 'PUT', headers: ghHeaders(), body: JSON.stringify(body) });
        if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Error writing to GitHub'); }
        return true;
    }

    function getProofFileMeta(themeId) {
        if (/^\d+$/.test(themeId)) {
            return {
                path: `js/data/BOLETIN${themeId}.js`,
                varName: `BOLETIN${themeId}_PROOFS`,
                header: `BOLETIN${themeId}.js - Ejercicios del Boletín ${themeId}`
            };
        }
        if (themeId === 'P1') return { path: 'js/data/PRIMER_PARCIAL.js', varName: 'PRIMER_PARCIAL_PROOFS', header: 'PRIMER_PARCIAL.js - Exámenes de Primer Parcial' };
        if (themeId === 'P2') return { path: 'js/data/SEGUNDO_PARCIAL.js', varName: 'SEGUNDO_PARCIAL_PROOFS', header: 'SEGUNDO_PARCIAL.js - Exámenes de Segundo Parcial' };
        return { path: 'js/data/CONVOCATORIA.js', varName: 'CONVOCATORIA_PROOFS', header: 'CONVOCATORIA.js - Exámenes de Convocatoria' };
    }

    async function admDeleteExercise(exKey, exData) {
        document.body.classList.add('native-cursor');
        const confirmed = confirm(`¿Seguro que quieres borrar el ejercicio "${exKey.replace('exe', '')}: ${exData.title}"?`);
        document.body.classList.remove('native-cursor');
        if (!confirmed) return;

        try {
            const themeId = admState.themeId;
            const configPath = 'js/data/main_config.js';
            const meta = getProofFileMeta(themeId);

            const configData = JSON.parse(JSON.stringify(window.EXERCISES_DATA || {}));
            if (configData[themeId]?.relations?.[admState.relationId]?.exercises) {
                delete configData[themeId].relations[admState.relationId].exercises[exKey];
            }
            const configContent = buildConfigJS(configData);

            const proofs = { ...(window[meta.varName] || {}) };
            delete proofs[exData.name];
            const proofContent = buildProofJS(meta.varName, meta.header, proofs);

            await ghWriteFile(configPath, configContent);
            await ghWriteFile(meta.path, proofContent);

            window.EXERCISES_DATA = configData;
            window[meta.varName] = proofs;
            delete window.ALL_PROOFS[exData.name];
            state.proofs = { ...(window.ALL_PROOFS || {}) };
            admSaveLocalCache();

            admRenderExercises();
        } catch (err) {
            document.body.classList.add('native-cursor');
            alert('Error al borrar: ' + err.message);
            document.body.classList.remove('native-cursor');
        }
    }

    function admSaveLocalCache() {
        try {
            localStorage.setItem('pepeweb_admin_config', JSON.stringify(window.EXERCISES_DATA));
            localStorage.setItem('pepeweb_admin_proofs', JSON.stringify(window.ALL_PROOFS || {}));
        } catch (e) { console.warn('Error saving admin cache', e); }
    }

    function escJS(s = '') { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n'); }

    function buildConfigJS(data) {
        const sortedIds = Object.keys(data).sort((a, b) => {
            const na = Number(a), nb = Number(b);
            const aIsNum = !Number.isNaN(na), bIsNum = !Number.isNaN(nb);
            if (aIsNum && bIsNum) return na - nb;
            if (aIsNum) return -1;
            if (bIsNum) return 1;
            return a.localeCompare(b);
        });

        let out = 'const EXERCISES_DATA = {\n';
        sortedIds.forEach(tid => {
            const t = data[tid] || {};
            out += `    "${tid}": {\n        title: "${escJS(t.title || `Tema ${tid}`)}",\n        relations: {\n`;
            const relEntries = Object.entries(t.relations || {});
            relEntries.forEach(([rid, rel]) => {
                out += `            "${rid}": {\n                title: "${escJS(rel.title || rid)}",\n                exercises: {\n`;
                Object.entries(rel.exercises || {}).forEach(([ek, ex]) => {
                    out += `                    "${ek}": { title: "${escJS(ex.title)}", name: "${escJS(ex.name)}", defaultMethod: "${escJS(ex.defaultMethod)}" },\n`;
                });
                out += '                }\n            },\n';
            });
            out += '        }\n    },\n';
        });

        out += '};\n\nwindow.EXERCISES_DATA = EXERCISES_DATA;\n';
        out += '\nwindow.ALL_PROOFS = {\n';
        out += '    ...(window.BOLETIN1_PROOFS || {}),\n';
        out += '    ...(window.BOLETIN2_PROOFS || {}),\n';
        out += '    ...(window.BOLETIN3_PROOFS || {}),\n';
        out += '    ...(window.BOLETIN4_PROOFS || {}),\n';
        out += '    ...(window.BOLETIN5_PROOFS || {}),\n';
        out += '    ...(window.BOLETIN6_PROOFS || {}),\n';
        out += '    ...(window.BOLETIN7_PROOFS || {}),\n';
        out += '    ...(window.BOLETIN8_PROOFS || {}),\n';
        out += '    ...(window.BOLETIN9_PROOFS || {}),\n';
        out += '    ...(window.BOLETIN10_PROOFS || {}),\n';
        out += '    ...(window.BOLETIN11_PROOFS || {}),\n';
        out += '    ...(window.PRIMER_PARCIAL_PROOFS || {}),\n';
        out += '    ...(window.SEGUNDO_PARCIAL_PROOFS || {}),\n';
        out += '    ...(window.CONVOCATORIA_PROOFS || {})\n';
        out += '};\n';
        return out;
    }

    function buildProofJS(varName, header, proofs) {
        let out = `// ${header}\nconst ${varName} = {\n`;
        Object.entries(proofs).forEach(([pName, pData]) => {
            out += `    "${escJS(pName)}": {\n`;
            out += `        title: "${escJS(pData.title || pName)}",\n`;
            out += '        steps: [\n';
            (pData.steps || []).forEach(step => {
                out += '            {\n';
                out += `                code: "${escJS(step.code)}",\n`;
                out += `                explanation: "${escJS(step.explanation)}",\n`;
                out += `                activeHyp: [${(step.activeHyp || []).map(h => `"${escJS(h)}"`).join(', ')}],\n`;
                out += `                highlights: [${(step.highlights || []).map(h => `"${escJS(h)}"`).join(', ')}]\n`;
                out += '            },\n';
            });
            out += '        ]\n';
            out += '    },\n';
        });
        out += `};\nwindow.${varName} = ${varName};\n`;
        return out;
    }

    // ==========================================
    // 6. UI SIDEBAR MODULE
    // ==========================================
    let sidebarSubmenu;
    let sidebarSubmenuNav;
    let sidebarSubmenuThemeId = null;
    let sidebarSubmenuAnchorBtn = null;
    let hasSubmenuGlobalListeners = false;
    let mobileSidebarMedia;
    let sidebar;
    let mobileSidebarToggle;
    let mobileSidebarBackdrop;

    function initSidebar() {
        sidebar = document.getElementById('sidebar');
        mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
        mobileSidebarBackdrop = document.getElementById('mobile-sidebar-backdrop');
        mobileSidebarMedia = window.matchMedia('(max-width: 1024px), (hover: none) and (pointer: coarse)');

        if (mobileSidebarToggle && mobileSidebarBackdrop) {
            mobileSidebarToggle.addEventListener('click', () => {
                if (sidebar.classList.contains('open')) {
                    closeMobileSidebar();
                } else {
                    openMobileSidebar();
                }
            });

            mobileSidebarToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    mobileSidebarToggle.click();
                }
            });

            mobileSidebarBackdrop.addEventListener('click', closeMobileSidebar);

            window.addEventListener('resize', syncMobileSidebarUI, { passive: true });
            window.addEventListener('orientationchange', syncMobileSidebarUI, { passive: true });
        }
    }

    function renderSidebar() {
        const frag = document.createDocumentFragment();

        const wikiBtn = document.createElement('button');
        wikiBtn.className = 'theme-btn active';
        wikiBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>';
        wikiBtn.title = 'Guía / Wiki';

        let adminLongPressTimer;
        let isAdminFired = false;

        wikiBtn.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            isAdminFired = false;
            adminLongPressTimer = setTimeout(() => {
                isAdminFired = true;
                openAdminView();
            }, 3000);
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
            closeSidebarSubmenu();
            window.location.hash = '#/logica';
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            wikiBtn.classList.add('active');
            if (mobileSidebarMedia.matches) {
                closeMobileSidebar();
            }
        };
        frag.appendChild(wikiBtn);

        const divider1 = document.createElement('div');
        divider1.className = 'sidebar-divider';
        frag.appendChild(divider1);

        DOM.themeBtns = [];
        const themesList = ["1", "2", "3", "4", "5", "6"]; 
        themesList.forEach((themeId) => {
            const btn = document.createElement('button');
            btn.className = 'theme-btn';
            btn.textContent = `T${themeId}`;
            btn.title = `Tema ${themeId}`;
            btn.setAttribute('aria-expanded', 'false');
            btn.onclick = () => {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const relCount = Object.keys(window.EXERCISES_DATA?.[themeId]?.relations || {}).length;
                if (relCount > 1) {
                    openSidebarSubmenu(themeId, btn);
                } else {
                    closeSidebarSubmenu();
                    window.location.hash = `#/logica/T${themeId}`;
                    if (mobileSidebarMedia.matches) {
                        closeMobileSidebar();
                    }
                }
                if (mobileSidebarMedia.matches) {
                    positionSidebarSubmenu();
                }
            };
            DOM.themeBtns.push(btn);
            frag.appendChild(btn);
        });

        const divider2 = document.createElement('div');
        divider2.className = 'sidebar-divider';
        frag.appendChild(divider2);

        const exBtn = document.createElement('button');
        exBtn.className = 'theme-btn';
        exBtn.textContent = 'EX';
        exBtn.title = 'Exámenes';
        exBtn.setAttribute('aria-expanded', 'false');
        exBtn.onclick = () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            exBtn.classList.add('active');
            openSidebarSubmenuEx(exBtn);
            if (mobileSidebarMedia.matches) {
                positionSidebarSubmenu();
            }
        };
        DOM.themeBtns.push(exBtn);
        frag.appendChild(exBtn);

        DOM.themeBtns.push(wikiBtn);

        if (DOM.themeNav) {
            DOM.themeNav.innerHTML = '';
            DOM.themeNav.appendChild(frag);
        }
    }

    function syncSidebarUI() {
        const hash = window.location.hash;
        if (!DOM.themeNav) return;
        
        const btns = DOM.themeNav.querySelectorAll('.theme-btn');
        btns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.title === 'Guía / Wiki' && (hash === '#/logica' || hash === '')) {
                btn.classList.add('active');
            }
            if (hash.includes('/T')) {
                const parts = hash.split('/');
                const themePart = parts[2];
                if (btn.textContent === themePart) btn.classList.add('active');
            }
            if (btn.textContent === 'EX' && (hash.includes('/EX') || hash.includes('/P1') || hash.includes('/P2') || hash.includes('/C'))) {
                btn.classList.add('active');
            }
        });
    }

    function ensureSidebarSubmenu() {
        if (sidebarSubmenu && sidebarSubmenuNav) return;
        sidebarSubmenu = document.getElementById('sidebar-submenu');
        sidebarSubmenuNav = document.getElementById('sidebar-submenu-nav');
        if (sidebarSubmenu && sidebarSubmenuNav) return;

        const el = document.createElement('aside');
        el.id = 'sidebar-submenu';
        el.setAttribute('aria-label', 'Submenú');
        el.innerHTML = `
            <div class="liquidGlass-wrapper sidebar-dock">
                <div class="liquidGlass-effect"></div>
                <div class="liquidGlass-tint"></div>
                <div class="liquidGlass-shine"></div>
                <div class="liquidGlass-text sidebar-dock-inner">
                    <nav id="sidebar-submenu-nav"></nav>
                </div>
            </div>
        `;
        document.body.appendChild(el);
        sidebarSubmenu = el;
        sidebarSubmenuNav = el.querySelector('#sidebar-submenu-nav');
    }

    function closeSidebarSubmenu() {
        if (!sidebarSubmenu) return;
        sidebarSubmenu.classList.remove('open');
        sidebarSubmenuThemeId = null;
        if (sidebarSubmenuAnchorBtn) {
            sidebarSubmenuAnchorBtn.setAttribute('aria-expanded', 'false');
        }
        sidebarSubmenuAnchorBtn = null;
        if (sidebarSubmenuNav) sidebarSubmenuNav.innerHTML = '';
    }

    function positionSidebarSubmenu() {
        if (!sidebarSubmenu || !sidebarSubmenu.classList.contains('open')) return;
        if (!sidebar) return;
        const anchorRect = sidebar.getBoundingClientRect();

        sidebarSubmenu.style.left = `${Math.round(anchorRect.right + 12)}px`;

        const submenuRect = sidebarSubmenu.getBoundingClientRect();
        const viewportH = window.innerHeight || document.documentElement.clientHeight;
        const minCenter = 16 + submenuRect.height / 2;
        const maxCenter = viewportH - 16 - submenuRect.height / 2;
        const desiredCenter = anchorRect.top + anchorRect.height / 2;
        const center = Math.max(minCenter, Math.min(maxCenter, desiredCenter));
        sidebarSubmenu.style.top = `${Math.round(center)}px`;
    }

    function openSidebarSubmenu(themeId, anchorBtn) {
        ensureSidebarSubmenu();
        if (!sidebarSubmenu || !sidebarSubmenuNav) return;

        if (sidebarSubmenuThemeId === themeId) {
            closeSidebarSubmenu();
            return;
        }

        const isSwitching = sidebarSubmenu.classList.contains('open') && sidebarSubmenuThemeId && sidebarSubmenuThemeId !== themeId;
        const prevAnchor = sidebarSubmenuAnchorBtn;
        if (prevAnchor) prevAnchor.setAttribute('aria-expanded', 'false');
        sidebarSubmenuThemeId = themeId;
        sidebarSubmenuAnchorBtn = anchorBtn || null;
        if (sidebarSubmenuAnchorBtn) sidebarSubmenuAnchorBtn.setAttribute('aria-expanded', 'true');

        const activeRelMatch = window.location.hash.match(new RegExp(`#\\/logica\\/T${themeId}\\/(rel\\d+)`));
        const activeRelId = activeRelMatch ? activeRelMatch[1] : null;

        const themeData = window.EXERCISES_DATA?.[themeId];
        const relEntries = Object.entries(themeData?.relations || {}).sort((a, b) => {
            const na = parseInt(String(a[0]).replace('rel', ''), 10) || 0;
            const nb = parseInt(String(b[0]).replace('rel', ''), 10) || 0;
            return na - nb;
        });

        const render = () => {
            const frag = document.createDocumentFragment();
            relEntries.forEach(([relId, relData]) => {
                const numRaw = String(relId).replace('rel', '');
                const num = Number.parseInt(numRaw, 10);
                const bLabel = Number.isFinite(num) ? `B${num}` : 'B';
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'theme-btn';
                btn.textContent = bLabel;
                btn.title = relData?.title || bLabel;
                if (activeRelId && relId === activeRelId) btn.classList.add('active');
                btn.onclick = () => {
                    closeSidebarSubmenu();
                    window.location.hash = `#/logica/T${themeId}/${relId}`;
                    if (mobileSidebarMedia.matches) closeMobileSidebar();
                };
                frag.appendChild(btn);
            });
            sidebarSubmenuNav.innerHTML = '';
            sidebarSubmenuNav.appendChild(frag);
        };

        if (isSwitching) {
            positionSidebarSubmenu();
            sidebarSubmenuNav.animate([
                { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                { opacity: 0, transform: 'translate3d(-6px, 0, 0)' }
            ], { duration: 120, easing: 'ease-out', fill: 'forwards' }).finished.then(() => {
                render();
                positionSidebarSubmenu();
                sidebarSubmenuNav.animate([
                    { opacity: 0, transform: 'translate3d(6px, 0, 0)' },
                    { opacity: 1, transform: 'translate3d(0, 0, 0)' }
                ], { duration: 180, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' });
            });
        } else {
            closeSidebarSubmenu();
            sidebarSubmenuThemeId = themeId;
            sidebarSubmenuAnchorBtn = anchorBtn || null;
            if (sidebarSubmenuAnchorBtn) sidebarSubmenuAnchorBtn.setAttribute('aria-expanded', 'true');
            render();
            sidebarSubmenu.classList.add('open');
            positionSidebarSubmenu();
        }

        if (!hasSubmenuGlobalListeners) {
            hasSubmenuGlobalListeners = true;
            document.addEventListener('pointerdown', (e) => {
                if (!sidebarSubmenu || !sidebarSubmenu.classList.contains('open')) return;
                const target = e.target;
                if (sidebar && sidebar.contains(target)) return;
                if (sidebarSubmenu.contains(target)) return;
                closeSidebarSubmenu();
            }, { passive: true });
            window.addEventListener('resize', positionSidebarSubmenu, { passive: true });
            window.addEventListener('orientationchange', positionSidebarSubmenu, { passive: true });
        }
    }

    function openSidebarSubmenuEx(anchorBtn) {
        ensureSidebarSubmenu();
        if (!sidebarSubmenu || !sidebarSubmenuNav) return;

        if (sidebarSubmenuThemeId === 'EX') {
            closeSidebarSubmenu();
            return;
        }

        const isSwitching = sidebarSubmenu.classList.contains('open') && sidebarSubmenuThemeId && sidebarSubmenuThemeId !== 'EX';
        const prevAnchor = sidebarSubmenuAnchorBtn;
        if (prevAnchor) prevAnchor.setAttribute('aria-expanded', 'false');
        sidebarSubmenuThemeId = 'EX';
        sidebarSubmenuAnchorBtn = anchorBtn || null;
        if (sidebarSubmenuAnchorBtn) sidebarSubmenuAnchorBtn.setAttribute('aria-expanded', 'true');

        const activeExamMatch = window.location.hash.match(/#\/logica\/(P1|P2|C)\b/);
        const activeExam = activeExamMatch ? activeExamMatch[1] : null;

        const entries = [
            { id: 'P1', title: 'Primeros Parciales' },
            { id: 'P2', title: 'Segundos Parciales' },
            { id: 'C', title: 'Convocatorias' }
        ];

        const render = () => {
            const frag = document.createDocumentFragment();
            entries.forEach((ex) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'theme-btn';
                btn.textContent = ex.id;
                btn.title = ex.title;
                if (activeExam && activeExam === ex.id) btn.classList.add('active');
                btn.onclick = () => {
                    closeSidebarSubmenu();
                    window.location.hash = `#/logica/${ex.id}`;
                    if (mobileSidebarMedia.matches) closeMobileSidebar();
                };
                frag.appendChild(btn);
            });
            sidebarSubmenuNav.innerHTML = '';
            sidebarSubmenuNav.appendChild(frag);
        };

        if (isSwitching) {
            positionSidebarSubmenu();
            sidebarSubmenuNav.animate([
                { opacity: 1, transform: 'translate3d(0, 0, 0)' },
                { opacity: 0, transform: 'translate3d(-6px, 0, 0)' }
            ], { duration: 120, easing: 'ease-out', fill: 'forwards' }).finished.then(() => {
                render();
                positionSidebarSubmenu();
                sidebarSubmenuNav.animate([
                    { opacity: 0, transform: 'translate3d(6px, 0, 0)' },
                    { opacity: 1, transform: 'translate3d(0, 0, 0)' }
                ], { duration: 180, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' });
            });
        } else {
            closeSidebarSubmenu();
            sidebarSubmenuThemeId = 'EX';
            sidebarSubmenuAnchorBtn = anchorBtn || null;
            if (sidebarSubmenuAnchorBtn) sidebarSubmenuAnchorBtn.setAttribute('aria-expanded', 'true');
            render();
            sidebarSubmenu.classList.add('open');
            positionSidebarSubmenu();
        }
    }

    function closeMobileSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('open');
        if (mobileSidebarBackdrop) {
            mobileSidebarBackdrop.classList.remove('visible');
        }
        DOM.screens.mainApp.classList.remove('sidebar-open');
        document.body.classList.remove('sidebar-open');
        closeSidebarSubmenu();
        if (mobileSidebarToggle) {
            mobileSidebarToggle.setAttribute('aria-expanded', 'false');
        }
    }

    function syncMobileSidebarUI() {
        if (!mobileSidebarToggle) return;
        if (mobileSidebarMedia.matches && DOM.screens.mainApp.classList.contains('active')) {
            mobileSidebarToggle.style.display = 'flex';
        } else {
            mobileSidebarToggle.style.display = 'none';
        }
        if (!mobileSidebarMedia.matches) closeMobileSidebar();
    }

    function openMobileSidebar() {
        if (!mobileSidebarMedia.matches) return;
        sidebar.classList.add('open');
        if (mobileSidebarBackdrop) {
            mobileSidebarBackdrop.classList.add('visible');
        }
        DOM.screens.mainApp.classList.add('sidebar-open');
        document.body.classList.add('sidebar-open');
        if (mobileSidebarToggle) {
            mobileSidebarToggle.setAttribute('aria-expanded', 'true');
        }
    }

    // ==========================================
    // 7. UI VIEWS MODULE
    // ==========================================
    function initViews() {
        setupModalHandlers();

        if (DOM.isabelle.btnNext) {
            DOM.isabelle.btnNext.addEventListener('click', () => {
                if (!state.currentExercise) return;
                if (state.currentStep < state.currentExercise.steps.length - 1) {
                    state.currentStep++;
                    renderStep();
                }
            });
        }

        if (DOM.isabelle.btnPrev) {
            DOM.isabelle.btnPrev.addEventListener('click', () => {
                if (!state.currentExercise) return;
                if (state.currentStep > 0) {
                    state.currentStep--;
                    renderStep();
                } else if (state.currentStep === 0) {
                    state.currentStep = -1;
                    DOM.isabelle.codeContainer.innerHTML = '';
                    DOM.isabelle.explanation.innerHTML = '<span style="color:var(--c-text-muted);font-style:italic">Prueba reiniciada.</span>';
                    DOM.isabelle.hypotheses.innerHTML = '';
                    DOM.isabelle.progress.style.width = '0%';
                    DOM.isabelle.btnPrev.disabled = true;
                }
            });
        }

        if (DOM.isabelle.btnCompleted) {
            DOM.isabelle.btnCompleted.addEventListener('click', toggleExerciseCompletion);
        }

        let lastWheelTime = 0;
        const WHEEL_THROTTLE_MS = 220;

        // Rueda ratón SOLO sobre el panel de código:
        // - en el bloque de código: avanza / retrocede pasos
        // - en el panel de explicación: scroll normal del navegador
        if (DOM.isabelle.codeScroll) {
            DOM.isabelle.codeScroll.addEventListener('wheel', (e) => {
                if (!DOM.views.isabelle.classList.contains('active-view')) return;

                const now = Date.now();
                if (now - lastWheelTime < WHEEL_THROTTLE_MS) return;
                lastWheelTime = now;

                // Bloqueamos el scroll nativo del panel de código y usamos la rueda como navegación
                e.preventDefault();

                if (e.deltaY > 0) {
                    DOM.isabelle.btnNext.click();
                } else if (e.deltaY < 0) {
                    DOM.isabelle.btnPrev.click();
                }
            }, { passive: false });
        }

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
    }

    function openWikiView(animate = true) {
        state.currentThemeId = null; 
        state.currentRelationId = null;
        const alreadyActive = DOM.views.wiki.classList.contains('active-view');

        if (DOM.views.exercises.classList.contains('active-view')) DOM.views.exercises.classList.replace('active-view', 'hidden-view');
        if (DOM.views.relations && DOM.views.relations.classList.contains('active-view')) DOM.views.relations.classList.replace('active-view', 'hidden-view');
        if (DOM.views.isabelle.classList.contains('active-view')) DOM.views.isabelle.classList.replace('active-view', 'hidden-view');
        if (DOM.adminView && DOM.adminView.classList.contains('active-view')) DOM.adminView.classList.replace('active-view', 'hidden-view');

        DOM.views.wiki.classList.remove('hidden-view');
        DOM.views.wiki.classList.add('active-view');

        if (!alreadyActive && animate) {
            DOM.views.wiki.animate([
                { opacity: 0, transform: 'translate3d(0, 10px, 0)' },
                { opacity: 1, transform: 'translate3d(0, 0, 0)' }
            ], { duration: 400, easing: 'ease-out' });
        }
    }

    function renderExamsMenu(animate = true) {
        state.currentThemeId = 'EX';
        state.currentRelationId = null;

        if (DOM.views.wiki.classList.contains('active-view')) DOM.views.wiki.classList.replace('active-view', 'hidden-view');
        if (DOM.views.exercises.classList.contains('active-view')) DOM.views.exercises.classList.replace('active-view', 'hidden-view');
        if (DOM.views.isabelle.classList.contains('active-view')) DOM.views.isabelle.classList.replace('active-view', 'hidden-view');

        if (!DOM.views.relations) DOM.views.relations = document.getElementById('relations-view');
        DOM.views.relations.classList.remove('hidden-view');
        DOM.views.relations.classList.add('active-view');

        DOM.currentRelationThemeTitle.textContent = "Exámenes de Otros Años";

        const frag = document.createDocumentFragment();
        const exams = [
            { id: 'P1', title: 'Primeros Parciales', desc: 'Exámenes de la primera parte del curso' },
            { id: 'P2', title: 'Segundos Parciales', desc: 'Exámenes de la segunda parte del curso' },
            { id: 'C', title: 'Convocatorias', desc: 'Exámenes finales de convocatoria ordinaria/extraordinaria' }
        ];

        exams.forEach(ex => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'selection-card liquidGlass-wrapper';
            btn.setAttribute('aria-label', ex.title);
            btn.innerHTML = `
                <div class="liquidGlass-effect"></div>
                <div class="liquidGlass-tint"></div>
                <div class="liquidGlass-shine"></div>
                <div class="liquidGlass-text selection-content">
                    <div class="selection-kicker">EXÁMENES</div>
                    <div class="selection-title">${ex.title}</div>
                    <div class="selection-desc">${ex.desc}</div>
                </div>
            `;
            btn.onclick = () => { window.location.hash = `#/logica/${ex.id}`; };
            frag.appendChild(btn);
        });

        DOM.relationsGrid.classList.add('selection-grid');
        DOM.relationsGrid.innerHTML = '';
        DOM.relationsGrid.appendChild(frag);

        if (animate) {
            DOM.relationsGrid.animate([
                { opacity: 0, scale: 0.98, transform: 'translate3d(0, 10px, 0)' },
                { opacity: 1, scale: 1, transform: 'translate3d(0, 0, 0)' }
            ], { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        }
    }

    function renderRelations(themeId, animate = true) {
        const themeData = window.EXERCISES_DATA[themeId];
        if (!themeData) {
            console.error(`No theme data for: ${themeId}`);
            return;
        }

        state.currentThemeId = themeId;
        state.currentRelationId = null;

        if (DOM.views.wiki.classList.contains('active-view')) DOM.views.wiki.classList.replace('active-view', 'hidden-view');
        if (DOM.views.exercises.classList.contains('active-view')) DOM.views.exercises.classList.replace('active-view', 'hidden-view');
        if (DOM.views.isabelle.classList.contains('active-view')) DOM.views.isabelle.classList.replace('active-view', 'hidden-view');

        if (!DOM.views.relations) DOM.views.relations = document.getElementById('relations-view');
        DOM.views.relations.classList.remove('hidden-view');
        DOM.views.relations.classList.add('active-view');

        DOM.currentRelationThemeTitle.textContent = themeData.title;

        const frag = document.createDocumentFragment();
        const relations = themeData.relations || {};
        const relEntries = Object.entries(relations);

        const getRelNum = (id) => {
            const raw = String(id || '').replace('rel', '');
            if (!raw) return '';
            return raw.padStart(2, '0');
        };

        relEntries.forEach(([relId, relData]) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'selection-card liquidGlass-wrapper';
            const num = getRelNum(relId);
            btn.setAttribute('aria-label', `Relación ${num}: ${relData.title}`);
            btn.innerHTML = `
                <div class="liquidGlass-effect"></div>
                <div class="liquidGlass-tint"></div>
                <div class="liquidGlass-shine"></div>
                <div class="liquidGlass-text selection-content">
                    <div class="selection-kicker">RELACIÓN ${num}</div>
                    <div class="selection-title">${relData.title}</div>
                </div>
            `;

            btn.onclick = () => {
                const isExam = ['P1', 'P2', 'C'].includes(themeId);
                const prefix = isExam ? '' : 'T';
                window.location.hash = `#/logica/${prefix}${themeId}/${relId}`;
            };

            frag.appendChild(btn);
        });

        DOM.relationsGrid.classList.add('selection-grid');
        DOM.relationsGrid.innerHTML = '';
        DOM.relationsGrid.appendChild(frag);

        if (animate) {
            DOM.relationsGrid.animate([
                { opacity: 0, scale: 0.98, transform: 'translate3d(0, 10px, 0)' },
                { opacity: 1, scale: 1, transform: 'translate3d(0, 0, 0)' }
            ], { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        }
    }

    function renderThemeEjercicios(themeId, relationId, animate = true) {
        const themeData = window.EXERCISES_DATA[themeId];
        if (!themeData) return;
        const relationData = themeData.relations[relationId];
        if (!relationData) return;

        state.currentThemeId = themeId;
        state.currentRelationId = relationId;

        if (DOM.views.wiki.classList.contains('active-view')) DOM.views.wiki.classList.replace('active-view', 'hidden-view');
        if (DOM.views.relations && DOM.views.relations.classList.contains('active-view')) DOM.views.relations.classList.replace('active-view', 'hidden-view');
        if (DOM.views.isabelle.classList.contains('active-view')) DOM.views.isabelle.classList.replace('active-view', 'hidden-view');

        DOM.views.exercises.classList.remove('hidden-view');
        DOM.views.exercises.classList.add('active-view');

        const relNumRaw = String(relationId || '').replace('rel', '');
        const relNum = relNumRaw ? relNumRaw.padStart(2, '0') : '';
        const isExam = ['P1', 'P2', 'C'].includes(themeId);
        
        if (isExam) {
            DOM.currentThemeTitle.textContent = `${themeData.title} · ${relationData.title}`;
        } else {
            DOM.currentThemeTitle.textContent = `Relación ${relNum} · ${relationData.title}`;
        }

        const frag = document.createDocumentFragment();
        const exEntries = Object.entries(relationData.exercises).sort((a, b) => {
            const numA = parseInt(a[0].replace('exe', ''));
            const numB = parseInt(b[0].replace('exe', ''));
            
            if (isNaN(numA) && isNaN(numB)) return a[0].localeCompare(b[0]);
            if (isNaN(numA)) return 1; // Put extra at bottom
            if (isNaN(numB)) return -1;
            
            return numA - numB;
        });

        exEntries.forEach(([exKey, exData]) => {
            const card = document.createElement('div');
            card.className = 'exercise-card liquidGlass-wrapper';
            const numRaw = exKey.replace('exe', '');
            const isExtra = isNaN(parseInt(numRaw));
            const num = isExtra ? '★' : numRaw.padStart(2, '0');
            
            // Check Progress (Normalize name by stripping suffix)
            const baseName = exData.name.replace(/(_decl|_auto)$/, '');
            
            // Check if ANY variant is completed or visited
            let isCompleted = false;
            let isVisited = false;
            
            // Check base name
            if (state.progress[baseName]) {
                if (state.progress[baseName].completed) isCompleted = true;
                if (state.progress[baseName].visited) isVisited = true;
            }
            // Check known variants
            if (state.progress[baseName + '_decl']) {
                if (state.progress[baseName + '_decl'].completed) isCompleted = true;
                if (state.progress[baseName + '_decl'].visited) isVisited = true;
            }
            if (state.progress[baseName + '_auto']) {
                if (state.progress[baseName + '_auto'].completed) isCompleted = true;
                if (state.progress[baseName + '_auto'].visited) isVisited = true;
            }

            if (isCompleted) card.classList.add('completed');
            if (!isVisited) card.classList.add('unvisited');

            // Determine Label
            let label = "Ejercicio";
            if (isExam) label = "Pregunta";
            if (isExtra) label = "Extra";

            card.innerHTML = `
                <div class="liquidGlass-effect"></div>
                <div class="liquidGlass-tint"></div>
                <div class="liquidGlass-shine"></div>
                <div class="liquidGlass-text card-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.2rem;">
                    <span style="font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 600; line-height: 1;">${num}</span>
                    <span style="font-size: 0.85rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">${label}</span>
                </div>
                ${!isVisited ? '<div class="pulse-dot"></div>' : ''}
            `;

            setupCardInteractions(card);

            card.onclick = () => {
                openModeSelection(themeId, relationId, exData);
            };
            frag.appendChild(card);
        });

        DOM.exercisesGrid.innerHTML = '';
        DOM.exercisesGrid.appendChild(frag);

        if (animate) {
            DOM.exercisesGrid.animate([
                { opacity: 0, scale: 0.98, transform: 'translate3d(0, 10px, 0)' },
                { opacity: 1, scale: 1, transform: 'translate3d(0, 0, 0)' }
            ], { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        }
    }

    function setupCardInteractions(card) {
        let rafId = null;
        let cardRect = null;

        card.addEventListener("pointerenter", () => {
            cardRect = card.getBoundingClientRect();
        }, { passive: true });

        const onMove = throttle((e) => {
            if (!cardRect) return;
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                const hw = cardRect.width / 2;
                const hh = cardRect.height / 2;
                const ratioX = (e.clientX - (cardRect.x + hw)) / hw;
                const ratioY = (e.clientY - (cardRect.y + hh)) / hh;

                card.style.setProperty("--ratio-x", ratioX.toFixed(3));
                card.style.setProperty("--ratio-y", ratioY.toFixed(3));
                card.style.setProperty("--correction", "0%");
            });
        }, 30); // Throttled to ~33fps equivalent for calculation

        card.addEventListener("pointermove", onMove, { passive: true });

        card.addEventListener("pointerleave", () => {
            if (rafId) cancelAnimationFrame(rafId);
            cardRect = null;
            card.style.setProperty("--ratio-x", 0);
            card.style.setProperty("--ratio-y", 0);
            card.style.setProperty("--correction", "100%");
        }, { passive: true });
    }

    function openIsabelleView(exMetadata, animate = true) {
        const proofId = exMetadata.name;
        // Intentamos cargar la prueba específica (ej: 1_1_decl)
        // Si no existe, fallback a la prueba base si existe en ALL_PROOFS, 
        // o si exMetadata tiene un nombre base original
        
        let proofData = window.ALL_PROOFS[proofId];
        
        // Fallback: si pedimos _decl pero no existe, intentamos _auto o base
        if (!proofData) {
            if (proofId.endsWith('_decl')) {
                const tryAuto = proofId.replace(/_decl$/, '_auto');
                proofData = window.ALL_PROOFS[tryAuto];
            } else if (proofId.endsWith('_auto')) {
                const tryBase = proofId.replace(/_auto$/, '');
                proofData = window.ALL_PROOFS[tryBase];
            }
        }

        if (!proofData) {
            console.warn("Prueba no encontrada en ALL_PROOFS:", proofId);
            // Mostrar error visual al usuario en el editor, sin restos de ejercicios anteriores
            DOM.isabelle.title.textContent = "Datos no encontrados";
            DOM.isabelle.codeContainer.innerHTML = '';
            DOM.isabelle.explanation.innerHTML = `
                <div style="text-align: center; padding: 2.5rem 1.5rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h3 style="color: var(--c-text-main); margin-bottom: 0.75rem;">Datos no encontrados</h3>
                    <p style="color: var(--c-text-muted);">
                        No se han encontrado los datos para la variante:
                        <strong>${proofId}</strong>
                    </p>
                </div>`;
            DOM.isabelle.hypotheses.innerHTML = '<div style="color:var(--c-text-muted);font-style:italic">Sin datos para este ejercicio.</div>';
            DOM.isabelle.progress.style.width = '0%';
            if (DOM.isabelle.btnPrev) {
                DOM.isabelle.btnPrev.disabled = true;
            }
            if (DOM.isabelle.btnNext) {
                DOM.isabelle.btnNext.disabled = true;
                DOM.isabelle.btnNext.style.opacity = '0.5';
                DOM.isabelle.btnNext.style.cursor = 'default';
            }

            state.currentExercise = null;
            state.currentStep = -1;

            // Hide all other views before showing isabelle (prevents overlap)
            if (DOM.views.exercises.classList.contains('active-view')) DOM.views.exercises.classList.replace('active-view', 'hidden-view');
            if (DOM.views.wiki.classList.contains('active-view')) DOM.views.wiki.classList.replace('active-view', 'hidden-view');
            if (DOM.views.relations && DOM.views.relations.classList.contains('active-view')) DOM.views.relations.classList.replace('active-view', 'hidden-view');
            const adminViewErr = document.getElementById('admin-view');
            if (adminViewErr && adminViewErr.classList.contains('active-view')) adminViewErr.classList.replace('active-view', 'hidden-view');

            DOM.views.isabelle.classList.remove('hidden-view');
            DOM.views.isabelle.classList.add('active-view');
            DOM.globalHeader.classList.remove('hidden-element');
            return;
        }

        // Mark as visited (Base Name)
        const baseName = proofId.replace(/(_decl|_auto)$/, '');
        if (!state.progress[baseName]) state.progress[baseName] = {};
        if (!state.progress[baseName].visited) {
            state.progress[baseName].visited = true;
            localStorage.setItem('pepeweb_progress', JSON.stringify(state.progress));
        }

        state.currentExercise = proofData;
        state.currentStep = -1;

        // Usamos el título base si está disponible (para no ensuciar con IDs)
        const displayTitle = exMetadata.baseTitle || exMetadata.title;
        const displayMethod = proofId.includes('_decl') ? 'Declarativa' : (proofId.includes('_auto') ? 'Aplicativa' : exMetadata.defaultMethod);
        
        DOM.isabelle.title.textContent = `${displayTitle} - ${displayMethod}`;
        DOM.isabelle.codeContainer.innerHTML = '';
        DOM.isabelle.explanation.innerHTML = '<span style="color:var(--c-text-muted);font-style:italic">Presiona avanzar para iniciar.</span>';
        DOM.isabelle.hypotheses.innerHTML = '';
        DOM.isabelle.progress.style.width = '0%';
        DOM.isabelle.btnPrev.disabled = true;

        // Update Completed Button State
        if (DOM.isabelle.btnCompleted) {
            const isCompleted = state.progress[baseName]?.completed;
            DOM.isabelle.btnCompleted.classList.toggle('active', !!isCompleted);
            DOM.isabelle.btnCompleted.setAttribute('aria-pressed', !!isCompleted);
            DOM.isabelle.btnCompleted.title = isCompleted ? "Marcar como no entendido" : "Marcar como entendido";
        }

        if (DOM.views.exercises.classList.contains('active-view')) DOM.views.exercises.classList.replace('active-view', 'hidden-view');
        if (DOM.views.wiki.classList.contains('active-view')) DOM.views.wiki.classList.replace('active-view', 'hidden-view');
        if (DOM.views.relations && DOM.views.relations.classList.contains('active-view')) DOM.views.relations.classList.replace('active-view', 'hidden-view');
        
        DOM.views.isabelle.classList.remove('hidden-view');
        DOM.views.isabelle.classList.add('active-view');

        const adminView = document.getElementById('admin-view');
        if (adminView && adminView.classList.contains('active-view')) adminView.classList.replace('active-view', 'hidden-view');

        if (animate) {
            DOM.views.isabelle.animate([
                { opacity: 0, transform: 'translate3d(0, 10px, 0)' },
                { opacity: 1, transform: 'translate3d(0, 0, 0)' }
            ], { duration: 400, easing: 'ease-out' });
        }

        DOM.globalHeader.classList.remove('hidden-element');
        DOM.isabelle.btnNext.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
    }

    function toggleExerciseCompletion() {
        if (!state.currentExercise) return;
        
        // Find the key in ALL_PROOFS by value equality (since state.currentExercise is the object)
        // Or better, assume we stored the ID somewhere. state.currentExercise doesn't have ID.
        // We can find it via window.location.hash logic or just pass it.
        // Actually, let's use the ID from the URL hash for reliability.
        const hash = window.location.hash;
        const parts = hash.split('/');
        const proofId = parts.length === 5 ? parts[4] : null;

        if (!proofId) return;

        // Strip suffix for base name consistency
        const baseName = proofId.replace(/(_decl|_auto)$/, '');

        if (!state.progress[baseName]) state.progress[baseName] = {};
        state.progress[baseName].completed = !state.progress[baseName].completed;
        localStorage.setItem('pepeweb_progress', JSON.stringify(state.progress));

        const isCompleted = state.progress[baseName].completed;
        if (DOM.isabelle.btnCompleted) {
            DOM.isabelle.btnCompleted.classList.toggle('active', isCompleted);
            DOM.isabelle.btnCompleted.setAttribute('aria-pressed', isCompleted);
            DOM.isabelle.btnCompleted.title = isCompleted ? "Marcar como no entendido" : "Marcar como entendido";
        }
    }

    function exitExerciseView(updateHistory = true) {
        if (updateHistory) window.location.hash = '#/logica';
        DOM.views.isabelle.classList.replace('active-view', 'hidden-view');
        DOM.views.exercises.classList.replace('hidden-view', 'active-view');
        state.currentExercise = null;
    }

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

        setTimeout(() => {
            DOM.isabelle.codeScroll.scrollTo({
                top: DOM.isabelle.codeScroll.scrollHeight,
                behavior: 'smooth'
            });
        }, 30);

        DOM.isabelle.explanation.innerHTML = currentData.explanation;

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

        const pct = ((stepIdx + 1) / steps.length) * 100;
        DOM.isabelle.progress.style.width = `${pct}%`;

        DOM.isabelle.btnPrev.disabled = (stepIdx === -1);

        // Fix: Do not show duplicate checkmark. At the end, disable next button or hide it.
        // The persistent completion state is handled by btnCompleted.
        if (stepIdx === steps.length - 1) {
            // Option: Disable next button to indicate end of steps
            DOM.isabelle.btnNext.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
            DOM.isabelle.btnNext.disabled = true;
            DOM.isabelle.btnNext.style.opacity = '0.5';
            DOM.isabelle.btnNext.style.cursor = 'default';
        } else {
            DOM.isabelle.btnNext.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
            DOM.isabelle.btnNext.disabled = false;
            DOM.isabelle.btnNext.style.opacity = '1';
            DOM.isabelle.btnNext.style.cursor = 'pointer';
        }
    }

    // ==========================================
    // 7.1 MODAL SELECTION MODULE
    // ==========================================
    let pendingSelection = null;

    function setupModalHandlers() {
        if (DOM.modal.btnCancel) {
            DOM.modal.btnCancel.onclick = () => {
                DOM.modal.overlay.classList.add('hidden');
                pendingSelection = null;
            };
        }
        
        if (DOM.modal.overlay) {
            DOM.modal.overlay.addEventListener('click', (e) => {
                if (e.target === DOM.modal.overlay) {
                    DOM.modal.overlay.classList.add('hidden');
                    pendingSelection = null;
                }
            });
        }

        if (DOM.modal.btnDecl) {
            DOM.modal.btnDecl.onclick = () => confirmModeSelection('decl');
        }

        if (DOM.modal.btnAppl) {
            DOM.modal.btnAppl.onclick = () => confirmModeSelection('appl');
        }
    }

    function openModeSelection(themeId, relationId, exData) {
        // Bypass modal for Theme 1 (Logic Propositional - Introduction)
        if (themeId === "1") {
            const prefix = themeId.startsWith('P') || themeId === 'C' ? '' : 'T';
            window.location.hash = `#/logica/${prefix}${themeId}/${relationId}/${exData.name}`;
            return;
        }

        pendingSelection = { themeId, relationId, exData };
        DOM.modal.overlay.classList.remove('hidden');
        
        // Animación de entrada simple
        const content = DOM.modal.overlay.querySelector('.modal-content');
        if (content) {
            content.animate([
                { opacity: 0, transform: 'scale(0.95) translateY(10px)' },
                { opacity: 1, transform: 'scale(1) translateY(0)' }
            ], { duration: 250, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
        }
    }

    function confirmModeSelection(mode) {
        if (!pendingSelection) return;
        
        const { themeId, relationId, exData } = pendingSelection;
        const prefix = themeId.startsWith('P') || themeId === 'C' ? '' : 'T';
        
        // Construimos el sufijo basado en la selección
        // Si el nombre original ya tiene _auto, intentamos ser inteligentes
        let baseName = exData.name;
        
        // Lógica de resolución de nombres de prueba:
        // Si el modo es 'appl' (Aplicativa), preferimos sufijo '_auto'
        // Si el modo es 'decl' (Declarativa), preferimos sufijo '_decl'
        
        // Quitamos sufijos existentes si los hubiera para obtener la base
        baseName = baseName.replace(/_auto$/, '').replace(/_decl$/, '');
        
        const suffix = mode === 'appl' ? '_auto' : '_decl';
        const finalName = `${baseName}${suffix}`;
        
        DOM.modal.overlay.classList.add('hidden');
        pendingSelection = null;
        
        window.location.hash = `#/logica/${prefix}${themeId}/${relationId}/${finalName}`;
    }

    // ==========================================
    // 8. TRANSITIONS MODULE
    // ==========================================
    async function transitionToApp(withAnimation = true) {
        [DOM.screens.intro, DOM.screens.mainApp].forEach(el => {
            el.getAnimations().forEach(anim => anim.cancel());
        });

        if (withAnimation) {
            const exitAnim = DOM.screens.intro.animate([
                { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
                { opacity: 0, transform: 'scale(1.1)', filter: 'blur(15px)' }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'forwards'
            });
            await exitAnim.finished;
            exitAnim.cancel();
        }

        document.documentElement.classList.remove('direct-logica');

        DOM.screens.intro.classList.replace('active', 'hidden');
        DOM.screens.mainApp.classList.replace('hidden', 'active');
        
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.add('active');
        
        DOM.globalHeader.classList.remove('hidden-element');
        syncMobileSidebarUI();

        if (withAnimation) {
            DOM.screens.mainApp.animate([
                { opacity: 0, transform: 'translate3d(30px, 0, 0) scale(0.98)' },
                { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
            ], { duration: 600, easing: 'ease-out', fill: 'forwards' });
        } else {
            DOM.screens.mainApp.style.opacity = '1';
            DOM.screens.mainApp.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }
        
        if (!state.sidebarInitialized) {
            renderSidebar();
            state.sidebarInitialized = true;
        }
    }

    async function transitionToIntro(withAnimation = true) {
        [DOM.screens.intro, DOM.screens.mainApp].forEach(el => {
            el.getAnimations().forEach(anim => anim.cancel());
        });

        if (withAnimation) {
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
        
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('active');
        
        syncMobileSidebarUI();
        closeMobileSidebar();
        DOM.screens.intro.classList.replace('hidden', 'active');

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

    function showIntro(withAnimation = true) {
        transitionToIntro(withAnimation);
    }

    // ==========================================
    // 9. ROUTER MODULE
    // ==========================================
    function initRouter() {
        window.addEventListener('hashchange', router);
        
        if (DOM.globalBack) {
            DOM.globalBack.addEventListener('click', () => {
                const hash = window.location.hash;
                const parts = hash.split('/');

                if (parts.length === 5) {
                    window.location.hash = parts.slice(0, 4).join('/');
                } else if (parts.length === 4) {
                    window.location.hash = parts.slice(0, 3).join('/');
                } else if (parts.length === 3) {
                    if (['P1', 'P2', 'C'].includes(parts[2])) {
                        window.location.hash = '#/logica/EX';
                    } else {
                        window.location.hash = '#/logica'; 
                    }
                } else if (parts.length === 2 && parts[1] === 'logica') {
                    window.location.hash = '';
                } else {
                    window.location.hash = '';
                }
            });
        }

        if (DOM.intro.btn) {
            DOM.intro.btn.addEventListener('click', () => {
                window.location.hash = '#/logica';
            });
        }

        router();
    }

    async function router() {
        const hash = window.location.hash;
        closeSidebarSubmenu();

        if (hash.startsWith('#/logica')) {
            const parts = hash.split('/');
            const wasInIntro = DOM.screens.intro.classList.contains('active');
            const isDirect = document.documentElement.classList.contains('direct-logica');

            if (wasInIntro) {
                if (!state.sidebarInitialized) {
                    renderSidebar();
                    state.sidebarInitialized = true;
                }
                await transitionToApp(!isDirect);
            } else if (!DOM.screens.mainApp.classList.contains('active')) {
                document.documentElement.classList.remove('direct-logica');
                DOM.screens.intro.classList.replace('active', 'hidden');
                DOM.screens.mainApp.classList.replace('hidden', 'active');
                DOM.screens.mainApp.style.opacity = '1';
                DOM.screens.mainApp.style.transform = 'translate3d(0, 0, 0) scale(1)';
                
                const sidebar = document.getElementById('sidebar');
                if (sidebar) sidebar.classList.add('active');
                
                syncMobileSidebarUI();
                DOM.globalHeader.classList.remove('hidden-element');
                if (!state.sidebarInitialized) {
                    renderSidebar();
                    state.sidebarInitialized = true;
                }
            }

            if (parts.length === 2) {
                openWikiView(!wasInIntro);
            } else if (parts.length === 3) {
                if (parts[2] === 'EX') {
                    renderExamsMenu(!wasInIntro);
                    const exBtn = Array.from(document.querySelectorAll('#theme-nav .theme-btn')).find(b => b.textContent === 'EX');
                    openSidebarSubmenuEx(exBtn || null);
                } else if (parts[2].startsWith('T')) {
                    const themeId = parts[2].slice(1);
                    const themeData = window.EXERCISES_DATA?.[themeId];
                    const relEntries = Object.entries(themeData?.relations || {});
                    if (relEntries.length === 1) {
                        const [relId] = relEntries[0];
                        renderThemeEjercicios(themeId, relId, !wasInIntro);
                    } else {
                        openWikiView(!wasInIntro);
                        const tBtn = Array.from(document.querySelectorAll('#theme-nav .theme-btn')).find(b => b.textContent === `T${themeId}`);
                        openSidebarSubmenu(themeId, tBtn || null);
                    }
                } else {
                    const themeId = parts[2];
                    if (['P1', 'P2', 'C'].includes(themeId)) {
                         const themeData = window.EXERCISES_DATA?.[themeId];
                         const relEntries = Object.entries(themeData?.relations || {});
                         if (relEntries.length === 1) {
                             const [relId] = relEntries[0];
                             renderThemeEjercicios(themeId, relId, !wasInIntro);
                         } else {
                             renderRelations(themeId, !wasInIntro);
                         }
                    } else {
                         renderRelations(themeId, !wasInIntro);
                    }
                }
            } else if (parts.length === 4) {
                const themeId = parts[2].startsWith('T') ? parts[2].slice(1) : parts[2];
                const relId = parts[3];
                renderThemeEjercicios(themeId, relId, !wasInIntro);
            } else if (parts.length === 5) {
                const exName = parts[4];
                const exData = findExerciseIdByName(exName);
                if (exData && (!state.currentExercise || state.currentExercise.name !== exName)) {
                    openIsabelleView(exData, false);
                }
            }
            
            syncSidebarUI();

        } else {
            const wasInApp = DOM.screens.mainApp.classList.contains('active');
            if (wasInApp) {
                transitionToIntro(true);
            } else {
                showIntro(true);
            }
        }
    }

    function findExerciseIdByName(name) {
        // Intentamos búsqueda exacta primero
        for (const [themeId, themeData] of Object.entries(window.EXERCISES_DATA || {})) {
            const relations = themeData.relations || {};
            for (const [relId, relData] of Object.entries(relations)) {
                const exercises = relData.exercises || {};
                const found = Object.values(exercises).find(e => e.name === name);
                if (found) return found;
            }
        }
        
        // Si no, intentamos quitar sufijos comunes (_decl, _auto)
        const baseName = name.replace(/_decl$/, '').replace(/_auto$/, '');
        if (baseName !== name) {
            for (const [themeId, themeData] of Object.entries(window.EXERCISES_DATA || {})) {
                const relations = themeData.relations || {};
                for (const [relId, relData] of Object.entries(relations)) {
                    const exercises = relData.exercises || {};
                    // Buscamos coincidencia flexible en la base del nombre
                    const found = Object.values(exercises).find(e => {
                        const eBase = e.name.replace(/_decl$/, '').replace(/_auto$/, '');
                        return eBase === baseName;
                    });
                    
                    // Si encontramos el base, devolvemos una copia con el nombre modificado
                    // para que openIsabelleView sepa qué variante cargar
                    if (found) return { ...found, name: name, baseTitle: found.title };
                }
            }
        }
        
        return null;
    }

    // ==========================================
    // 10. MAIN INIT
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        initState();
        initDOM();
        initTheme();
        initEffects();
        initSidebar();
        initViews();
        initAdmin();
        initRouter();

        if (typeof revealApp === 'function') {
            revealApp();
        }
    });

})();
