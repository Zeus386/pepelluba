// BOLETIN1.js - Ejercicios del Boletín 1
const BOLETIN1_PROOFS = {
    "1_1_auto": {
        title: "Relación 1 - Ejercicio 1",
        steps: [
            {
                code: "lemma ejercicio_01:\n  assumes \"A --> E\"\n      and \"A\"\n    shows \"E\"",
                explanation: "Definición inicial: Si A implica E y A es cierto, entonces E.",
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
                code: "lemma ejercicio_02:\n  assumes \"(T & P) --> ~L\"\n      and \"T\"\n    shows \"L --> ~P\"",
                explanation: "Si (T y P) implica no L, y tenemos T, entonces si L ocurre, P no puede ser cierto.",
                activeHyp: ["(T ∧ P) ⟶ ¬L", "T"],
                highlights: ["L", "P"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle resuelve la implicación por contrapositiva automáticamente.",
                activeHyp: ["L ⟶ ¬P"],
                highlights: ["auto"]
            }
        ]
    },
    "1_3_auto": {
        title: "Relación 1 - Ejercicio 3",
        steps: [
            {
                code: "lemma ejercicio_03:\n  assumes \"D --> C\"\n      and \"~C\"\n    shows \"~D\"",
                explanation: "Modus Tollens: Si D implica C, y C es falso, entonces D debe ser falso.",
                activeHyp: ["D ⟶ C", "¬C"],
                highlights: ["D"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle aplica Modus Tollens automáticamente.",
                activeHyp: ["¬D"],
                highlights: ["auto"]
            }
        ]
    },
    "1_4_auto": {
        title: "Relación 1 - Ejercicio 4",
        steps: [
            {
                code: "lemma ejercicio_04:\n  assumes \"A --> (M = (~B))\"\n      and \"A | B\"\n    shows \"~B --> M\"",
                explanation: "Dadas las premisas sobre A, B y M, probamos que si no B, entonces M.",
                activeHyp: ["A ⟶ (M ⟷ ¬B)", "A ∨ B"],
                highlights: ["B", "M"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle deduce la conclusión automáticamente.",
                activeHyp: ["¬B ⟶ M"],
                highlights: ["auto"]
            }
        ]
    },
    "1_5_auto": {
        title: "Relación 1 - Ejercicio 5",
        steps: [
            {
                code: "lemma ejercicio_05:\n  assumes \"~M & ~A\"\n    shows \"~M\"",
                explanation: "Tautología simple: De una conjunción se puede deducir cualquiera de sus partes.",
                activeHyp: ["¬M ∧ ¬A"],
                highlights: ["M"]
            },
            {
                code: "  using assms by auto",
                explanation: "Eliminación de la conjunción automática.",
                activeHyp: ["¬M"],
                highlights: ["auto"]
            }
        ]
    },
    "1_6_auto": {
        title: "Relación 1 - Ejercicio 6",
        steps: [
            {
                code: "lemma ejercicio_06:\n  assumes \"(~T --> M) & (T --> M)\"\n    shows \"M\"",
                explanation: "Dilema constructivo: Tanto si T ocurre como si no, M es cierto.",
                activeHyp: ["(¬T ⟶ M) ∧ (T ⟶ M)"],
                highlights: ["M"]
            },
            {
                code: "  using assms by auto",
                explanation: "Análisis por casos automático.",
                activeHyp: ["M"],
                highlights: ["auto"]
            }
        ]
    },
    "1_7_auto": {
        title: "Relación 1 - Ejercicio 7",
        steps: [
            {
                code: "lemma ejercicio_07:\n  assumes \"T --> (R & ~(~P))\"\n      and \"T\"\n    shows \"P\"",
                explanation: "Doble negación implícita: ~(~P) equivale a P.",
                activeHyp: ["T ⟶ (R ∧ ¬¬P)", "T"],
                highlights: ["P"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle simplifica la doble negación y aplica Modus Ponens.",
                activeHyp: ["P"],
                highlights: ["auto"]
            }
        ]
    },
    "1_8_auto": {
        title: "Relación 1 - Ejercicio 8",
        steps: [
            {
                code: "lemma ejercicio_08:\n  assumes \"~N --> P\"\n      and \"P --> I\"\n    shows \"~N --> I\"",
                explanation: "Silogismo Hipotético: Si A -> B y B -> C, entonces A -> C.",
                activeHyp: ["¬N ⟶ P", "P ⟶ I"],
                highlights: ["N", "I"]
            },
            {
                code: "  using assms by auto",
                explanation: "Transitividad de la implicación automática.",
                activeHyp: ["¬N ⟶ I"],
                highlights: ["auto"]
            }
        ]
    },
    "1_9_auto": {
        title: "Relación 1 - Ejercicio 9",
        steps: [
            {
                code: "lemma ejercicio_09:\n  assumes \"L --> C\"\n      and \"I --> E\"\n      and \"~C | ~E\"\n    shows \"~L | ~I\"",
                explanation: "Dilema destructivo: Si los consecuentes son falsos, los antecedentes deben serlo.",
                activeHyp: ["L ⟶ C", "I ⟶ E", "¬C ∨ ¬E"],
                highlights: ["L", "I"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle resuelve el dilema automáticamente.",
                activeHyp: ["¬L ∨ ¬I"],
                highlights: ["auto"]
            }
        ]
    },
    "1_10_auto": {
        title: "Relación 1 - Ejercicio 10 (Zeus)",
        steps: [
            {
                code: "lemma ejercicio_10:\n  assumes \"(C & Q) --> P\"\n      and \"~C --> ~Om\"\n      and \"~Q --> M\"\n      and \"~P\"\n      and \"E --> (Om & ~M)\"\n    shows \"~E\"",
                explanation: "Reducción al absurdo: Las premisas sobre Zeus llevan a una contradicción si existe.",
                activeHyp: ["Premisas sobre Zeus"],
                highlights: ["E"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle encuentra la contradicción y prueba la no existencia.",
                activeHyp: ["¬E"],
                highlights: ["auto"]
            }
        ]
    },
    "1_11_auto": {
        title: "Relación 1 - Ejercicio 11",
        steps: [
            {
                code: "lemma ejercicio_11:\n  assumes \"P | Q | R\"\n      and \"Q --> (P | R)\"\n      and \"~R\"\n    shows \"P\"",
                explanation: "Proceso de eliminación para encontrar al culpable.",
                activeHyp: ["P ∨ Q ∨ R", "Q ⟶ (P ∨ R)", "¬R"],
                highlights: ["P"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle descarta las opciones imposibles.",
                activeHyp: ["P"],
                highlights: ["auto"]
            }
        ]
    },
    "1_12_auto": {
        title: "Relación 1 - Ejercicio 12",
        steps: [
            {
                code: "lemma ejercicio_12:\n  assumes \"(A | P) --> (R & F)\"\n      and \"(F | N) --> Or\"\n    shows \"A --> Or\"",
                explanation: "Cadena de implicaciones lógicas en un sistema de control.",
                activeHyp: ["(A ∨ P) ⟶ (R ∧ F)", "(F ∨ N) ⟶ Or"],
                highlights: ["A", "Or"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle conecta las condiciones automáticamente.",
                activeHyp: ["A ⟶ Or"],
                highlights: ["auto"]
            }
        ]
    },
    "1_13_auto": {
        title: "Relación 1 - Ejercicio 13",
        steps: [
            {
                code: "lemma ejercicio_13:\n  assumes \"T --> D\"\n      and \"~T --> V\"\n      and \"T --> ~V\"\n      and \"~T --> ~D\"\n    shows \"V = (~D)\"",
                explanation: "Equivalencia lógica derivada de implicaciones contradictorias.",
                activeHyp: ["Premisas sobre Trabajo y Vida"],
                highlights: ["V", "D"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle prueba la doble implicación.",
                activeHyp: ["V ⟷ ¬D"],
                highlights: ["auto"]
            }
        ]
    },
    "1_extra_auto": {
        title: "Relación 1 - Extra: Veraces y Mentirosos",
        steps: [
            {
                code: "lemma solucion_veraces:\n  assumes \"A = ((B & C) = C)\"\n      and \"B = ((A & C) --> (B & C & ~A))\"\n      and \"C = ((~B) = (A | B))\"\n    shows \"A & B & ~C\"",
                explanation: "Problema lógico de la isla de veraces y mentirosos.",
                activeHyp: ["Reglas de la Isla"],
                highlights: ["A", "B", "C"]
            },
            {
                code: "  using assms by auto",
                explanation: "Isabelle encuentra la única asignación de verdad consistente.",
                activeHyp: ["A ∧ B ∧ ¬C"],
                highlights: ["auto"]
            }
        ]
    }
};
window.BOLETIN1_PROOFS = BOLETIN1_PROOFS;
