document.addEventListener("DOMContentLoaded", () => {
    const contactSection = document.querySelector("#second-section");
    if(contactSection){
        contactSection.addEventListener("mousemove", (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 30;
            const y = (window.innerHeight / 2 - e.clientY) / 30;
            contactSection.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    const magneticButtons = document.querySelectorAll(".card");

    magneticButtons.forEach(btn => {
        let animationFrame;

        const move = (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            if(animationFrame) cancelAnimationFrame(animationFrame);

            animationFrame = requestAnimationFrame(() => {
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
        };

        btn.addEventListener("mousemove", move);

        btn.addEventListener("mouseleave", () => {
            if(animationFrame) cancelAnimationFrame(animationFrame);
            requestAnimationFrame(() => {
                btn.style.transform = "translate(0px, 0px)";
            });
        });

        btn.addEventListener("click", () => {
            window.open(btn.href, "_blank");
        });
    });
});