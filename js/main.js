
/**
 * main.js - Punto de entrada de la aplicación
 * Diseño Modular - ES6+
 */

import { initState } from './modules/core/state.js';
import { initDOM } from './modules/core/dom.js';
import { initTheme } from './modules/ui/theme.js';
import { initEffects } from './modules/ui/effects.js';
import { initSidebar } from './modules/ui/sidebar.js';
import { initViews } from './modules/ui/views.js';
import { initRouter } from './modules/core/router.js';
import { initAdmin } from './modules/admin/admin.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Estado (cargar datos, cache, etc.)
    initState();

    // 2. Inicializar Referencias DOM
    initDOM();

    // 3. Inicializar UI Básica
    initTheme();
    initEffects();
    initSidebar();
    initViews();
    initAdmin();

    // 4. Inicializar Router (Arranca la app)
    initRouter();

    // Anti-FOUC Safety: Si el script del head no lo hizo, mostramos ahora
    if (typeof revealApp === 'function') {
        revealApp();
    }
});
