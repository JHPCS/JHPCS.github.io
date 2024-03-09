document.addEventListener("mousemove", function(event) {
    const crosshair = document.querySelector(".crosshair");
    crosshair.style.left = event.clientX + "px";
    crosshair.style.top = event.clientY + "px";
});

let canShoot = true; // Variable to control shooting delay
document.addEventListener("click", function() {
    if (canShoot) {
        const target = document.querySelector(".target");
        const crosshair = document.querySelector(".crosshair");
        const bullet = document.querySelector(".bullet");

        const targetRect = target.getBoundingClientRect();
        const crosshairRect = crosshair.getBoundingClientRect();

        // Calculate bullet position
        const bulletX = crosshairRect.left + crosshairRect.width / 2;
        const bulletY = crosshairRect.top + crosshairRect.height / 2;
        bullet.style.left = bulletX + "px";
        bullet.style.top = bulletY + "px";

        // Move bullet towards target
        const targetX = targetRect.left + targetRect.width / 2;
        const targetY = targetRect.top + targetRect.height / 2;
        const dx = targetX - bulletX;
        const dy = targetY - bulletY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 5; // Adjust bullet speed as needed
        const time = distance / speed;

        bullet.style.transition = `left ${time}s linear, top ${time}s linear`;
        bullet.style.left = targetX + "px";
        bullet.style.top = targetY + "px";

        canShoot = false; // Disable shooting temporarily

        // After bullet reaches the target, turn the target green
        setTimeout(() => {
            if (isColliding(targetRect, bullet.getBoundingClientRect())) {
                target.style.backgroundColor = "green";
                canShoot = true; // Enable shooting again
            }
        }, time * 1000); // Convert time to milliseconds

        // Reset bullet position after bullet reaches the target
        setTimeout(() => {
            bullet.style.transition = "";
            bullet.style.left = "-100px";
            bullet.style.top = "-100px";
        }, time * 1000 + 100); // Add some extra time for the bullet to fully reach the target
    }
});

function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}
