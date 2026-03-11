// BOLETIN7.js - Ejercicios del Boletín 7
const BOLETIN7_PROOFS = {
    "b7_e1": {
        title: "Boletín 7 - Ejercicio 1",
        steps: [
            { code: "lemma b7_e1:\n  assumes \"∃x. P x\"\n      and \"∀x. P x --> Q x\"\n  shows \"∃x. Q x\"", explanation: "Paso de existencia por implicación universal.", activeHyp: ["∃x. P x", "∀x. P x ⟶ Q x"], highlights: ["∃x. Q x"] },
            { code: "  using assms by auto", explanation: "Resolución automática.", activeHyp: ["∃x. Q x"], highlights: ["auto"] }
        ]
    }
};
window.BOLETIN7_PROOFS = BOLETIN7_PROOFS;
