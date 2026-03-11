// CONVOCATORIA.js - Exámenes de Convocatoria
const CONVOCATORIA_PROOFS = {
    "c_2023_e1": {
        title: "Convocatoria 2023 - Ejercicio 1",
        steps: [
            { code: "lemma c_2023_e1:\n  assumes \"A | B\"\n  shows \"B | A\"", explanation: "Conmutatividad de la disyunción.", activeHyp: ["A ∨ B"], highlights: ["B ∨ A"] },
            { code: "  using assms by auto", explanation: "Cierre automático.", activeHyp: ["B ∨ A"], highlights: ["auto"] }
        ]
    }
};
window.CONVOCATORIA_PROOFS = CONVOCATORIA_PROOFS;
