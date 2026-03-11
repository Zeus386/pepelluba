
// Router Multinivel (Intro / Main / Relations / Exercise)

import { DOM } from './dom.js';
import { state } from './state.js';
import { transitionToApp, transitionToIntro, showIntro } from '../ui/transitions.js';
import { 
    openWikiView, 
    renderExamsMenu, 
    renderRelations, 
    renderThemeEjercicios, 
    openIsabelleView 
} from '../ui/views.js';
import { 
    renderSidebar, 
    openSidebarSubmenu, 
    openSidebarSubmenuEx, 
    closeSidebarSubmenu, 
    closeMobileSidebar, 
    syncSidebarUI, 
    syncMobileSidebarUI 
} from '../ui/sidebar.js';

export function initRouter() {
    window.addEventListener('hashchange', router);
    
    // Navegar atrás (Jerarquía Multinivel Mejorada)
    if (DOM.globalBack) {
        DOM.globalBack.addEventListener('click', () => {
            const hash = window.location.hash;
            const parts = hash.split('/');

            if (parts.length === 5) {
                // De Ejercicio a Relación
                window.location.hash = parts.slice(0, 4).join('/');
            } else if (parts.length === 4) {
                // De Relación a Tema o Examen
                window.location.hash = parts.slice(0, 3).join('/');
            } else if (parts.length === 3) {
                // De Tema a Intro, o de P1/P2/C a Menú EX
                if (['P1', 'P2', 'C'].includes(parts[2])) {
                    window.location.hash = '#/logica/EX';
                } else {
                    window.location.hash = '#/logica'; // De Tema a Wiki
                }
            } else if (parts.length === 2 && parts[1] === 'logica') {
                // De Wiki a Intro
                window.location.hash = '';
            } else {
                window.location.hash = '';
            }
        });
    }

    // Intro button
    if (DOM.intro.btn) {
        DOM.intro.btn.addEventListener('click', () => {
            window.location.hash = '#/logica';
        });
    }

    // Initial check
    router();
}

async function router() {
    const hash = window.location.hash;
    closeSidebarSubmenu();

    if (hash.startsWith('#/logica')) {
        const parts = hash.split('/');
        const wasInIntro = DOM.screens.intro.classList.contains('active');
        const isDirect = document.documentElement.classList.contains('direct-logica');

        // 1. Asegurar estado de la App
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

        // 2. Sub-routing Jerárquico
        if (parts.length === 2) {
            // #/logica -> Wiki
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
                // Check if it's P1, P2, C (Exams sub-routes)
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
                     // Fallback logic
                     renderRelations(themeId, !wasInIntro);
                }
            }
        } else if (parts.length === 4) {
            // #/logica/T1/rel1 -> Lista de Ejercicios
            const themeId = parts[2].startsWith('T') ? parts[2].slice(1) : parts[2];
            const relId = parts[3];
            renderThemeEjercicios(themeId, relId, !wasInIntro);
        } else if (parts.length === 5) {
            // #/logica/T1/rel1/exName -> Editor
            const exName = parts[4];
            const exData = findExerciseIdByName(exName);
            if (exData && (!state.currentExercise || state.currentExercise.name !== exName)) {
                openIsabelleView(exData, false);
            }
        }
        
        // 3. Sincronizar Sidebar
        syncSidebarUI();

    } else {
        // Mostrar Intro
        const wasInApp = DOM.screens.mainApp.classList.contains('active');
        if (wasInApp) {
            transitionToIntro(true);
        } else {
            showIntro(true);
        }
    }
}

function findExerciseIdByName(name) {
    // Búsqueda profunda jerárquica: Tema -> Relación -> Ejercicio
    for (const [themeId, themeData] of Object.entries(window.EXERCISES_DATA || {})) {
        const relations = themeData.relations || {};
        for (const [relId, relData] of Object.entries(relations)) {
            const exercises = relData.exercises || {};
            const found = Object.values(exercises).find(e => e.name === name);
            if (found) return found;
        }
    }
    return null;
}
