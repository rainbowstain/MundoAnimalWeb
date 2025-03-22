// Animaciones para el carrusel con transiciones mejoradas
document.addEventListener('DOMContentLoaded', function() {
    // Hero Carousel Enhancement
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
        // Configurar transiciones más suaves
        const carousel = new bootstrap.Carousel(heroCarousel, {
            interval: 7000,       // Tiempo entre slides más largo para mejor experiencia
            pause: false,         // No pausar al pasar el mouse para mantener la fluidez
            wrap: true,           // Continuar desde el principio al llegar al final
            touch: true           // Permitir control táctil
        });
        
        // Aplicar estilos de transición más suaves a todos los slides
        const carouselItems = heroCarousel.querySelectorAll('.carousel-item');
        carouselItems.forEach(item => {
            item.style.transition = 'transform 1.5s ease-in-out, opacity 1.5s ease-in-out';
        });
        
        // Mejorar transiciones entre slides con animaciones más fluidas
        heroCarousel.addEventListener('slide.bs.carousel', function (e) {
            // Obtener el slide actual y el próximo
            const currentSlide = this.querySelector('.carousel-item.active');
            const nextSlide = e.relatedTarget;
            
            // Animar salida del slide actual - más rápido
            if (currentSlide) {
                const currentContent = currentSlide.querySelector('.hero-content');
                if (currentContent) {
                    // Salida más rápida
                    currentContent.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                    currentContent.style.opacity = '0';
                    currentContent.style.transform = 'translateY(-20px)';
                }
            }
            
            // Preparar y animar entrada del próximo slide
            if (nextSlide) {
                const content = nextSlide.querySelector('.hero-content');
                if (content) {
                    // Configurar estado inicial
                    content.style.transition = 'opacity 0s';
                    content.style.opacity = '0';
                    content.style.transform = 'translateY(30px)';
                    
                    // Aplicar la animación después de un breve retraso
                    setTimeout(() => {
                        content.style.transition = 'opacity 1.2s ease-in-out, transform 1.2s ease-in-out';
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }, 400);
                }
                
                // Aplicar efecto de zoom suave al fondo
                const heroSlide = nextSlide.querySelector('.hero-slide');
                if (heroSlide) {
                    heroSlide.style.transition = 'transform 8s ease-out';
                    heroSlide.style.transform = 'scale(1)';
                    setTimeout(() => {
                        heroSlide.style.transform = 'scale(1.05)';
                    }, 400);
                }
            }
        });
        
        // Mejorar la interactividad de los indicadores personalizados
        const customIndicators = document.querySelectorAll('.custom-carousel-indicators button');
        customIndicators.forEach(indicator => {
            // Efecto hover más suave
            indicator.addEventListener('mouseover', function() {
                this.style.transition = 'all 0.3s ease';
                this.style.transform = 'scale(1.2)';
                this.style.boxShadow = '0 0 12px rgba(255, 107, 107, 0.8)';
            });
            
            indicator.addEventListener('mouseout', function() {
                this.style.transition = 'all 0.3s ease';
                if (!this.classList.contains('active')) {
                    this.style.transform = 'scale(1)';
                    this.style.boxShadow = 'none';
                }
            });
            
            // Hacer clic más suave con animación
            indicator.addEventListener('click', function() {
                // Aplicar efecto de pulso
                this.style.animation = 'pulse 0.4s ease-out';
                
                // Remover clase active de todos los indicadores
                customIndicators.forEach(ind => {
                    ind.classList.remove('active');
                    ind.style.transform = 'scale(1)';
                    ind.style.boxShadow = 'none';
                });
                
                // Agregar clase active al indicador clickeado
                this.classList.add('active');
                
                setTimeout(() => {
                    this.style.animation = '';
                    if (this.classList.contains('active')) {
                        this.style.transform = 'scale(1.2)';
                        this.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.7)';
                    }
                }, 400);
            });
        });
        
        // Sincronizar los indicadores personalizados con el carrusel
        heroCarousel.addEventListener('slid.bs.carousel', function(e) {
            const activeIndex = parseInt(e.to);
            customIndicators.forEach((indicator, index) => {
                if (index === activeIndex) {
                    indicator.classList.add('active');
                    indicator.style.transform = 'scale(1.2)';
                    indicator.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.7)';
                } else {
                    indicator.classList.remove('active');
                    indicator.style.transform = 'scale(1)';
                    indicator.style.boxShadow = 'none';
                }
            });
        });
        
        // Inicializar el efecto de zoom en el slide activo al cargar la página
        const activeSlide = heroCarousel.querySelector('.carousel-item.active .hero-slide');
        if (activeSlide) {
            activeSlide.style.transition = 'transform 8s ease-out';
            setTimeout(() => {
                activeSlide.style.transform = 'scale(1.05)';
            }, 500);
        }
    }
});

// Añadir animación de pulso para los indicadores
document.head.insertAdjacentHTML('beforeend', `
<style>
@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
}

.carousel-indicators [data-bs-target] {
    transition: all 0.5s ease;
}

.indicator-hover {
    transform: scale(1.2);
    box-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
}

.indicator-clicked {
    transform: scale(1.3);
    box-shadow: 0 0 15px rgba(255, 107, 107, 0.9);
}

.carousel-item {
    transition: transform 1.5s ease, opacity 1.5s ease !important;
}
</style>
`);

