// BOLETIN2.js - Ejercicios del Boletín 2
const BOLETIN2_PROOFS = {
    "2_1": {
        title: "Relación 2 - Ejercicio 1",
        steps: [
            { code: "lemma ex_2_1:\n  assumes \"A\"\n  shows \"A\"", explanation: "Identidad básica.", activeHyp: ["A"], highlights: ["A"] },
            { code: "  by (rule assms)", explanation: "Usamos la premisa directamente.", activeHyp: ["A"], highlights: ["assms"] }
        ]
    }
};
window.BOLETIN2_PROOFS = BOLETIN2_PROOFS;
