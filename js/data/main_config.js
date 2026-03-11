const EXERCISES_DATA = {
    "1": {
        title: "Tema 1: Sintaxis y semántica de la lógica proposicional",
        relations: {
            "rel1": {
                title: "Sintaxis y semántica de la lógica proposicional",
                exercises: {
                    "exe1": { title: "A ⟶ E, A ⊢ E", name: "1_1_auto", defaultMethod: "Solución Automática (auto)" },
                    "exe2": { title: "T ∧ P ⟶ S, T, P ⊢ S", name: "1_2_auto", defaultMethod: "Solución Automática (auto)" }
                }
            }
        }
    },
    "2": {
        title: "Tema 2: Deducción natural proposicional",
        relations: {
            "rel2": {
                title: "Deducción natural en lógica proposicional (I)",
                exercises: {
                    "exe1": { title: "Ejercicio base relación 2", name: "2_1", defaultMethod: "Deducción Natural" }
                }
            },
            "rel3": {
                title: "Deducción natural en lógica proposicional (II)",
                exercises: {
                    "exe1": { title: "Ejercicio base relación 3", name: "b3_e1", defaultMethod: "Deducción Natural" }
                }
            },
            "rel4": {
                title: "Deducción natural en lógica proposicional (III)",
                exercises: {
                    "exe1": { title: "Ejercicio base relación 4", name: "b4_e1", defaultMethod: "Deducción Natural" }
                }
            }
        }
    },
    "3": {
        title: "Tema 3: Sintaxis y semántica de la lógica de primer orden",
        relations: {
            "rel5": {
                title: "Lógica de primer orden",
                exercises: {
                    "exe1": { title: "Ejercicio base relación 5", name: "b5_e1", defaultMethod: "Deducción Natural" }
                }
            }
        }
    },
    "4": {
        title: "Tema 4: Deducción natural en lógica de primer orden",
        relations: {
            "rel6": {
                title: "Deducción natural en lógica de primer orden (I)",
                exercises: {
                    "exe1": { title: "Ejercicio base relación 6", name: "b6_e1", defaultMethod: "Deducción Natural" }
                }
            },
            "rel7": {
                title: "Deducción natural en lógica de primer orden (II)",
                exercises: {
                    "exe1": { title: "Ejercicio base relación 7", name: "b7_e1", defaultMethod: "Deducción Natural" }
                }
            },
            "rel8": {
                title: "Lógica de primer orden con igualdad",
                exercises: {
                    "exe1": { title: "Ejercicio base relación 8", name: "b8_e1", defaultMethod: "Deducción Natural" }
                }
            }
        }
    },
    "5": {
        title: "Tema 5: Programación funcional en Isabelle",
        relations: {
            "rel9": {
                title: "Programación funcional en Isabelle",
                exercises: {
                    "exe1": { title: "Ejercicio base relación 9", name: "b9_e1", defaultMethod: "Funcional" }
                }
            }
        }
    },
    "6": {
        title: "Tema 6: Razonamiento ecuacional e inducción",
        relations: {
            "rel10": {
                title: "Razonamiento ecuacional en Isabelle (I)",
                exercises: {
                    "exe1": { title: "Ejercicio base relación 10", name: "b10_e1", defaultMethod: "Razonamiento ecuacional" }
                }
            },
            "rel11": {
                title: "Razonamiento ecuacional en Isabelle (II)",
                exercises: {
                    "exe1": { title: "Ejercicio base relación 11", name: "b11_e1", defaultMethod: "Razonamiento ecuacional" }
                }
            }
        }
    },
    "P1": {
        title: "Primeros Parciales",
        relations: {
            "rel1": {
                title: "Convocatoria 2023",
                exercises: {
                    "exe1": { title: "Primer parcial 2023 - Ejercicio 1", name: "p1_2023_e1", defaultMethod: "Examen" }
                }
            }
        }
    },
    "P2": {
        title: "Segundos Parciales",
        relations: {
            "rel1": {
                title: "Convocatoria 2023",
                exercises: {
                    "exe1": { title: "Segundo parcial 2023 - Ejercicio 1", name: "p2_2023_e1", defaultMethod: "Examen" }
                }
            }
        }
    },
    "C": {
        title: "Convocatorias",
        relations: {
            "rel1": {
                title: "Convocatoria 2023",
                exercises: {
                    "exe1": { title: "Convocatoria 2023 - Ejercicio 1", name: "c_2023_e1", defaultMethod: "Examen" }
                }
            }
        }
    }
};

window.EXERCISES_DATA = EXERCISES_DATA;

// Consolidación de todos los objetos de pruebas
window.ALL_PROOFS = {
    ...(window.BOLETIN1_PROOFS || {}),
    ...(window.BOLETIN2_PROOFS || {}),
    ...(window.BOLETIN3_PROOFS || {}),
    ...(window.BOLETIN4_PROOFS || {}),
    ...(window.BOLETIN5_PROOFS || {}),
    ...(window.BOLETIN6_PROOFS || {}),
    ...(window.BOLETIN7_PROOFS || {}),
    ...(window.BOLETIN8_PROOFS || {}),
    ...(window.BOLETIN9_PROOFS || {}),
    ...(window.BOLETIN10_PROOFS || {}),
    ...(window.BOLETIN11_PROOFS || {}),
    ...(window.PRIMER_PARCIAL_PROOFS || {}),
    ...(window.SEGUNDO_PARCIAL_PROOFS || {}),
    ...(window.CONVOCATORIA_PROOFS || {})
};
