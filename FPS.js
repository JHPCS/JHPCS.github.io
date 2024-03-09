document.addEventListener("click", function() {
    const target = document.querySelector(".target");
    const crosshair = document.querySelector(".crosshair");

    const targetRect = target.getBoundingClientRect();
    const crosshairRect = crosshair.getBoundingClientRect();

    if (isColliding(targetRect, crosshairRect)) {
        // Change target color immediately
        target.style.backgroundColor = "green";

        // Create bullet element
        const bullet = document.createElement("div");
        bullet.classList.add("bullet");
        
        // Calculate bullet position ahead of the target
        const delay = 500; // Adjust the delay time as needed
        const bulletStartX = crosshairRect.left + (targetRect.left - crosshairRect.left) * delay / 1000;
        const bulletStartY = crosshairRect.top + (targetRect.top - crosshairRect.top) * delay / 1000;
        
        bullet.style.left = bulletStartX + "px";
        bullet.style.top = bulletStartY + "px";
        document.querySelector(".game-container").appendChild(bullet);

        // Calculate bullet movement
        const bulletMovementX = targetRect.left - bulletStartX;
        const bulletMovementY = targetRect.top - bulletStartY;

        // Move bullet towards target after the delay
        setTimeout(() => {
            moveBullet(bullet, bulletMovementX, bulletMovementY);
        }, delay);
        
        // Reset target color and position after some time
        setTimeout(() => {
            target.style.backgroundColor = "red";
            target.style.left = "0";
        }, 1000); // Adjust this time delay as needed
    }
});
