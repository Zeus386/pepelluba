// TEMA1.js - Pruebas para Tema 1

const TEMA1_PROOFS = {
    "1_1_auto": {
        title: "Tema 1 - Ejercicio 1 (Solución Automática)",
        steps: [
            {
                code: "lemma ejercicio_01:\n  assumes \"A --> E\"\n      and \"A\"\n    shows \"E\"\n",
                explanation: "Definición inicial: Establecemos como premisas (assumes) que *A implica E* y que *A* es cierto, y queremos demostrar (shows) que *E* es cierto.",
                activeHyp: ["A ⟶ E", "A"],
                highlights: ["A", "E"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle usa la regla Modus Ponens internamente con `by auto` asumiendo que ambas premisas son ciertas para deducir directamente nuestro objetivo *E*.",
                activeHyp: ["E"],
                highlights: ["auto"]
            }
        ]
    },
    // We can add dummy stubs for the other ones so they render correctly:
    "1_2_auto": {
        title: "Tema 1 - Ejercicio 2 (Solución Automática)",
        steps: [
            { code: "lemma ejercicio_02:\n  assumes \"T & P --> S\"\n  and \"T\"\n  and \"P\"\n  shows \"S\"", explanation: "Se definen las premisas: T y P implica S, y se dan tanto T como P individualmente.", activeHyp: ["T ∧ P ⟶ S", "T", "P"], highlights: ["T", "P", "S"] },
            { code: "  using assms by auto", explanation: "Se aplica resolución automática. Como T y P son ciertos, su conjunción lo es, disparando el Modus Ponens que demuestra S.", activeHyp: ["S"], highlights: ["auto"] }
        ]
    }
};

window.TEMA1_PROOFS = TEMA1_PROOFS;
