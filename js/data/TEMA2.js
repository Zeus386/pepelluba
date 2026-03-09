// js/data/TEMA2.js

window.TEMA2_PROOFS = {
    // Aquí puedes pegar las demostraciones del Tema 2 siguiendo el formato de la Guía IA.
    "2_01_ejemplo": {
        "title": "Ejemplo Tema 2",
        "name": "2_01_ejemplo",
        "defaultMethod": "Deducción Natural",
        "steps": [
            {
                "code": "lemma ejemplo_t2:\nassumes \"P\"\nshows \"P\"",
                "explanation": "Prueba de identidad básica.",
                "activeHyp": ["P"],
                "highlights": []
            }
        ]
    }
};

window.EXERCISES_DATA["2"] = {
    "title": "Tema 2: Semántica y Tablas de Verdad",
    "exercises": {
        "exe01": { "name": "2_01_ejemplo", "title": "Ejercicio 01" }
    }
};
