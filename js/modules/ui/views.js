
// Gestión de Vistas Principales (Wiki, Relaciones, Ejercicios, Editor)

import { DOM } from '../core/dom.js';
import { state } from '../core/state.js';
import { openSidebarSubmenuEx, openSidebarSubmenu, closeSidebarSubmenu, closeMobileSidebar } from './sidebar.js';
import { openAdminView } from '../admin/admin.js';

export function initViews() {
    // Listeners para el editor Isabelle
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
                // Reset
                state.currentStep = -1;
                DOM.isabelle.codeContainer.innerHTML = '';
                DOM.isabelle.explanation.innerHTML = '<span style="color:var(--c-text-muted);font-style:italic">Prueba reiniciada.</span>';
                DOM.isabelle.hypotheses.innerHTML = '';
                DOM.isabelle.progress.style.width = '0%';
                DOM.isabelle.btnPrev.disabled = true;
            }
        });
    }

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
}

export function openWikiView(animate = true) {
    state.currentThemeId = null; // Reset theme state
    state.currentRelationId = null;
    const alreadyActive = DOM.views.wiki.classList.contains('active-view');

    if (DOM.views.exercises.classList.contains('active-view')) DOM.views.exercises.classList.replace('active-view', 'hidden-view');
    if (DOM.views.relations && DOM.views.relations.classList.contains('active-view')) DOM.views.relations.classList.replace('active-view', 'hidden-view');
    if (DOM.views.isabelle.classList.contains('active-view')) DOM.views.isabelle.classList.replace('active-view', 'hidden-view');
    if (DOM.adminView && DOM.adminView.classList.contains('active-view')) DOM.adminView.classList.replace('active-view', 'hidden-view');

    DOM.views.wiki.classList.remove('hidden-view');
    DOM.views.wiki.classList.add('active-view');

    // Solo animar si no estaba ya activa y se solicita animación
    if (!alreadyActive && animate) {
        DOM.views.wiki.animate([
            { opacity: 0, transform: 'translate3d(0, 10px, 0)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0)' }
        ], { duration: 400, easing: 'ease-out' });
    }
}

export function renderExamsMenu(animate = true) {
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

export function renderRelations(themeId, animate = true) {
    const themeData = window.EXERCISES_DATA[themeId];
    if (!themeData) {
        console.error(`No theme data for: ${themeId}`);
        return;
    }

    state.currentThemeId = themeId;
    state.currentRelationId = null;

    // Ocultar otras vistas
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

export function renderThemeEjercicios(themeId, relationId, animate = true) {
    const themeData = window.EXERCISES_DATA[themeId];
    if (!themeData) return;
    const relationData = themeData.relations[relationId];
    if (!relationData) return;

    state.currentThemeId = themeId;
    state.currentRelationId = relationId;

    // Ocultar otras vistas
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
                <div style="font-size: 0.65rem; opacity: 0.5; margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">Ejercicio</div>
            </div>
        `;

        setupCardInteractions(card);

        card.onclick = () => {
            const prefix = themeId.startsWith('P') || themeId === 'C' ? '' : 'T';
            window.location.hash = `#/logica/${prefix}${themeId}/${relationId}/${exData.name}`;
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

    card.addEventListener("pointermove", (e) => {
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
    }, { passive: true });

    card.addEventListener("pointerleave", () => {
        if (rafId) cancelAnimationFrame(rafId);
        cardRect = null;
        card.style.setProperty("--ratio-x", 0);
        card.style.setProperty("--ratio-y", 0);
        card.style.setProperty("--correction", "100%");
    }, { passive: true });
}

export function openIsabelleView(exMetadata, animate = true) {
    const proofId = exMetadata.name;
    // SINGLE SOURCE OF TRUTH: window.ALL_PROOFS (populated in state)
    // We should use state.proofs if updated, but window.ALL_PROOFS is the global fallback
    const proofData = window.ALL_PROOFS[proofId];

    if (!proofData) {
        console.warn("Prueba no encontrada en ALL_PROOFS:", proofId);
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

    // Transitions
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

    // Mantener global header
    DOM.globalHeader.classList.remove('hidden-element');

    // Reset botones de icono
    DOM.isabelle.btnNext.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>';
}

export function exitExerciseView(updateHistory = true) {
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

export function renderStep() {
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

    // AutoScroll Nativo inmediato
    setTimeout(() => {
        DOM.isabelle.codeScroll.scrollTo({
            top: DOM.isabelle.codeScroll.scrollHeight,
            behavior: 'smooth'
        });
    }, 30);

    // Actualizar textos
    DOM.isabelle.explanation.innerHTML = `<strong>Paso ${stepIdx + 1}:</strong> ` + currentData.explanation;

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
