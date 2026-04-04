// Portfolio Website Main JavaScript
// Muhammad Ali - Front-End Developer

// Global variables
let currentQuestionIndex = 0;
let quizScore = 0;
let particleApp;

// Quiz questions data
const quizQuestions = [
    {
        question: "Which game features the character Arthur Morgan?",
        options: ["Grand Theft Auto V", "Red Dead Redemption 2", "Call of Duty", "Fortnite"],
        correct: 1,
        explanation: "Arthur Morgan is the main protagonist of Red Dead Redemption 2."
    },
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
        correct: 0,
        explanation: "HTML stands for Hyper Text Markup Language, the standard markup language for web pages."
    },
    {
        question: "Which company developed the Call of Duty series?",
        options: ["Rockstar Games", "Electronic Arts", "Activision", "Ubisoft"],
        correct: 2,
        explanation: "Activision is the publisher and main developer of the Call of Duty franchise."
    },
    {
        question: "What is the latest version of CSS?",
        options: ["CSS2", "CSS3", "CSS4", "CSS5"],
        correct: 1,
        explanation: "CSS3 is the latest standard, though work on CSS4 modules is in progress."
    },
    {
        question: "Which game engine is commonly used for web-based games?",
        options: ["Unreal Engine", "Unity", "Phaser.js", "CryEngine"],
        correct: 2,
        explanation: "Phaser.js is a popular JavaScript framework for creating web-based games."
    }
];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeParticleBackground();
    initializeTypedText();
    initializeSkillBars();
    initializeQuiz();
    initializeMobileMenu();
    initializeScrollAnimations();
    initializeSmoothScrolling();
});

// Particle Background using PIXI.js
function initializeParticleBackground() {
    try {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = Math.random() > 0.5 ? '#00d4ff' : '#8b5cf6';
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.save();
                        ctx.globalAlpha = (100 - distance) / 100 * 0.2;
                        ctx.strokeStyle = particle.color;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                        ctx.restore();
                    }
                });
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        document.getElementById('particle-bg').appendChild(canvas);
        
    } catch (error) {
        console.log('Particle background not available');
    }
}

// Typed text animation
function initializeTypedText() {
    if (typeof Typed !== 'undefined') {
        new Typed('#typed-text', {
            strings: [
                'Creating immersive web experiences',
                'Building the future of gaming',
                'Passionate about clean code',
                'Love for technology & innovation'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Skill bars animation
function initializeSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');

                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 200);

                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => {
        observer.observe(bar);
    });
}

// Quiz functionality
function initializeQuiz() {
    const startBtn = document.getElementById('start-quiz');
    const quizStart = document.getElementById('quiz-start');
    const quizQuestion = document.getElementById('quiz-question');
    const quizResult = document.getElementById('quiz-result');
    const nextBtn = document.getElementById('next-question');
    const restartBtn = document.getElementById('restart-quiz');
    
    startBtn?.addEventListener('click', startQuiz);
    nextBtn?.addEventListener('click', nextQuestion);
    restartBtn?.addEventListener('click', restartQuiz);
    
    function startQuiz() {
        quizStart.classList.add('hidden');
        quizQuestion.classList.remove('hidden');
        currentQuestionIndex = 0;
        quizScore = 0;
        showQuestion();
    }
    
    function showQuestion() {
        const question = quizQuestions[currentQuestionIndex];
        document.getElementById('current-question').textContent = currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = quizQuestions.length;
        document.getElementById('current-score').textContent = quizScore;
        document.getElementById('question-text').textContent = question.question;
        
        const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
        document.getElementById('progress-bar').style.width = progress + '%';
        
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'quiz-option p-4 border border-medium-gray rounded-lg cursor-pointer';
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => selectAnswer(index));
            optionsContainer.appendChild(optionDiv);
        });
        
        document.getElementById('next-question').classList.add('hidden');
    }
    
    function selectAnswer(selectedIndex) {
        const question = quizQuestions[currentQuestionIndex];
        const options = document.querySelectorAll('.quiz-option');
        
        options.forEach((option, index) => {
            option.style.pointerEvents = 'none';
            if (index === question.correct) {
                option.style.background = 'rgba(16, 185, 129, 0.2)';
                option.style.borderColor = '#10b981';
            } else if (index === selectedIndex && index !== question.correct) {
                option.style.background = 'rgba(239, 68, 68, 0.2)';
                option.style.borderColor = '#ef4444';
            }
        });
        
        if (selectedIndex === question.correct) {
            quizScore++;
            document.getElementById('current-score').textContent = quizScore;
        }
        
        document.getElementById('next-question').classList.remove('hidden');
    }
    
    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }
    
    function showResults() {
        quizQuestion.classList.add('hidden');
        quizResult.classList.remove('hidden');
        
        const finalScore = document.getElementById('final-score');
        const scoreMessage = document.getElementById('score-message');
        
        finalScore.textContent = `${quizScore}/${quizQuestions.length}`;
        
        const percentage = (quizScore / quizQuestions.length) * 100;
        if (percentage >= 80) {
            scoreMessage.textContent = "Excellent! You're a true gaming and tech expert! 🏆";
        } else if (percentage >= 60) {
            scoreMessage.textContent = "Great job! You have solid gaming knowledge! 🎮";
        } else if (percentage >= 40) {
            scoreMessage.textContent = "Good effort! Keep learning about gaming and tech! 📚";
        } else {
            scoreMessage.textContent = "Keep exploring the gaming world! There's so much to discover! 🌟";
        }
    }
    
    function restartQuiz() {
        quizResult.classList.add('hidden');
        quizStart.classList.remove('hidden');
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu?.querySelectorAll('a');
    mobileLinks?.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.card-hover, .skill-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Project card interactions
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.card-hover');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this,
                    scale: 1.05,
                    rotateX: 5,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this,
                    scale: 1,
                    rotateX: 0,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
        });
    });
});

// Button hover effects
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button, .bg-gradient-to-r');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this,
                    scale: 1.05,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: this,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        });
    });
});

// Loading animation for page transitions
function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'fixed inset-0 bg-space-blue z-50 flex items-center justify-center';
    loader.innerHTML = `
        <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-electric-cyan mb-4"></div>
            <p class="text-electric-cyan font-orbitron">Loading...</p>
        </div>
    `;
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.remove();
    }, 1000);
}

// Add loading animation to navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href$=".html"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.hostname === window.location.hostname) {
                showLoadingAnimation();
            }
        });
    });
});

// Console welcome message
console.log(`
🎮 Welcome to Muhammad Ali's Portfolio!

Frontend Developer | Gaming Enthusiast | Tech Explorer

Built with:
- HTML5 & CSS3
- JavaScript (ES6+)
- Tailwind CSS
- Various animation libraries

Feel free to explore the code and get inspired!

Contact: muhammadali@example.com
GitHub: github.com/muhammadali
`);