document.addEventListener("mousemove", function(event) {
    const crosshair = document.querySelector(".crosshair");
    crosshair.style.left = event.clientX + "px";
    crosshair.style.top = event.clientY + "px";
});

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
        bullet.style.left = crosshair.style.left;
        bullet.style.top = crosshair.style.top;
        document.querySelector(".game-container").appendChild(bullet);

        // Calculate bullet movement
        const bulletMovementX = targetRect.left - crosshairRect.left;
        const bulletMovementY = targetRect.top - crosshairRect.top;

        // Move bullet towards target
        moveBullet(bullet, bulletMovementX, bulletMovementY);

        // Reset target color and position after some time
        setTimeout(() => {
            target.style.backgroundColor = "red";
            target.style.left = "0";
        }, 1000); // Adjust this time delay as needed
    }
});

function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

function moveBullet(bullet, x, y) {
    const speed = 5; // Adjust speed as needed
    const distance = Math.sqrt(x*x + y*y);
    const time = distance / speed;

    bullet.style.transition = `left ${time}s linear, top ${time}s linear`;
    bullet.style.left = `${parseInt(bullet.style.left) + x}px`;
    bullet.style.top = `${parseInt(bullet.style.top) + y}px`;

    // Remove bullet when it reaches the target
    setTimeout(() => {
        bullet.parentNode.removeChild(bullet);
    }, time * 1000);
}
