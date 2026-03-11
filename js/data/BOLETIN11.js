// BOLETIN11.js - Ejercicios del Boletín 11
const BOLETIN11_PROOFS = {
    "b11_e1": {
        title: "Boletín 11 - Ejercicio 1",
        steps: [
            { code: "lemma b11_e1:\n  fixes n :: nat\n  shows \"n + 0 = n\"", explanation: "Ley neutra de la suma.", activeHyp: [], highlights: ["n + 0"] },
            { code: "  by simp", explanation: "Resolución por simplificación.", activeHyp: [], highlights: ["simp"] }
        ]
    }
};
window.BOLETIN11_PROOFS = BOLETIN11_PROOFS;
