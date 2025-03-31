// coolmath.js
async function loadGame() {
    const gamePath = document.getElementById('gameUrl').value;
    const proxyUrl = `https://cors-anywhere.herokuapp.com/https://www.coolmathgames.com${gamePath}`;
    
    try {
        const response = await fetch(proxyUrl, {
            headers: {
                'Origin': 'https://www.coolmathgames.com',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0' // Some sites require user agent
            }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const html = await response.text();
        const gameContainer = document.getElementById('gameContainer');
        
        // Clear previous content and inject new HTML
        gameContainer.innerHTML = '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Fix relative URLs in links and scripts
        const base = document.createElement('base');
        base.href = `https://www.coolmathgames.com${gamePath}`;
        gameContainer.appendChild(base);
        
        // Clone and append body content
        const nodes = doc.body.children;
        while(nodes.length > 0) {
            gameContainer.appendChild(nodes[0]);
        }
        
    } catch (error) {
        alert(`Failed to load game: ${error.message}`);
        console.error('Error details:', error);
    }
}

// Initialize last game on load
window.addEventListener('DOMContentLoaded', () => {
    const lastGame = localStorage.getItem('lastGame');
    if(lastGame) document.getElementById('gameUrl').value = lastGame;
});
