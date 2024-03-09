const player = document.querySelector('.player');
const world = document.querySelector('.world');

let x = 50;
let y = 50;

function updatePlayerPosition() {
    player.style.left = x + '%';
    player.style.top = y + '%';
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowUp') {
        y -= 5;
    } else if (key === 'ArrowDown') {
        y += 5;
    } else if (key === 'ArrowLeft') {
        x -= 5;
    } else if (key === 'ArrowRight') {
        x += 5;
    }

    // Restrict player movement within the world
    x = Math.max(Math.min(x, 95), 5);
    y = Math.max(Math.min(y, 95), 5);

    updatePlayerPosition();
});
