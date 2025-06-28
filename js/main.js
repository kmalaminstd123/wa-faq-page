document.addEventListener('DOMContentLoaded', function () {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.custom-tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const contentArea = document.querySelector('.content-area'); // Add this line

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            tabButtons.forEach(tab => tab.classList.remove('active'));
            tabPanes.forEach(pane => {
                pane.classList.remove('show', 'active');
            });

            // Add active class to clicked tab
            this.classList.add('active');

            // Show corresponding tab pane
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                setTimeout(() => {
                    targetPane.classList.add('show', 'active');
                    
                    // Scroll to content area on mobile screens
                    if (window.innerWidth <= 768) {
                        setTimeout(() => {
                            contentArea.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 150); // Small delay to ensure content is visible
                    }
                }, 100);
            }

            // Reset search when switching tabs
            const searchInput = document.getElementById('searchInput');
            searchInput.value = '';
            resetSearch();
        });
    });

    // FAQ accordion functionality
    const faqButtons = document.querySelectorAll('.faq-question-btn');
    
    faqButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const targetAnswer = document.getElementById(targetId);
            const isActive = this.classList.contains('active');
            
            // Close all FAQ items in current tab
            const currentTab = this.closest('.tab-pane');
            const allButtons = currentTab.querySelectorAll('.faq-question-btn');
            const allAnswers = currentTab.querySelectorAll('.faq-answer');
            
            allButtons.forEach(btn => btn.classList.remove('active'));
            allAnswers.forEach(answer => answer.classList.remove('show'));
            
            // Toggle current item
            if (!isActive) {
                this.classList.add('active');
                targetAnswer.classList.add('show');
            }
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            resetSearch();
            return;
        }
        
        const allFaqCards = document.querySelectorAll('.faq-card');
        let hasResults = false;
        
        allFaqCards.forEach(card => {
            const question = card.querySelector('.faq-question-btn').textContent.toLowerCase();
            const answer = card.querySelector('.faq-answer-text').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.backgroundColor = 'rgba(117, 100, 44, 0.05)';
                card.style.borderColor = '#75642c';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show all tabs when searching
        tabPanes.forEach(pane => {
            if (pane.querySelector('.faq-card[style*="display: block"]')) {
                pane.style.display = 'block';
            }
        });
    });

    function resetSearch() {
        const allFaqCards = document.querySelectorAll('.faq-card');
        allFaqCards.forEach(card => {
            card.style.display = 'block';
            card.style.backgroundColor = '';
            card.style.borderColor = '';
        });
        
        // Hide non-active tabs
        tabPanes.forEach(pane => {
            if (!pane.classList.contains('active')) {
                pane.style.display = '';
            }
        });
    }

    // Smooth scroll animation for FAQ cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.faq-card').forEach(card => {
        observer.observe(card);
    });
});