// BOLETIN3.js - Ejercicios del Boletín 3
const BOLETIN3_PROOFS = {
    "b3_e1": {
        title: "Boletín 3 - Ejercicio 1",
        steps: [
            { code: "lemma b3_e1:\n  assumes \"A --> B\"\n      and \"B --> C\"\n      and \"A\"\n  shows \"C\"", explanation: "Composición de implicaciones.", activeHyp: ["A ⟶ B", "B ⟶ C", "A"], highlights: ["A", "C"] },
            { code: "  using assms by auto", explanation: "Resolución automática.", activeHyp: ["C"], highlights: ["auto"] }
        ]
    }
};
window.BOLETIN3_PROOFS = BOLETIN3_PROOFS;
