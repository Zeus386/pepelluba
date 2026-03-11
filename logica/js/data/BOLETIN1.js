// BOLETIN1.js - Ejercicios del Boletín 1
const BOLETIN1_PROOFS = {
    "1_1_auto": {
        title: "Relación 1 - Ejercicio 1",
        steps: [
            {
                code: "lemma ejercicio_01:\n  assumes \"A --> E\"\n      and \"A\"\n    shows \"E\"\n",
                explanation: "Definición inicial: Establecemos como premisas que A implica E y que A es cierto.",
                activeHyp: ["A ⟶ E", "A"],
                highlights: ["A", "E"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle usa Modus Ponens internamente para deducir directamente E.",
                activeHyp: ["E"],
                highlights: ["auto"]
            }
        ]
    },
    "1_2_auto": {
        title: "Relación 1 - Ejercicio 2",
        steps: [
            {
                code: "lemma ejercicio_02:\n  assumes \"T & P --> S\"\n      and \"T\"\n      and \"P\"\n  shows \"S\"",
                explanation: "Premisas conjuntivas para aplicar modus ponens sobre S.",
                activeHyp: ["T ∧ P ⟶ S", "T", "P"],
                highlights: ["S"]
            },
            {
                code: "  using assms by auto",
                explanation: "Cierre automático de la prueba.",
                activeHyp: ["S"],
                highlights: ["auto"]
            }
        ]
    }
};
window.BOLETIN1_PROOFS = BOLETIN1_PROOFS;
