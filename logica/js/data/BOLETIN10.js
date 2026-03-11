// BOLETIN10.js - Ejercicios del Boletín 10
const BOLETIN10_PROOFS = {
    "b10_e1": {
        title: "Boletín 10 - Ejercicio 1",
        steps: [
            { code: "lemma b10_e1:\n  fixes x y z :: nat\n  assumes \"x = y\" and \"y = z\"\n  shows \"x = z\"", explanation: "Transitividad de igualdad.", activeHyp: ["x = y", "y = z"], highlights: ["x = z"] },
            { code: "  using assms by simp", explanation: "Simplificación del objetivo.", activeHyp: ["x = z"], highlights: ["simp"] }
        ]
    }
};
window.BOLETIN10_PROOFS = BOLETIN10_PROOFS;
