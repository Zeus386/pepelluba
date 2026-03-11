// BOLETIN1.js - Ejercicios del Boletín 1
const BOLETIN1_PROOFS = {
    "1_1_auto": {
        title: "Relación 1 - Ejercicio 1",
        steps: [
            {
                code: "lemma ejercicio_01:\n  assumes \"A --> E\"\n      and \"A\"\n    shows \"E\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Si Juan es andaluz entonces Juan es europeo. Efectivamente, Juan es andaluz. Por lo tanto, Juan es europeo.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">A</span>: Juan es andaluz</div>
      <div class="symbol-item"><span class="symbol-key">E</span>: Juan es europeo</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Cuando tanto la temperatura como la presión atmosférica permanecen constantes, no llueve. La temperatura permanece constante. Por lo tanto, en caso de que llueva, la presión atmosférica no permanece constante.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">T</span>: La temperatura permanece constante</div>
      <div class="symbol-item"><span class="symbol-key">P</span>: La presión atmosférica permanece constante</div>
      <div class="symbol-item"><span class="symbol-key">L</span>: Llueve</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Siempre que un número x es divisible por 10, acaba en 0. El número x no acaba en 0. Por lo tanto, x no es divisible por 10.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">D</span>: El número es divisible por 10</div>
      <div class="symbol-item"><span class="symbol-key">C</span>: El número acaba en cero</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">En cierto experimento, cuando hemos empleado un fármaco A, el paciente ha mejorado considerablemente en el caso, y sólo en el caso, en que no se haya empleado también un fármaco B. Además, o se ha empleado el fármaco A o se ha empleado el fármaco B. En consecuencia, podemos afirmar que si no hemos empleado el fármaco B, el paciente ha mejorado considerablemente.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">A</span>: Hemos empleado el fármaco A</div>
      <div class="symbol-item"><span class="symbol-key">B</span>: Hemos empleado el fármaco B</div>
      <div class="symbol-item"><span class="symbol-key">M</span>: El paciente ha mejorado notablemente</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Si no está el mañana ni el ayer escrito, entonces no está el mañana escrito.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">M</span>: El mañana está escrito</div>
      <div class="symbol-item"><span class="symbol-key">A</span>: El ayer está escrito</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Me matan si no trabajo y si trabajo me matan. Me matan siempre me matan.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">M</span>: Me matan</div>
      <div class="symbol-item"><span class="symbol-key">T</span>: Trabajo</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Si te llamé por teléfono, entonces recibiste mi llamada y no es cierto que no te avisé del peligro que corrías. Por consiguiente, como te llamé, es cierto que te avisé del peligro que corrías.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">T</span>: Te llamé por teléfono</div>
      <div class="symbol-item"><span class="symbol-key">R</span>: Recibiste mi llamada</div>
      <div class="symbol-item"><span class="symbol-key">P</span>: Te avisé del peligro que corrías</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Si no hay control de nacimientos, entonces la población crece ilimitadamente; pero si la población crece ilimitadamente, aumentará el índice de pobreza. Por consiguiente, si no hay control de nacimientos, aumentará el índice de pobreza.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">N</span>: Hay control de nacimientos</div>
      <div class="symbol-item"><span class="symbol-key">P</span>: La población crece ilimitadamente</div>
      <div class="symbol-item"><span class="symbol-key">I</span>: Aumentará el índice de pobreza</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Si el general fuera leal habría cumplido las órdenes, y si fuera inteligente las habría entendido. O el general no cumplió las órdenes o no las entendió. Luego, el general era desleal o no era inteligente.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">L</span>: El general es leal</div>
      <div class="symbol-item"><span class="symbol-key">C</span>: El general cumple las órdenes</div>
      <div class="symbol-item"><span class="symbol-key">I</span>: El general es inteligente</div>
      <div class="symbol-item"><span class="symbol-key">E</span>: El general entiende las órdenes</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Si Zeus fuera capaz de evitar el mal y quisiera hacerlo, lo haría. Si Zeus fuera incapaz de evitar el mal, no sería omnipotente; si no quisiera evitar el mal sería malévolo. Zeus no evita el mal. Si Zeus existe, es omnipotente y no es malévolo. Luego, Zeus no existe.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">C</span>: Zeus es capaz de evitar el mal</div>
      <div class="symbol-item"><span class="symbol-key">Q</span>: Zeus quiere evitar el mal</div>
      <div class="symbol-item"><span class="symbol-key">Om</span>: Zeus es omnipotente</div>
      <div class="symbol-item"><span class="symbol-key">M</span>: Zeus es malévolo</div>
      <div class="symbol-item"><span class="symbol-key">P</span>: Zeus evita el mal</div>
      <div class="symbol-item"><span class="symbol-key">E</span>: Zeus existe</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Nadie más que Pedro, Quintín y Raúl están bajo sospecha y al menos uno es traidor. Si Quintín es el traidor entonces lleva al menos un cómplice (que puede ser Pedro o Raúl). Raúl es leal. Por lo tanto, Pedro es traidor.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">P</span>: Pedro es traidor</div>
      <div class="symbol-item"><span class="symbol-key">Q</span>: Quintín es traidor</div>
      <div class="symbol-item"><span class="symbol-key">R</span>: Raúl es traidor</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Si la válvula está abierta o la monitorización está preparada, entonces se envía una señal de reconocimiento y un mensaje de funcionamiento al controlador del ordenador. Si se envía un mensaje de funcionamiento al controlador del ordenador o el sistema está en estado normal, entonces se aceptan las órdenes del operador. Por lo tanto, si la válvula está abierta, entonces se aceptan las órdenes del operador.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">A</span>: La válvula está abierta</div>
      <div class="symbol-item"><span class="symbol-key">P</span>: La monitorización está preparada</div>
      <div class="symbol-item"><span class="symbol-key">R</span>: Envía una señal de reconocimiento</div>
      <div class="symbol-item"><span class="symbol-key">F</span>: Envía un mensaje de funcionamiento</div>
      <div class="symbol-item"><span class="symbol-key">N</span>: El sistema está en estado normal</div>
      <div class="symbol-item"><span class="symbol-key">Or</span>: Se aceptan órdenes del operador</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Si trabajo gano dinero, pero si no trabajo gozo de la vida. Sin embargo, si trabajo no gozo de la vida, mientras que si no trabajo no gano dinero. Por lo tanto, gozo de la vida si y sólo si no gano dinero.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">T</span>: Trabajo</div>
      <div class="symbol-item"><span class="symbol-key">D</span>: Gano dinero</div>
      <div class="symbol-item"><span class="symbol-key">V</span>: Gozo de la vida</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Formalizar la argumentación y demostrar su corrección.</div>
  </div>
</div>`,
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
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Problema de la Isla: A dice 'B y C son veraces si y solo si C es veraz'. B dice 'Si A y C son veraces, entonces B y C son veraces y A es mentiroso'. C dice 'B es mentiroso si y solo si A o B es veraz'.</div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Simbolización</div>
    <div class="problem-symbolization">
      <div class="symbol-item"><span class="symbol-key">A, B, C</span>: Personas veraces o mentirosas</div>
    </div>
  </div>
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-goal">Determinar quién es veraz y quién es mentiroso.</div>
  </div>
</div>`,
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
