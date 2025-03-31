function loadGame() {
    const gamePath = document.getElementById('gameUrl').value;
    const baseUrl = 'https://www.coolmathgames.com';
    const fullUrl = `${baseUrl}${gamePath}`;
    
    const iframe = document.getElementById('gameFrame');
    iframe.src = fullUrl;
    
    // Optional: Store last played game in localStorage
    localStorage.setItem('lastGame', fullUrl);
}

// Load last played game if available
window.onload = function() {
    const lastGame = localStorage.getItem('lastGame');
    if (lastGame) {
        document.getElementById('gameFrame').src = lastGame;
    }
}
