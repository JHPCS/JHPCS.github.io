// Your existing JavaScript would work like this:
function loadGame() {
    const gamePath = document.getElementById('gameUrl').value;
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/https://www.coolmathgames.com' + gamePath;
    document.getElementById('gameFrame').src = proxyUrl;
}

// Load last played game if available
window.onload = function() {
    const lastGame = localStorage.getItem('lastGame');
    if (lastGame) {
        document.getElementById('gameFrame').src = lastGame;
    }
}
