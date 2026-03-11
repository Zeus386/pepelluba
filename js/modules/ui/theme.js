
// Gestión de Tema (Oscuro / Claro)

import { DOM } from '../core/dom.js';

export function initTheme() {
    const theme = localStorage.getItem('pepeweb_theme') || 'light';
    const isDark = (theme === 'dark');
    const htmlEl = document.documentElement;

    if (isDark) {
        document.body.classList.add('dark-mode');
    }
    
    // Remove preload class
    if (htmlEl.classList.contains('dark-mode-preload')) {
        htmlEl.classList.remove('dark-mode-preload');
    }

    // Attach listeners
    if (DOM.themeToggles) {
        DOM.themeToggles.forEach(t => {
            t.checked = isDark;
            t.onchange = () => {
                const checked = t.checked;
                // Sync all toggles
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
