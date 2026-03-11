
// Referencias DOM centralizadas
// Se inicializan bajo demanda o explícitamente

export const DOM = {
    screens: {
        intro: null,
        mainApp: null
    },
    views: {
        exercises: null,
        isabelle: null,
        wiki: null,
        relations: null
    },
    intro: {
        text: null,
        sub: null,
        btn: null,
        reveal: null
    },
    globalHeader: null,
    globalBack: null,
    themeToggles: null,
    themeNav: null,
    exercisesGrid: null,
    relationsGrid: null,
    currentThemeTitle: null,
    currentRelationThemeTitle: null,
    isabelle: {
        title: null,
        codeContainer: null,
        explanation: null,
        hypotheses: null,
        progress: null,
        btnPrev: null,
        btnNext: null,
        codeScroll: null
    },
    adminView: null,
    themeBtns: []
};

export function initDOM() {
    DOM.screens.intro = document.getElementById('intro-screen');
    DOM.screens.mainApp = document.getElementById('main-app');

    DOM.views.exercises = document.getElementById('exercises-view');
    DOM.views.isabelle = document.getElementById('isabelle-view');
    DOM.views.wiki = document.getElementById('wiki-view');
    DOM.views.relations = document.getElementById('relations-view'); // lazy loaded in original, but we can try to get it

    DOM.intro.text = document.getElementById('intro-text');
    DOM.intro.sub = document.getElementById('sub-text');
    DOM.intro.btn = document.getElementById('logic-btn');
    DOM.intro.reveal = document.getElementById('intro-reveal');

    DOM.globalHeader = document.getElementById('global-header');
    DOM.globalBack = document.getElementById('global-back');
    DOM.themeToggles = document.querySelectorAll('.theme-toggle');
    DOM.themeNav = document.getElementById('theme-nav');
    
    DOM.exercisesGrid = document.getElementById('exercises-grid');
    DOM.relationsGrid = document.getElementById('relations-grid');
    
    DOM.currentThemeTitle = document.getElementById('current-theme-title');
    DOM.currentRelationThemeTitle = document.getElementById('current-relation-theme-title');

    DOM.isabelle.title = document.getElementById('exercise-title');
    DOM.isabelle.codeContainer = document.getElementById('code-container');
    DOM.isabelle.explanation = document.getElementById('explanation-text');
    DOM.isabelle.hypotheses = document.getElementById('active-hypotheses');
    DOM.isabelle.progress = document.getElementById('progress-bar');
    DOM.isabelle.btnPrev = document.getElementById('btn-prev');
    DOM.isabelle.btnNext = document.getElementById('btn-next');
    DOM.isabelle.codeScroll = document.getElementById('code-scroll');

    DOM.adminView = document.getElementById('admin-view');
}
