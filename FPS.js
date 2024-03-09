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
        target.style.backgroundColor = "green";
    }
});

function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}
