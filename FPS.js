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
        if (target.shootable) { // Check if target is shootable
            target.style.backgroundColor = "green";
            target.shootable = false; // Set shootable state to false
            setTimeout(() => {
                target.style.backgroundColor = "red"; // Change color back to red after delay
                target.shootable = true; // Set shootable state to true again
            }, 1000); // Adjust delay time as needed
        }
    }
});

function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}
