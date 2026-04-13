// carousel.js
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    let slides = Array.from(document.querySelectorAll(".carousel-slide"));
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    const indicatorsContainer = document.querySelector(".carousel-indicators");

    let index = 1;
    let interval;
    const autoplayDelay = 3000;

    //CLONAR PRIMER Y ÚLTIMO SLIDE (Loop infinito)
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    slides = Array.from(document.querySelectorAll(".carousel-slide"));

    track.style.transform = `translateX(-${index * 100}%)`;

    //CREAR INDICADORES DINÁMICOS (minimizar reflows)
    const fragment = document.createDocumentFragment();
    slides.slice(1, -1).forEach((_, i) => {
        const dot = document.createElement("span");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            index = i + 1;
            rafMoveToSlide();
        });
        fragment.appendChild(dot);
    });
    indicatorsContainer.appendChild(fragment);
    const indicators = document.querySelectorAll(".carousel-indicators span");

    function updateIndicators() {
        indicators.forEach(dot => dot.classList.remove("active"));
        indicators[index - 1]?.classList.add("active");
    }

    //LAZY LOAD DE IMÁGENES 
    function lazyLoadSlide(slide) {
        if (!slide) return;
        const img = slide.querySelector('img[data-src]');
        if (img && !img.src) {
            img.src = img.dataset.src;
        }
    }

    function loadVisibleSlides() {
        lazyLoadSlide(slides[index]);    
        lazyLoadSlide(slides[index - 1]); 
        lazyLoadSlide(slides[index + 1]);   
    }

    //MOVIMIENTO DE SLIDE CON rAF
    function rafMoveToSlide() {
        requestAnimationFrame(() => {
            track.style.transition = "transform 0.5s ease-in-out";
            track.style.transform = `translateX(-${index * 100}%)`;
            updateIndicators();
            loadVisibleSlides();
        });
    }

    //BOTONES
    nextBtn.addEventListener("click", () => {
        if (index >= slides.length - 1) return;
        index++;
        rafMoveToSlide();
    });

    prevBtn.addEventListener("click", () => {
        if (index <= 0) return;
        index--;
        rafMoveToSlide();
    });

    //LOOP INFINITO
    track.addEventListener("transitionend", () => {
        if (slides[index] === firstClone) {
            track.style.transition = "none";
            index = 1;
            track.style.transform = `translateX(-${index * 100}%)`;
        }
        if (slides[index] === lastClone) {
            track.style.transition = "none";
            index = slides.length - 2;
            track.style.transform = `translateX(-${index * 100}%)`;
        }
    });

    //AUTOPLAY
    function startAutoplay() {
        interval = setInterval(() => {
            nextBtn.click();
        }, autoplayDelay);
    }

    function stopAutoplay() {
        clearInterval(interval);
    }

    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", startAutoplay);

    startAutoplay();

    //SOPORTE TÁCTIL
    let startX = 0;
    let endX = 0;

    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener("touchmove", (e) => {
        endX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", () => {
        if (startX - endX > 50) nextBtn.click();
        if (endX - startX > 50) prevBtn.click();
    });

    //INICIALIZACIÓN
    rafMoveToSlide();   // slide inicial
    loadVisibleSlides(); // cargar imágenes visibles
});