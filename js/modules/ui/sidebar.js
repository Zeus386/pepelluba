
// Gestión de la Barra Lateral y Navegación Móvil

import { DOM } from '../core/dom.js';
import { state } from '../core/state.js';
import { openAdminView } from '../admin/admin.js';

let sidebarSubmenu;
let sidebarSubmenuNav;
let sidebarSubmenuThemeId = null;
let sidebarSubmenuAnchorBtn = null;
let hasSubmenuGlobalListeners = false;
let mobileSidebarMedia;
let sidebar;
let mobileSidebarToggle;
let mobileSidebarBackdrop;

export function initSidebar() {
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

export function renderSidebar() {
    const frag = document.createDocumentFragment();

    // 1. Botón Guía/Wiki (Con Long Press para Admin Panel)
    const wikiBtn = document.createElement('button');
    wikiBtn.className = 'theme-btn active';
    wikiBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>';
    wikiBtn.title = 'Guía / Wiki';
    wikiBtn.dataset.themeId = 'Wiki';

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

    // Separador sutil
    const divider1 = document.createElement('div');
    divider1.className = 'sidebar-divider';
    frag.appendChild(divider1);

    // 2. Lista de Temas (T1-T6)
    DOM.themeBtns = [];
    // We use the themes from state, but for the buttons we might want a fixed list or dynamic
    // The original code had a fixed list ["1", "2", "3", "4", "5", "6"]
    const themesList = ["1", "2", "3", "4", "5", "6"]; 
    themesList.forEach((themeId) => {
        const btn = document.createElement('button');
        btn.className = 'theme-btn';
        btn.textContent = `T${themeId}`;
        btn.title = `Tema ${themeId}`;
        btn.dataset.themeId = themeId;
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

    // Separador para Exámenes
    const divider2 = document.createElement('div');
    divider2.className = 'sidebar-divider';
    frag.appendChild(divider2);

    // 3. Botón EX (Exámenes)
    const exBtn = document.createElement('button');
    exBtn.className = 'theme-btn';
    exBtn.textContent = 'EX';
    exBtn.dataset.themeId = 'EX';
    exBtn.title = 'Exámenes';
    exBtn.setAttribute('aria-expanded', 'false');
    exBtn.onclick = () => {
        closeSidebarSubmenu();
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

export function syncSidebarUI() {
    const hash = window.location.hash;
    if (!DOM.themeNav) return;
    
    const btns = DOM.themeNav.querySelectorAll('.theme-btn');
    btns.forEach(btn => {
        btn.classList.remove('active');
        const themeId = btn.dataset.themeId;
        
        // Si el botón es Wiki
        if (themeId === 'Wiki' && (hash === '#/logica' || hash === '')) {
            btn.classList.add('active');
        }
        
        // Si el botón es un Tema (T1, T2...)
        if (hash.includes('/T')) {
            const parts = hash.split('/');
            const themePart = parts[2]; // ej: T1
            if (themeId && themePart === `T${themeId}`) btn.classList.add('active');
        }
        
        // Si el botón es EX (incluye EX, P1, P2, C)
        if (themeId === 'EX' && (hash.includes('/EX') || hash.includes('/P1') || hash.includes('/P2') || hash.includes('/C'))) {
            btn.classList.add('active');
        }
    });
}

// Submenu Logic

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

export function closeSidebarSubmenu() {
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

export function openSidebarSubmenu(themeId, anchorBtn) {
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

export function openSidebarSubmenuEx(anchorBtn) {
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

export function closeMobileSidebar() {
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

export function syncMobileSidebarUI() {
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
