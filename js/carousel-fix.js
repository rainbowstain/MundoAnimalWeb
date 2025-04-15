// Script para asegurar que el contenido del carrusel sea visible, incluso si hay problemas con Swiper
document.addEventListener('DOMContentLoaded', function() {
    // Pre-carga de imágenes para mejorar la fluidez
    function preloadHeroImages() {
        const heroSlides = document.querySelectorAll('.hero-slide');
        heroSlides.forEach(slide => {
            const bgImage = slide.style.backgroundImage;
            if (bgImage) {
                const imgUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                const img = new Image();
                img.src = imgUrl;
            }
        });
    }
    
    // Iniciar precarga de imágenes
    preloadHeroImages();
    
    // Función para forzar visibilidad en elementos del carrusel con retrasos más naturales
    function forceVisibility(activeSlide) {
        if (!activeSlide) return;
        
        // Hacer visible el wrapper primero para mejor transición visual
        const heroWrapper = activeSlide.querySelector('.hero-content-wrapper');
        if (heroWrapper) {
            heroWrapper.style.opacity = '1';
        }
        
        // Pequeño retraso para asegurar que el wrapper esté visible antes de los elementos internos
        setTimeout(() => {
            const heroContent = activeSlide.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '1';
                
                // Eliminar clases de animación anteriores primero para evitar conflictos
                const heroElements = heroContent.querySelectorAll('h2, p, .btn-primary');
                heroElements.forEach(function(el) {
                    el.classList.remove('animated-fadeInUp', 'delay-100', 'delay-300', 'delay-500');
                    // Resetear el estilo para permitir que las nuevas animaciones funcionen correctamente
                    el.style.opacity = '';
                    el.style.transform = '';
                });
                
                // Breve retraso para asegurar que los estilos se han reseteado
                setTimeout(() => {
                    // Aplicar animaciones con retraso progresivo para mayor fluidez
                    heroElements.forEach(function(el, index) {
                        // Usar setTimeout en lugar de clases de retraso para una experiencia más suave
                        setTimeout(() => {
                            el.classList.add('animated-fadeInUp');
                            // No forzar los estilos inline para permitir que las animaciones CSS funcionen naturalmente
                        }, index * 150); // Incremento más natural entre elementos
                    });
                }, 20);
            }
        }, 80); // Retraso ligeramente mayor para mejor sincronización
    }
    
    // Asegurar que el contenido inicial sea visible después de una carga completa
    window.addEventListener('load', function() {
        // Pequeño retraso para permitir que Swiper inicialice completamente
        setTimeout(function() {
            const activeSlide = document.querySelector('.swiper-slide-active');
            forceVisibility(activeSlide);
        }, 150); // Incrementar el tiempo para permitir carga completa
    });
    
    // Detectar cambios en el slide activo para aplicar visibilidad
    const swiperContainer = document.querySelector('.swiper');
    if (swiperContainer) {
        const observer = new MutationObserver(function(mutations) {
            // Usar un debounce para evitar múltiples disparos
            let debounceTimer;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const activeSlide = document.querySelector('.swiper-slide-active');
                forceVisibility(activeSlide);
            }, 50);
        });
        
        // Observar cambios en todos los slides
        const slides = document.querySelectorAll('.swiper-slide');
        slides.forEach(slide => {
            observer.observe(slide, { attributes: true, attributeFilter: ['class'] });
        });
    }
    
    // Verificación periódica como respaldo
    setInterval(function() {
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide) {
            const heroContent = activeSlide.querySelector('.hero-content');
            const heroWrapper = activeSlide.querySelector('.hero-content-wrapper');
            
            if ((heroContent && window.getComputedStyle(heroContent).opacity < '0.9') ||
                (heroWrapper && window.getComputedStyle(heroWrapper).opacity < '0.9')) {
                forceVisibility(activeSlide);
            }
        }
    }, 2500); // Incrementar el intervalo para evitar interferencias
}); 