// BOLETIN5.js - R05: Deducción natural en lógica proposicional (III)
const BOLETIN5_PROOFS = {
    "b5_e1": {
        title: "Relación 5 - Ejercicio 1",
        steps: [
            {
                code: "lemma ejercicio01:\n  assumes \"p ∧ q ⟶ r ∨ s\"\n      and \"q ⟶ ¬s\"\n  shows \"p ⟶ ¬q ∨ r\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">{ p ∧ q ⟶ r ∨ s, q ⟶ ¬s } ⊢ p ⟶ ¬q ∨ r</div>
  </div>
</div>`,
                activeHyp: ["p ∧ q ⟶ r ∨ s", "q ⟶ ¬s"],
                highlights: ["p", "q", "r"]
            }
        ]
    },
    "b5_e2": {
        title: "Relación 5 - Ejercicio 2",
        steps: [
            {
                code: "lemma ejercicio02:\n  shows \"(p ⟶ q) ⟶ ((¬p ⟶ q) ⟶ q)\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">⊢ (p ⟶ q) ⟶ ((¬p ⟶ q) ⟶ q)</div>
  </div>
</div>`,
                activeHyp: [],
                highlights: ["p", "q"]
            }
        ]
    },
    "b5_e3": {
        title: "Relación 5 - Ejercicio 3",
        steps: [
            {
                code: "lemma ejercicio03:\n  assumes \"((p ⟶ q) ∨ r) ⟶ p\"\n      and \"¬p\"\n  shows \"False\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Enunciado</div>
    <div class="problem-text">Demostrar que el siguiente conjunto de fórmulas es inconsistente: { ((p ⟶ q) ∨ r) ⟶ p, ¬p }</div>
  </div>
</div>`,
                activeHyp: ["((p ⟶ q) ∨ r) ⟶ p", "¬p"],
                highlights: ["False"]
            }
        ]
    },
    "b5_e4": {
        title: "Relación 5 - Ejercicio 4",
        steps: [
            {
                code: "lemma ejercicio04:\n  shows \"(¬q ⟶ ¬p) ∨ (q ⟶ p)\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">⊢ (¬q ⟶ ¬p) ∨ (q ⟶ p)</div>
  </div>
</div>`,
                activeHyp: [],
                highlights: ["p", "q"]
            }
        ]
    },
    "b5_e5": {
        title: "Relación 5 - Ejercicio 5",
        steps: [
            {
                code: "lemma ejercicio05:\n  shows \"p ∨ (q ⟶ ¬(p ⟷ q))\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">⊢ p ∨ (q ⟶ ¬(p ⟷ q))</div>
  </div>
</div>`,
                activeHyp: [],
                highlights: ["p", "q"]
            }
        ]
    },
    "b5_e6": {
        title: "Relación 5 - Ejercicio 6",
        steps: [
            {
                code: "lemma ejercicio06:\n  shows \"((p ⟶ r) ∨ (q ⟶ s)) ⟶ ((p ∧ q) ⟶ (r ∨ s))\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">⊢ ((p ⟶ r) ∨ (q ⟶ s)) ⟶ ((p ∧ q) ⟶ (r ∨ s))</div>
  </div>
</div>`,
                activeHyp: [],
                highlights: []
            },
            {
                code: "  apply (rule impI)+\n  apply (erule disjE)",
                explanation: "Introducimos las implicaciones y aplicamos eliminación del disyuntor sobre la premisa principal.",
                activeHyp: ["p ∧ q", "(p ⟶ r) ∨ (q ⟶ s)"],
                highlights: ["impI", "disjE"]
            },
            {
                code: "   apply (frule conjunct1)\n   apply (frule(1) mp)\n   apply (erule disjI1)",
                explanation: "Para el primer caso (p ⟶ r), extraemos p de la conjunción, aplicamos Modus Ponens para obtener r, e introducimos el disyuntor r ∨ s.",
                activeHyp: ["p", "r", "r ∨ s"],
                highlights: ["mp", "disjI1"]
            },
            {
                code: "   apply (frule conjunct2)\n   apply (frule(1) mp)\n  apply (erule disjI2)\n  done",
                explanation: "Para el segundo caso (q ⟶ s), procedemos de forma análoga con q para obtener s y concluir r ∨ s.",
                activeHyp: ["q", "s", "r ∨ s"],
                highlights: ["mp", "disjI2"]
            }
        ]
    },
    "b5_e7": {
        title: "Relación 5 - Ejercicio 7",
        steps: [
            {
                code: "lemma ejercicio07:\n  assumes \"p ∨ q ⟶ r ∧ s\"\n      and \"¬q ⟶ s\"\n  shows \"¬r ⟶ (s ∧ ¬q)\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">{ p ∨ q ⟶ r ∧ s, ¬q ⟶ s } ⊢ ¬r ⟶ (s ∧ ¬q)</div>
  </div>
</div>`,
                activeHyp: ["p ∨ q ⟶ r ∧ s", "¬q ⟶ s"],
                highlights: ["r", "s", "q"]
            }
        ]
    },
    "b5_e8": {
        title: "Relación 5 - Ejercicio 8",
        steps: [
            {
                code: "lemma ejercicio08:\n  assumes \"p ⟶ (q ⟶ (r ∨ s))\"\n      and \"q ∧ ¬r\"\n  shows \"p ⟶ s\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">{ p ⟶ (q ⟶ (r ∨ s)), q ∧ ¬r } ⊢ p ⟶ s</div>
  </div>
</div>`,
                activeHyp: ["p ⟶ (q ⟶ (r ∨ s))", "q ∧ ¬r"],
                highlights: ["p", "s"]
            }
        ]
    },
    "b5_e9": {
        title: "Relación 5 - Ejercicio 9",
        steps: [
            {
                code: "lemma ejercicio09:\n  assumes \"p ∧ q ⟶ r\"\n      and \"¬q ∨ r ⟶ ¬s\"\n  shows \"p ⟶ ¬s ∨ r\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">{ p ∧ q ⟶ r, ¬q ∨ r ⟶ ¬s } ⊢ p ⟶ ¬s ∨ r</div>
  </div>
</div>`,
                activeHyp: ["p ∧ q ⟶ r", "¬q ∨ r ⟶ ¬s"],
                highlights: ["p", "s", "r"]
            }
        ]
    },
    "b5_e10": {
        title: "Relación 5 - Ejercicio 10",
        steps: [
            {
                code: "lemma ejercicio10:\n  assumes \"p ∧ q ⟶ r\"\n      and \"s ⟶ ¬r\"\n      and \"¬(¬p ∨ ¬s)\"\n  shows \"¬q\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">{ p ∧ q ⟶ r, s ⟶ ¬r, ¬(¬p ∨ ¬s) } ⊢ ¬q</div>
  </div>
</div>`,
                activeHyp: ["p ∧ q ⟶ r", "s ⟶ ¬r", "¬(¬p ∨ ¬s)"],
                highlights: ["q"]
            }
        ]
    },
    "b5_e11": {
        title: "Relación 5 - Ejercicio 11",
        steps: [
            {
                code: "lemma ejercicio11:\n  assumes \"p ⟶ ¬(q ∧ r)\"\n      and \"(q ⟶ ¬r) ⟶ s\"\n  shows \"(p ⟶ r) ∨ s\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">{ p ⟶ ¬(q ∧ r), (q ⟶ ¬r) ⟶ s } ⊢ (p ⟶ r) ∨ s</div>
  </div>
</div>`,
                activeHyp: ["p ⟶ ¬(q ∧ r)", "(q ⟶ ¬r) ⟶ s"],
                highlights: []
            },
            {
                code: "  apply (rule disjE)\n    apply (rule excluded_middle)\n   apply rotate_tac\n   apply (drule(1) mt)\n   apply (rule disjI1)",
                explanation: "Iniciamos un análisis por casos con el tercero excluido. Usamos Modus Tollens para derivar un caso y abrimos el disyuntor izquierdo.",
                activeHyp: ["(q ⟶ ¬r) ∨ ¬(q ⟶ ¬r)"],
                highlights: ["excluded_middle", "mt"]
            },
            {
                code: "   apply (rule impI)\n   apply (drule(1) mp)\n   apply (rule ccontr)\n   apply (rotate_tac 1)\n   apply (erule notE)\n   apply (rule impI)\n   apply assumption\n  apply (rule disjI2)\n  apply assumption\n  done",
                explanation: "Completamos la prueba usando reducción al absurdo (ccontr) y conectando las premisas restantes.",
                activeHyp: ["s ∨ (p ⟶ r)"],
                highlights: ["ccontr", "notE"]
            }
        ]
    },
    "b5_e12": {
        title: "Relación 5 - Ejercicio 12",
        steps: [
            {
                code: "lemma ejercicio12:\n  assumes \"(q ∧ r) ⟶ p\"\n      and \"¬(p ⟶ r ∨ s)\"\n  shows \"q ∨ (s ⟶ ¬r)\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">{ (q ∧ r) ⟶ p, ¬(p ⟶ r ∨ s) } ⊢ q ∨ (s ⟶ ¬r)</div>
  </div>
</div>`,
                activeHyp: ["(q ∧ r) ⟶ p", "¬(p ⟶ r ∨ s)"],
                highlights: []
            },
            {
                code: "proof (rule disjE)\n  show \"¬q ∨ q\" by (rule excluded_middle)",
                explanation: "Iniciamos la prueba estructurada mediante un análisis de casos sobre q (tercero excluido).",
                activeHyp: ["¬q ∨ q"],
                highlights: ["excluded_middle"]
            },
            {
                code: "next\n  assume \"¬q\"\n  { assume \"s\"\n    { assume \"r\"\n      { assume \"p\"\n        have \"r ∨ s\" using ‹r› by (rule disjI1) }\n      then have \"p ⟶ r ∨ s\" by (rule impI)\n      with assms(2) have False by (rule notE) }\n    then have \"¬r\" by (rule notI) }\n  then have \"s ⟶ ¬r\" by (rule impI)\n  then show \"q ∨ (s ⟶ ¬r)\" by (rule disjI2)",
                explanation: "En el caso ¬q, probamos s ⟶ ¬r asumiendo s y r para llegar a una contradicción con la premisa ¬(p ⟶ r ∨ s).",
                activeHyp: ["¬q", "s", "r"],
                highlights: ["notI", "impI"]
            },
            {
                code: "next\n  assume \"q\"\n  then show \"q ∨ (s ⟶ ¬r)\" by (rule disjI1)\nqed",
                explanation: "En el caso q, la conclusión es inmediata por introducción del disyuntor.",
                activeHyp: ["q"],
                highlights: ["disjI1"]
            }
        ]
    },
    "b5_e13": {
        title: "Relación 5 - Ejercicio 13",
        steps: [
            {
                code: "lemma ejercicio13:\n  assumes \"p ⟶ ¬(q ∧ r)\"\n      and \"¬p ⟶ (¬r ∨ s)\"\n  shows \"q ⟶ r ⟶ s\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">{ p ⟶ ¬(q ∧ r), ¬p ⟶ (¬r ∨ s) } ⊢ q ⟶ r ⟶ s</div>
  </div>
</div>`,
                activeHyp: ["p ⟶ ¬(q ∧ r)", "¬p ⟶ (¬r ∨ s)"],
                highlights: ["q", "r", "s"]
            }
        ]
    },
    "b5_e14": {
        title: "Relación 5 - Ejercicio 14",
        steps: [
            {
                code: "lemma ejercicio14:\n  assumes \"r ⟷ ¬(p ∨ q)\"\n      and \"(r ∧ ¬q) ⟶ s\"\n  shows \"r ⟶ (s ∨ p)\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">{ r ⟷ ¬(p ∨ q), (r ∧ ¬q) ⟶ s } ⊢ r ⟶ (s ∨ p)</div>
  </div>
</div>`,
                activeHyp: ["r ⟷ ¬(p ∨ q)", "(r ∧ ¬q) ⟶ s"],
                highlights: ["r", "s", "p"]
            }
        ]
    },
    "b5_e15": {
        title: "Relación 5 - Ejercicio 15",
        steps: [
            {
                code: "lemma ejercicio15:\n  assumes \"(p ∨ s) ⟷ ¬(q ∧ r)\"\n  shows \"(q ⟶ ¬r) ⟷ (¬s ⟶ p)\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">(p ∨ s) ⟷ ¬(q ∧ r) ⊢ (q ⟶ ¬r) ⟷ (¬s ⟶ p)</div>
  </div>
</div>`,
                activeHyp: ["(p ∨ s) ⟷ ¬(q ∧ r)"],
                highlights: []
            },
            {
                code: "proof (rule iffI)\n  assume 1:\"q ⟶ ¬r\"\n  have \"¬(q ∧ r)\"\n  proof (rule notI)\n    assume \"q ∧ r\"\n    then have \"q\" and \"r\" by (rule conjunct1, rule conjunct2)\n    have \"¬r\" using 1 ‹q› by (rule mp)\n    then show False using ‹r› by (rule notE)\n  qed\n  with assms have 2:\"p ∨ s\" by (rule iffD2)\n  show \"¬s ⟶ p\"\n  proof (rule impI)\n    assume \"¬s\"\n    have \"p ∨ s\" using 2 by this\n    moreover { assume \"p\" then have \"p\" by this }\n    moreover { assume \"s\" with ‹¬s› have \"p\" by (rule notE) }\n    ultimately show \"p\" by (rule disjE)\n  qed",
                explanation: "Primera parte: rumbos directos (q ⟶ ¬r ⟹ ¬s ⟶ p). Usamos la equivalencia de la premisa para transformar la información sobre q,r en p,s.",
                activeHyp: ["q ⟶ ¬r", "p ∨ s"],
                highlights: ["iffI", "disjE"]
            },
            {
                code: "next\n  assume 3:\"¬s ⟶ p\"\n  have \"p ∨ s\"\n  proof (rule disjE)\n    show \"¬s ∨ s\" by (rule excluded_middle)\n  next\n    assume \"¬s\"\n    with 3 have \"p\" by (rule mp)\n    then show \"p ∨ s\" by (rule disjI1)\n  next\n    assume \"s\"\n    then show \"p ∨ s\" by (rule disjI2)\n  qed\n  with assms have 4:\"¬(q ∧ r)\" by (rule iffD1)\n  show \"q ⟶ ¬r\"\n  proof (rule impI)\n    assume \"q\"\n    { assume \"r\"\n      with ‹q› have \"q ∧ r\" by (rule conjI)\n      with 4 have False by (rule notE) }\n    then show \"¬r\" by (rule notI)\n  qed\nqed",
                explanation: "Segunda parte: rumbo inverso (¬s ⟶ p ⟹ q ⟶ ¬r). De nuevo usamos el tercero excluido sobre s para conectar con la equivalencia principal.",
                activeHyp: ["¬s ⟶ p", "¬(q ∧ r)"],
                highlights: ["excluded_middle", "notI"]
            }
        ]
    },
    "b5_e16": {
        title: "Relación 5 - Ejercicio 16",
        steps: [
            {
                code: "lemma ejercicio16:\n  assumes \"(p ⟶ r) ⟶ (¬q ∨ s)\"\n      and \"¬(p ∧ ¬r)\"\n  shows \"q ⟶ s\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">{ (p ⟶ r) ⟶ (¬q ∨ s), ¬(p ∧ ¬r) } ⊢ q ⟶ s</div>
  </div>
</div>`,
                activeHyp: ["(p ⟶ r) ⟶ (¬q ∨ s)", "¬(p ∧ ¬r)"],
                highlights: []
            },
            {
                code: "proof -\n  have \"p ⟶ r\"\n  proof (rule impI)\n    assume \"p\"\n    show \"r\"\n    proof (rule ccontr)\n      assume \"¬r\"\n      with ‹p› have \"p ∧ ¬r\" by (rule conjI)\n      with assms(2) show False by (rule notE)\n    qed\n  qed\n  with assms(1) have 1:\"¬q ∨ s\" by (rule mp)",
                explanation: "Primero probamos p ⟶ r por contradicción usando la premisa ¬(p ∧ ¬r). Esto nos permite liberar ¬q ∨ s de la primera premisa.",
                activeHyp: ["p ⟶ r", "¬q ∨ s"],
                highlights: ["ccontr", "mp"]
            },
            {
                code: "  show \"q ⟶ s\"\n  proof (rule impI)\n    assume \"q\"\n    show \"s\"\n    proof (rule disjE)\n      show \"¬q ∨ s\" using 1 by this\n    next\n      assume \"¬q\" then show \"s\" using ‹q› by (rule notE)\n    next\n      assume \"s\" then show \"s\" by this\n    qed\n  qed\nqed",
                explanation: "Finalmente, asumiendo q y usando el disyuntor ¬q ∨ s, concluimos s.",
                activeHyp: ["q", "¬q ∨ s"],
                highlights: ["disjE", "notE"]
            }
        ]
    },
    "b5_e17": {
        title: "Relación 5 - Ejercicio 17",
        steps: [
            {
                code: "lemma ejercicio17:\n  assumes \"¬(p ∧ ¬r) ⟶ (q ⟶ s)\"\n      and \"p ⟶ r\"\n  shows \"¬q ∨ s\"",
                explanation: `<div class="problem-statement-card">
  <div class="problem-section">
    <div class="problem-label">Objetivo</div>
    <div class="problem-text">{ ¬(p ∧ ¬r) ⟶ (q ⟶ s), p ⟶ r } ⊢ ¬q ∨ s</div>
  </div>
</div>`,
                activeHyp: ["¬(p ∧ ¬r) ⟶ (q ⟶ s)", "p ⟶ r"],
                highlights: []
            },
            {
                code: "  apply (drule mp)\n   apply (rule notI)\n   apply (drule mp)\n    apply (erule conjunct1)\n   apply (drule conjunct2)\n   apply (erule(1) notE)",
                explanation: "Aplicamos Modus Ponens sobre la primera premisa, lo que requiere probar ¬(p ∧ ¬r). Lo hacemos abriendo una negación y usando la implicación p ⟶ r.",
                activeHyp: ["q ⟶ s"],
                highlights: ["drule mp", "notI"]
            },
            {
                code: "  apply rotate_tac\n  apply (rule_tac P=\"¬q\" and Q=\"q\" in disjE)\n    apply (rule excluded_middle)\n   apply (erule disjI1)\n  apply (rule disjI2)\n  apply (erule(1) mp)\n  done",
                explanation: "Concluimos mediante un análisis de casos sobre q usando el tercero excluido.",
                activeHyp: ["¬q ∨ s"],
                highlights: ["excluded_middle", "disjI2"]
            }
        ]
    }
};

window.BOLETIN5_PROOFS = BOLETIN5_PROOFS;
