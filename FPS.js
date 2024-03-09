let score = 0; // Initialize score variable

document.addEventListener("mousemove", function(event) {
    const crosshair = document.querySelector(".crosshair");
    crosshair.style.left = event.clientX + "px";
    crosshair.style.top = event.clientY + "px";
});

document.addEventListener("click", function(event) {
    const crosshair = document.querySelector(".crosshair");

    // Get all target elements
    const targets = document.querySelectorAll('.target');

    targets.forEach(target => {
        const targetRect = target.getBoundingClientRect();
        const crosshairRect = crosshair.getBoundingClientRect();

        if (isColliding(targetRect, crosshairRect)) {
            if (target.style.backgroundColor !== "green") { // Check if the target is not already hit
                target.style.backgroundColor = "green";
                setTimeout(() => {
                    target.style.backgroundColor = "red"; // Reset color to red after some time
                }, 1000); // Adjust this time delay as needed

                // Increment score
                score++;
                document.getElementById("score").innerText = "Score: " + score;
            }
            // Reset target position
            target.style.left = "0";

            // Reset target shootable state
            target.shootable = true;
        }
    });
});

function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}
