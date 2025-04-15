// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // ELIMINAR COMPLETAMENTE LA PRIMERA ANIMACIÓN
    const heroContents = document.querySelectorAll('.hero-content');
    if (heroContents.length > 0) {
        heroContents.forEach(content => {
            // Eliminar cualquier estilo inline que cause la animación no deseada
            content.removeAttribute('style');
        });
    }
    
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
            nav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let valid = true;
            const inputs = contactForm.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    valid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = '';
                }
                
                // Email validation
                if (input.type === 'email' && input.value.trim()) {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value.trim())) {
                        valid = false;
                        input.style.borderColor = 'red';
                    }
                }
            });
            
            if (valid) {
                // In a real application, you would send the form data to a server
                alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
                contactForm.reset();
            } else {
                alert('Por favor completa todos los campos requeridos correctamente.');
            }
        });
        
        // Remove red border on input when user starts typing
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
    }
    
    // Newsletter form validation
   
    // Add animation on scroll - versión optimizada
    const animateOnScroll = function() {
        // Usar IntersectionObserver en lugar de scroll events
        if (!window.scrollObserver) {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            window.scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Solo aplicar estilos cuando el elemento es visible
                        requestAnimationFrame(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        });
                        // Dejar de observar una vez que se ha animado
                        window.scrollObserver.unobserve(entry.target);
                    }
                });
            }, options);
            
            // Observar todos los elementos que necesitan animación
            document.querySelectorAll('.feature-card, .category, .testimonial, .about-content, .contact-form').forEach(element => {
                window.scrollObserver.observe(element);
            });
        }
    };
    
    // Set initial state for animations
    const elementsToAnimate = document.querySelectorAll('.feature-card, .category, .testimonial, .about-content, .contact-form');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    });
    
    // Se eliminó el código que hacía que los bloques hero-content fueran clickeables
    // Solo los botones son ahora clickeables
    
    // Controlar las transiciones del carrusel - versión optimizada
    const carousel = document.getElementById('heroCarousel');
    if (carousel) {
        // Inicializar el primer slide correctamente
        const firstSlide = carousel.querySelector('.carousel-item.active');
        if (firstSlide) {
            const heroContent = firstSlide.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '1';
            }
        }
        
        // Usar un throttle para limitar la frecuencia de ejecución del evento
        let lastRun = 0;
        const throttleTime = 150; // ms entre ejecuciones
        
        // Controlar las transiciones entre slides con throttling
        carousel.addEventListener('slide.bs.carousel', function(e) {
            const now = Date.now();
            if (now - lastRun < throttleTime) return;
            lastRun = now;
            
            // Slide anterior - resetear para evitar animaciones residuales
            if (e.from !== undefined) {
                const previousSlide = this.querySelectorAll('.carousel-item')[e.from];
                if (previousSlide) {
                    const previousContent = previousSlide.querySelector('.hero-content');
                    if (previousContent) {
                        previousContent.style.animation = 'none';
                    }
                }
            }
            
            // Nuevo slide - preparar para la animación correcta
            if (e.to !== undefined) {
                const nextSlide = this.querySelectorAll('.carousel-item')[e.to];
                if (nextSlide) {
                    const nextContent = nextSlide.querySelector('.hero-content');
                    if (nextContent) {
                        // Usar requestAnimationFrame para sincronizar con el ciclo de renderizado
                        requestAnimationFrame(() => {
                            nextContent.style.opacity = '0';
                            nextContent.style.transform = 'translateX(0)';
                        });
                    }
                }
            }
        });
    }
    
    // Run animation on load only - el IntersectionObserver se encarga del scroll
    window.addEventListener('load', animateOnScroll);
    
    // Cerrar el menú móvil de Bootstrap al hacer clic en un enlace
    const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Verificar si Bootstrap está disponible
    if (typeof bootstrap !== 'undefined') {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
        
        navbarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) { // Solo en dispositivos móviles
                    bsCollapse.hide();
                }
            });
        });
    } else {
        // Fallback si bootstrap no está disponible
        navbarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    document.querySelector('.navbar-toggler').click();
                }
            });
        });
    }

    // Botón de scroll to top
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            // Animación fluida y rápida con llegada suave
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Efecto visual de "llegada"
            setTimeout(function() {
                const logo = document.querySelector('.custom-logo-img');
                if (logo) {
                    logo.classList.add('pulse-animation');
                    
                    // Quitar la clase después de la animación
                    setTimeout(function() {
                        logo.classList.remove('pulse-animation');
                    }, 1000);
                }
            }, 500);
        });
    }
    
    // Añadir funcionalidad de scroll al icono del mundo
    const worldIcon = document.querySelector('.nav-link[href="#inicio"] .fa-globe-americas');
    if (worldIcon) {
        worldIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Añadir clase de feedback visual inmediato
            worldIcon.classList.add('fa-spin');
            
            // Animación fluida para ir arriba
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Efecto visual mejorado
            const logo = document.querySelector('.custom-logo-img');
            if (logo) {
                // Retrasar ligeramente para que coincida con la llegada al inicio
                setTimeout(function() {
                    logo.classList.add('pulse-animation');
                    
                    setTimeout(function() {
                        logo.classList.remove('pulse-animation');
                    }, 1000);
                }, 300);
            }
            
            // Mantener el giro durante el desplazamiento
            setTimeout(function() {
                worldIcon.classList.remove('fa-spin');
            }, 1000);
        });
    }
});
