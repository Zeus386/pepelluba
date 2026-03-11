
// Panel de Administración (GitHub API)

import { DOM } from '../core/dom.js';
import { state } from '../core/state.js';

const adminDOM = {
    view: null,
    closeBtn: null,
    loginBox: null,
    dashboard: null,
    ghUser: null,
    ghRepo: null,
    ghToken: null,
    ghRemember: null,
    loginBtn: null,
    authMsg: null,
    connectedUser: null,
    // CRUD screens
    screenThemes: null,
    screenExercises: null,
    screenEditor: null,
    themeList: null,
    exTitle: null,
    exList: null,
    newExBtn: null,
    backThemes: null,
    backExs: null,
    editorTitle: null,
    exTitleInput: null,
    exName: null,
    exMethod: null,
    stepsContainer: null,
    addStepBtn: null,
    saveBtn: null,
    saveMsg: null,
    // AI Import
    importAiBtn: null,
    screenImportAi: null,
    backExsFromAi: null,
    aiCopyPromptBtn: null,
    aiCopyMsg: null,
    aiJsonInput: null,
    aiProcessBtn: null,
    aiErrorMsg: null
};

let admState = { themeId: null, exKey: null, isNew: false, relationId: null };

export function initAdmin() {
    // Populate DOM refs
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

    // Attach listeners
    if (adminDOM.closeBtn) {
        adminDOM.closeBtn.addEventListener('click', () => {
            adminDOM.view.classList.replace('active-view', 'hidden-view');
            // Navigate back to wiki via router
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

export function openAdminView() {
    if (!adminDOM.view) return;
    
    // Hide other views
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
        // Styling fix for the card since we're generating it dynamically
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

// GitHub Helpers
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
