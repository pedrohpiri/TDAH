// Adicione no início do seu arquivo JavaScript

// Tracking de eventos
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// Tracking de scroll
function trackScroll() {
    let scrolled = false;
    let timer = null;

    window.addEventListener('scroll', () => {
        if (timer !== null) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            if (!scrolled) {
                scrolled = true;
                trackEvent('Engagement', 'scroll', 'User scrolled page');
            }
        }, 1000);
    });
}

// Tracking de tempo na página
function trackTimeSpent() {
    const intervals = [30, 60, 120, 180]; // segundos
    let currentInterval = 0;

    const timer = setInterval(() => {
        if (currentInterval < intervals.length) {
            trackEvent('Engagement', 'time_spent', `${intervals[currentInterval]} seconds`);
            currentInterval++;
        } else {
            clearInterval(timer);
        }
    }, intervals[0] * 1000);
}

// Tracking de cliques nos CTAs
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function (e) {
        trackEvent('CTA', 'click', this.textContent.trim());
    });
});

// Tracking do FAQ
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function () {
        trackEvent('FAQ', 'open', this.textContent.trim());
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    trackScroll();
    trackTimeSpent();
});

// Seu código JavaScript existente continua aqui...

class TDAHQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = [
            "Com que frequência você tem dificuldade para manter a atenção a detalhes ou comete erros por descuido em atividades?",
            "Com que frequência você tem dificuldade para manter a atenção em tarefas ou atividades de lazer?",
            "Com que frequência você tem dificuldade para escutar quando alguém fala diretamente com você?",
            "Com que frequência você tem dificuldade para seguir instruções e terminar tarefas?",
            "Com que frequência você tem dificuldade para organizar tarefas e atividades?",
            "Com que frequência você evita, não gosta ou reluta em envolver-se em tarefas que exijam esforço mental prolongado?",
            "Com que frequência você perde coisas necessárias para tarefas ou atividades?",
            "Com que frequência você se distrai facilmente por estímulos externos?",
            "Com que frequência você é esquecido em relação a atividades diárias?",
            "Com que frequência você tem dificuldade para ficar sentado em situações em que se espera que permaneça sentado?"
        ];

        this.initializeElements();
        this.setupEventListeners();
        this.showQuestion();
    }

    initializeElements() {
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.querySelector('.options-container');
        this.progressBar = document.querySelector('.progress-fill');
        this.resultScreen = document.getElementById('results-screen');
        this.loadingScreen = document.getElementById('loading-screen');
    }

    setupEventListeners() {
        const options = document.querySelectorAll('.option-btn');
        options.forEach((option, index) => {
            option.addEventListener('click', () => this.handleAnswer(index));
        });
    }

    showQuestion() {
        this.questionText.textContent = this.questions[this.currentQuestion];
        this.updateProgress();

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    handleAnswer(optionIndex) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));
        buttons[optionIndex].classList.add('selected');

        this.score += optionIndex;

        setTimeout(() => {
            if (this.currentQuestion < this.questions.length - 1) {
                this.currentQuestion++;
                this.showQuestion();
            } else {
                this.showResults();
            }
        }, 500);
    }

    updateProgress() {
        const progress = ((this.currentQuestion) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    showResults() {
        this.hideAllScreens();
        this.loadingScreen.classList.add('active');

        setTimeout(() => {
            this.calculateAndShowResults();
        }, 2000);
    }

    hideAllScreens() {
        document.querySelectorAll('.quiz-screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    calculateAndShowResults() {
        const maxScore = this.questions.length * 4;
        const percentage = Math.round((this.score / maxScore) * 100);

        this.hideAllScreens();
        this.resultScreen.classList.add('active');

        // Atualiza o círculo de resultado
        document.querySelector('.score-circle').innerHTML = `
            <span class="score-number">${percentage}%</span>
            <span class="score-label">Probabilidade<br>de TDAH</span>
        `;

        // Define a descrição com base no percentual
        let description;
        if (percentage >= 70) {
            description = "Seus resultados sugerem uma forte presença de sintomas de TDAH. Seria benéfico desenvolver estratégias para melhorar seu foco e organização.";
        } else if (percentage >= 40) {
            description = "Seus resultados sugerem a presença de alguns sintomas de TDAH. Seria benéfico desenvolver estratégias para melhorar seu foco e organização.";
        } else {
            description = "Seus resultados indicam poucos sintomas de TDAH. No entanto, desenvolver técnicas de foco e organização pode beneficiar qualquer pessoa.";
        }

        document.querySelector('.result-description').textContent = description;

        // Mostra os planos após mostrar o resultado
        setTimeout(() => {
            const plansSection = document.querySelector('.plans-section');
            plansSection.style.display = 'block';
            plansSection.classList.add('visible');
        }, 1000);
    }
}

// Inicialização do quiz
document.addEventListener('DOMContentLoaded', () => {
    new TDAHQuiz();
});