// SEGUNDO_PARCIAL.js - Exámenes de Segundo Parcial
const SEGUNDO_PARCIAL_PROOFS = {
    "p2_2023_e1": {
        title: "Segundo Parcial 2023 - Ejercicio 1",
        steps: [
            { code: "lemma p2_2023_e1:\n  assumes \"A & B\"\n  shows \"A\"", explanation: "Eliminación de conjunción.", activeHyp: ["A ∧ B"], highlights: ["A"] },
            { code: "  using assms by auto", explanation: "Cierre automático.", activeHyp: ["A"], highlights: ["auto"] }
        ]
    }
};
window.SEGUNDO_PARCIAL_PROOFS = SEGUNDO_PARCIAL_PROOFS;
