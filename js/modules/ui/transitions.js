
// Transiciones entre pantallas (Intro <-> App)

import { DOM } from '../core/dom.js';
import { state } from '../core/state.js';
import { playIntroSequence } from './effects.js';
import { renderSidebar, closeMobileSidebar, syncMobileSidebarUI } from './sidebar.js';

export async function transitionToApp(withAnimation = true) {
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
        exitAnim.cancel();
    }

    // BUGFIX: limpiar clase direct-logica para que el CSS normal tome el control
    document.documentElement.classList.remove('direct-logica');

    DOM.screens.intro.classList.replace('active', 'hidden');
    DOM.screens.mainApp.classList.replace('hidden', 'active');
    
    // Sidebar active trigger
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
        // Fuerza visibilidad inmediata si no hay animación (carga directa)
        DOM.screens.mainApp.style.opacity = '1';
        DOM.screens.mainApp.style.transform = 'translate3d(0, 0, 0) scale(1)';
    }
    
    if (!state.sidebarInitialized) {
        renderSidebar();
        state.sidebarInitialized = true;
    }
}

export async function transitionToIntro(withAnimation = true) {
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
    
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('active');
    
    syncMobileSidebarUI();
    closeMobileSidebar();
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

export function showIntro(withAnimation = true) {
    transitionToIntro(withAnimation);
}
