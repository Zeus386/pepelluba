// BOLETIN9.js - Ejercicios del Boletín 9
const BOLETIN9_PROOFS = {
    "b9_e1": {
        title: "Boletín 9 - Ejercicio 1",
        steps: [
            { code: "lemma b9_e1:\n  shows \"map (λx. x) xs = xs\"", explanation: "Identidad funcional sobre listas.", activeHyp: [], highlights: ["map", "xs"] },
            { code: "  by (induction xs) auto", explanation: "Inducción estructural y cierre automático.", activeHyp: [], highlights: ["induction", "auto"] }
        ]
    }
};
window.BOLETIN9_PROOFS = BOLETIN9_PROOFS;
