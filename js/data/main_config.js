// main_config.js - Configuración visual y de metadatos de los ejercicios

const EXERCISES_DATA = {
    "1": {
        title: "Tema 1: Lógica Proposicional Básica",
        exercises: {
            "exe1": { title: "A ⟶ E, A ⊢ E", name: "1_1_auto", defaultMethod: "Solución Automática (auto)" },
            "exe2": { title: "T ∧ P ⟶ S, T, P ⊢ S", name: "1_2_auto", defaultMethod: "Solución Automática (auto)" },
            "exe3": { title: "M ⟶ P, N ⟶ P, M ∨ N ⊢ P", name: "1_3_auto", defaultMethod: "Solución Automática (auto)" },
            "exe4": { title: "E ⟶ L, ¬L ⊢ ¬E", name: "1_4_auto", defaultMethod: "Solución Automática (auto)" },
            "exe5": { title: "V ⟶ (B ∧ T), T ⟶ I, V ⊢ I", name: "1_5_auto", defaultMethod: "Solución Automática (auto)" },
            "exe6": { title: "U ⟶ I, P ∨ U, ¬P ⊢ I", name: "1_6_auto", defaultMethod: "Solución Automática (auto)" },
            "exe7": { title: "M ⟶ H, M ⟶ T, M ⊢ H ∧ T", name: "1_7_auto", defaultMethod: "Solución Automática (auto)" },
            "exe8": { title: "A ⟶ T, T ⟶ F, C ⊢ A ⟶ F", name: "1_8_auto", defaultMethod: "Solución Automática (auto)" },
            "exe9": { title: "A ⟶ R, R ⟶ I ⊢ A ⟶ I", name: "1_9_auto", defaultMethod: "Solución Automática (auto)" },
            "exe10": { title: "S ⟶ E, S ⟶ D ⊢ S ⟶ E ∧ D", name: "1_10_auto", defaultMethod: "Solución Automática (auto)" },
            "exe11": { title: "E ∨ S, E ⟶ R, S ⟶ R ⊢ R", name: "1_11_auto", defaultMethod: "Solución Automática (auto)" },
            "exe12": { title: "C ⟶ L, L ⟶ S, S ⟶ (P ∧ L) ⊢ C ⟶ L", name: "1_12_auto", defaultMethod: "Solución Automática (auto)" },
            "exe13": { title: "A ⟶ F, M ⟶ A, P ⟶ M ⊢ P ⟶ F", name: "1_13_auto", defaultMethod: "Solución Automática (auto)" },
            "exe14": { title: "J ⟶ M, C ⟶ A, J ∨ C ⊢ M ∨ A", name: "1_14_auto", defaultMethod: "Solución Automática (auto)" },
        }
    },
    "2": {
        title: "Tema 2: Semántica y Tablas de Verdad",
        exercises: {
        }
    },
    "3": {
        title: "Tema 3: Deducción Natural",
        exercises: {
            "exe15": { title: "Ejercicio 15 (Deducción)s", name: "3_15", defaultMethod: "Deducción por Tareas" },
        }
    },
    "4": {
        title: "Tema 4: Lógica de Predicados Básica",
        exercises: {
        }
    },
    "5": {
        title: "Tema 5: Semántica de Predicados",
        exercises: {
        }
    },
    "6": {
        title: "Tema 6: Deducción Natural Numérica",
        exercises: {
        }
    },
};

window.EXERCISES_DATA = EXERCISES_DATA;
