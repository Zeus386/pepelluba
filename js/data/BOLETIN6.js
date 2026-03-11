// BOLETIN6.js - Ejercicios del Boletín 6
const BOLETIN6_PROOFS = {
    "b6_e1": {
        title: "Boletín 6 - Ejercicio 1",
        steps: [
            { code: "lemma b6_e1:\n  assumes \"∀x. P x --> Q x\"\n      and \"P a\"\n  shows \"Q a\"", explanation: "Aplicación de implicación universal.", activeHyp: ["∀x. P x ⟶ Q x", "P a"], highlights: ["Q a"] },
            { code: "  using assms by auto", explanation: "Resolución automática.", activeHyp: ["Q a"], highlights: ["auto"] }
        ]
    }
};
window.BOLETIN6_PROOFS = BOLETIN6_PROOFS;
