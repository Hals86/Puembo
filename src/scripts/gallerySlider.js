export function initGallerySlider() {
    const track = document.getElementById("gallery-track");
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");
    const dots = document.querySelectorAll(".slider-dot");

    if (!track || !prevBtn || !nextBtn) {
        if (import.meta.env.DEV) {
            console.warn("Slider elements not found:", { track, prevBtn, nextBtn });
        }
        return;
    }

    let currentIndex = 0;
    const totalSlides = dots.length;
    const intervalTime = 4000;
    let autoSlideInterval;

    function updateSlide() {
        const translateX = -(currentIndex * 100);
        track.style.transform = `translateX(${translateX}%)`;

        // Update dots
        dots.forEach((dot, index) => {
            const i = parseInt(index);
            if (i === currentIndex) {
                dot.classList.remove("bg-white/50");
                dot.classList.add("bg-white", "scale-125");
            } else {
                dot.classList.add("bg-white/50");
                dot.classList.remove("bg-white", "scale-125");
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlide();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlide();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlide();
        resetTimer();
    }

    function resetTimer() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, intervalTime);
    }

    // Event Listeners
    nextBtn.addEventListener("click", () => {
        nextSlide();
        resetTimer();
    });

    prevBtn.addEventListener("click", () => {
        prevSlide();
        resetTimer();
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
            const index = parseInt(e.target.dataset.index);
            goToSlide(index);
        });
    });

    // Initialize
    updateSlide();
    resetTimer();
}
