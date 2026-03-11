// BOLETIN5.js - Ejercicios del Boletín 5
const BOLETIN5_PROOFS = {
    "b5_e1": {
        title: "Boletín 5 - Ejercicio 1",
        steps: [
            { code: "lemma b5_e1:\n  assumes \"∀x. P x\"\n  shows \"P a\"", explanation: "Instanciación universal.", activeHyp: ["∀x. P x"], highlights: ["∀", "P"] },
            { code: "  using assms by auto", explanation: "Resolución automática.", activeHyp: ["P a"], highlights: ["auto"] }
        ]
    }
};
window.BOLETIN5_PROOFS = BOLETIN5_PROOFS;
