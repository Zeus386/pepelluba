// PRIMER_PARCIAL.js - Exámenes de Primer Parcial
const PRIMER_PARCIAL_PROOFS = {
    "p1_2023_e1": {
        title: "Primer Parcial 2023 - Ejercicio 1",
        steps: [
            { code: "lemma p1_2023_e1:\n  assumes \"P --> Q\" and \"P\"\n  shows \"Q\"", explanation: "Modus ponens directo.", activeHyp: ["P ⟶ Q", "P"], highlights: ["Q"] },
            { code: "  using assms by auto", explanation: "Cierre automático.", activeHyp: ["Q"], highlights: ["auto"] }
        ]
    }
};
window.PRIMER_PARCIAL_PROOFS = PRIMER_PARCIAL_PROOFS;
