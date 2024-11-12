// Função segura para tracking de eventos
function trackEvent(category, action, label, value) {
    // Verifica se gtag existe e se estamos em um ambiente de navegador
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }
}

// Função segura para checar ambiente
function isBrowser() {
    return typeof window !== 'undefined';
}

class TDAHQuiz {
    constructor() {
        if (!isBrowser()) return;

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
        this.trackQuizStart();
    }

    initializeElements() {
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.querySelector('.options-container');
        this.progressBar = document.querySelector('.progress-fill');
        this.resultScreen = document.getElementById('results-screen');
        this.loadingScreen = document.getElementById('loading-screen');
    }

    setupEventListeners() {
        if (this.optionsContainer) {
            const options = document.querySelectorAll('.option-btn');
            options.forEach((option, index) => {
                option.addEventListener('click', () => this.handleAnswer(index));
            });
        }
    }

    trackQuizStart() {
        trackEvent('Quiz', 'start', 'Quiz Iniciado');
    }

    trackAnswer(questionNumber, answerIndex) {
        trackEvent('Quiz', 'answer', `Questão ${questionNumber + 1}`, answerIndex);
    }

    trackCompletion(score) {
        trackEvent('Quiz', 'complete', 'Quiz Completado', score);
    }

    showQuestion() {
        if (this.questionText) {
            this.questionText.textContent = this.questions[this.currentQuestion];
            this.updateProgress();

            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
        }
    }

    handleAnswer(optionIndex) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.classList.remove('selected'));
        buttons[optionIndex].classList.add('selected');

        this.score += optionIndex;
        this.trackAnswer(this.currentQuestion, optionIndex);

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
        if (this.progressBar) {
            const progress = ((this.currentQuestion) / this.questions.length) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }

    showResults() {
        this.hideAllScreens();
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('active');
        }

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
        if (this.resultScreen) {
            this.resultScreen.classList.add('active');
        }

        // Track completion
        this.trackCompletion(percentage);

        const scoreCircle = document.querySelector('.score-circle');
        if (scoreCircle) {
            scoreCircle.innerHTML = `
                <span class="score-number">${percentage}%</span>
                <span class="score-label">Probabilidade<br>de TDAH</span>
            `;
        }

        // Define a descrição e recomendação com base no percentual
        let description, recommendation;
        if (percentage >= 70) {
            description = "Seus resultados sugerem uma forte presença de sintomas de TDAH. Seria benéfico desenvolver estratégias para melhorar seu foco e organização.";
            recommendation = "Para sintomas significativos como os seus, recomendamos fortemente o Plano Completo.";
        } else if (percentage >= 40) {
            description = "Seus resultados sugerem a presença de alguns sintomas de TDAH. Seria benéfico desenvolver estratégias para melhorar seu foco e organização.";
            recommendation = "Com base nos seus resultados, o Plano Completo ofereceria as ferramentas mais adequadas.";
        } else {
            description = "Seus resultados indicam poucos sintomas de TDAH. No entanto, desenvolver técnicas de foco e organização pode beneficiar qualquer pessoa.";
            recommendation = "Para começar sua jornada, o Plano Básico oferece um excelente conjunto de ferramentas.";
        }

        const resultDescription = document.querySelector('.result-description');
        if (resultDescription) {
            resultDescription.textContent = description;
        }

        // Mostra os planos após mostrar o resultado
        setTimeout(() => {
            const plansSection = document.querySelector('.plans-section');
            if (plansSection) {
                plansSection.style.display = 'block';
                plansSection.classList.add('visible');
            }
            this.setupPlanTracking();
        }, 1000);
    }

    setupPlanTracking() {
        document.querySelectorAll('.plan-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const isComplete = button.classList.contains('featured');
                const planType = isComplete ? 'Completo' : 'Básico';
                const value = isComplete ? 197 : 97;
                
                trackEvent('Conversion', 'plan_selected', planType, value);
            });
        });
    }
}

// Inicialização segura
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        new TDAHQuiz();
    
        // Tracking de tempo na página
        let timeSpent = 0;
        const timeInterval = setInterval(() => {
            timeSpent += 30;
            if (timeSpent <= 180) {
                trackEvent('Engagement', 'time_spent', `${timeSpent} seconds`);
            } else {
                clearInterval(timeInterval);
            }
        }, 30000);
    });
}