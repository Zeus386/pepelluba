// BOLETIN8.js - Ejercicios del Boletín 8
const BOLETIN8_PROOFS = {
    "b8_e1": {
        title: "Boletín 8 - Ejercicio 1",
        steps: [
            { code: "lemma b8_e1:\n  assumes \"a = b\"\n      and \"P a\"\n  shows \"P b\"", explanation: "Sustitución por igualdad.", activeHyp: ["a = b", "P a"], highlights: ["P b"] },
            { code: "  using assms by auto", explanation: "Resolución automática.", activeHyp: ["P b"], highlights: ["auto"] }
        ]
    }
};
window.BOLETIN8_PROOFS = BOLETIN8_PROOFS;
