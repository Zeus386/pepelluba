
// Estado Global de la Aplicación
// Gestiona la información volátil y persistente de la sesión

export const state = {
    themes: [],
    currentThemeId: null,
    currentRelationId: null,
    currentExercise: null,
    currentStep: -1,
    sidebarInitialized: false,
    proofs: {}
};

// Inicialización del estado desde window (para compatibilidad con scripts legacy)
export function initState() {
    state.themes = Object.keys(window.EXERCISES_DATA || {}).sort((a, b) => Number(a) - Number(b));
    state.proofs = { ...(window.ALL_PROOFS || {}) };
    
    // Merge admin cache logic
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

// Helpers privados para validación de caché
function isHierarchicalConfig(cfg) {
    if (!cfg || typeof cfg !== 'object') return false;
    return Object.values(cfg).every(theme =>
        theme &&
        typeof theme === 'object' &&
        theme.relations &&
        typeof theme.relations === 'object'
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
