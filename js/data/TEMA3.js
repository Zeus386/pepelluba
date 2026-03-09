// TEMA3.js - Pruebas para Tema 3

const TEMA3_PROOFS = {
    "3_15": {
        title: "Tema 3 - Ejercicio 15 (Deducción)s",
        steps: [
            {
                code: "lemma ejercicio_15:\n assumes \"P ⟶ (Q ⟶ R)\"\n shows \"(P ∧ Q) ⟶ R\"",
                explanation: "El objetivo principal es demostrar una implicación: Si P y Q son ciertos entonces R lo es.",
                activeHyp: ["P ⟶ (Q ⟶ R)"],
                highlights: ["P", "Q", "R"]
            },
            {
                code: "proof (rule impI)",
                explanation: "Aplicamos la regla de introducción de la implicación (impI). Esto nos permite asumir P ∧ Q para intentar demostrar R.",
                activeHyp: ["P ⟶ (Q ⟶ R)", "P ∧ Q"],
                highlights: ["impI"]
            },
            {
                code: "  assume \"P ∧ Q\"",
                explanation: "Asumimos la conjunción P ∧ Q como hipótesis temporal.",
                activeHyp: ["P ⟶ (Q ⟶ R)", "P ∧ Q"],
                highlights: ["assume"]
            },
            {
                code: "  hence \"P\"",
                explanation: "Si tenemos la conjunción, podemos separar sus términos. Deducimos P.",
                activeHyp: ["P ⟶ (Q ⟶ R)", "P"],
                highlights: ["hence"]
            },
            {
                code: "  from `P ∧ Q` have \"Q\"",
                explanation: "De la misma manera, deducimos Q desde el aserto inicial.",
                activeHyp: ["P ⟶ (Q ⟶ R)", "P", "Q"],
                highlights: ["have"]
            },
            {
                code: "  from assms and `P` have \"Q ⟶ R\"",
                explanation: "Usando nuestra premisa principal P ⟶ (Q ⟶ R) y el hecho P que acabamos de demostrar, obtenemos Q ⟶ R.",
                activeHyp: ["P ⟶ (Q ⟶ R)", "Q ⟶ R"],
                highlights: ["from"]
            },
            {
                code: "  from this and `Q` show \"R\"\nqed",
                explanation: "Finalmente, al tener Q ⟶ R y saber que Q es cierto, concluimos que R es cierto, cerrando la demostración.",
                activeHyp: ["R"],
                highlights: ["show", "qed"]
            },
        ]
    },
    "3_17": {
        title: "Tema 3 - Ejercicio 17 (Deducción por Tareas)",
        steps: [
            {
                code: "lemma ejercicio_17:\n assumes \"(p ∧ q) ∨ (q ∧ r)\"\n shows \"q\"",
                explanation: "Se nos da una disyunción donde en ambos casos q está presente. Nuestro objetivo es demostrar que q siempre es cierto bajo esta asunción.",
                activeHyp: ["(p ∧ q) ∨ (q ∧ r)"],
                highlights: ["q"]
            },
            {
                code: "proof (rule ccontr)\n  assume \"¬q\"",
                explanation: "Iniciamos la demostración asumiendo la negación de la conclusión (ccontr): supongamos por reducción al absurdo que no tenemos q.",
                activeHyp: ["(p ∧ q) ∨ (q ∧ r)", "¬q"],
                highlights: ["ccontr", "¬q"]
            },
            {
                code: "  from assms show False\n  proof\n    assume \"p ∧ q\"",
                explanation: "Comenzamos a romper la disyunción en sus dos casos. Caso 1: Supongamos que ocurre la rama p ∧ q.",
                activeHyp: ["¬q", "p ∧ q"],
                highlights: ["assume"]
            },
            {
                code: "    hence \"q\"\n    with `¬q` show False by contradiction",
                explanation: "De ese caso obtenemos q. Al enfrentarlo contra nuestra hipótesis de reducción al absurdo ¬q, obtenemos una contradicción lógica inmediata.",
                activeHyp: ["q", "¬q", "False"],
                highlights: ["hence", "contradiction"]
            },
            {
                code: "  next\n    assume \"q ∧ r\"",
                explanation: "Continuamos con el Caso 2: Supongamos que ocurre la rama q ∧ r de la premisa.",
                activeHyp: ["¬q", "q ∧ r"],
                highlights: ["next", "assume"]
            },
            {
                code: "    hence \"q\"\n    with `¬q` show False by contradiction\n  qed\nqed",
                explanation: "Al igual que antes, de esta rama extraemos q, que vuelve a chocar con ¬q, creando una contradicción por segunda vez. ¡Ambas ramas terminan en absurdo!",
                activeHyp: ["q", "¬q", "False"],
                highlights: ["hence", "contradiction", "qed"]
            },
        ]
    },
};

window.TEMA3_PROOFS = TEMA3_PROOFS;
