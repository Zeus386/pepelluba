
// Efectos Visuales y Animaciones

import { DOM } from '../core/dom.js';

export function initEffects() {
    if (window.matchMedia("(pointer: fine)").matches) {
        initCustomCursor();
        initBackgroundParallax();
    }
    
    // Artistic label for global back
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

export async function playIntroSequence() {
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
