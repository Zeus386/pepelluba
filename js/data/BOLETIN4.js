// BOLETIN4.js - Ejercicios del Boletín 4
const BOLETIN4_PROOFS = {
    "b4_e1": {
        title: "Boletín 4 - Ejercicio 1",
        steps: [
            { code: "lemma b4_e1:\n  assumes \"P | Q\"\n      and \"~P\"\n  shows \"Q\"", explanation: "Silogismo disyuntivo.", activeHyp: ["P ∨ Q", "¬P"], highlights: ["Q"] },
            { code: "  using assms by auto", explanation: "Resolución automática.", activeHyp: ["Q"], highlights: ["auto"] }
        ]
    }
};
window.BOLETIN4_PROOFS = BOLETIN4_PROOFS;
