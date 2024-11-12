// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    // Funcionalidade para o FAQ
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            // Pega o elemento pai (faq-item)
            const faqItem = question.parentElement;

            // Toggle da classe active no item clicado
            faqItem.classList.toggle('active');
        });
    });

    // Smooth scroll para os botões CTA
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('.hero');
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Animação no scroll para os cards de benefícios
    const observeElements = (elements, className) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(className);
                }
            });
        });

        elements.forEach(element => observer.observe(element));
    };

    // Observa os cards de benefícios
    observeElements(document.querySelectorAll('.benefit-card'), 'fade-in');

    // Pop-up de Boas-vindas
    const popup = document.getElementById('welcomePopup');
    const closeBtn = document.getElementById('closePopup');

    // Mostra o pop-up após 5 segundos
    setTimeout(() => {
        popup.classList.add('show');
        startCountdown();
    }, 5000);

    // Fecha o pop-up
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('show');
    });

    // Fecha ao clicar fora do pop-up
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('show');
        }
    });

    // Contador regressivo
    function startCountdown() {
        let minutes = 10;
        let seconds = 0;
        const minutesDisplay = document.getElementById('minutes');
        const secondsDisplay = document.getElementById('seconds');

        const countdown = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(countdown);
                    return;
                }
                minutes--;
                seconds = 59;
            } else {
                seconds--;
            }

            minutesDisplay.textContent = minutes.toString().padStart(2, '0');
            secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        }, 1000);
    }

    // Sistema de Notificações
    class NotificationSystem {
        constructor() {
            this.names = ['Maria', 'João', 'Pedro', 'Ana', 'Carlos', 'Lucia', 'Rafael', 'Julia'];
            this.plans = [
                { name: 'Plano Básico', price: 'R$ 97' },
                { name: 'Plano Completo', price: 'R$ 197' }
            ];
            this.totalNotification = document.getElementById('totalNotification');
            this.purchaseNotification = document.getElementById('purchaseNotification');

            this.initialize();
        }

        initialize() {
            // Mostra total de usuários após 10 segundos
            setTimeout(() => this.showTotalUsers(), 10000);

            // Inicia sistema de notificações de compra
            this.startPurchaseNotifications();
        }

        showNotification(element) {
            element.style.display = 'flex';
            setTimeout(() => element.classList.add('show'), 100);

            setTimeout(() => {
                element.classList.remove('show');
                setTimeout(() => {
                    element.style.display = 'none';
                }, 500);
            }, 5000);
        }

        showTotalUsers() {
            this.showNotification(this.totalNotification);
            // Repete a cada 30 segundos
            setInterval(() => this.showNotification(this.totalNotification), 30000);
        }

        getRandomItem(array) {
            return array[Math.floor(Math.random() * array.length)];
        }

        showPurchaseNotification() {
            const name = this.getRandomItem(this.names);
            const plan = this.getRandomItem(this.plans);

            this.purchaseNotification.querySelector('.buyer-name').textContent = name;
            this.purchaseNotification.querySelector('.plan-type').textContent = plan.name;

            this.showNotification(this.purchaseNotification);
        }

        startPurchaseNotifications() {
            // Primeira notificação após 15 segundos
            setTimeout(() => {
                this.showPurchaseNotification();

                // Depois mostra a cada 20-40 segundos
                setInterval(() => {
                    this.showPurchaseNotification();
                }, Math.random() * (40000 - 20000) + 20000);
            }, 15000);
        }
    }

    // Inicializa o sistema de notificações
    new NotificationSystem();
});
