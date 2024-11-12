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
});