// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set up quick game loader
    function loadQuickGame(path) {
        document.getElementById('gameUrl').value = path;
        loadGame();
    }

    // Main game loading function
    async function loadGame() {
        const gamePath = document.getElementById('gameUrl').value;
        if (!gamePath) {
            alert("Please enter a game path!");
            return;
        }

        const proxyUrl = `https://cors-anywhere.herokuapp.com/https://www.coolmathgames.com${gamePath}`;
        const gameContainer = document.getElementById('gameContainer');
        
        // Show loading state
        gameContainer.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading game...</p>
            </div>
        `;

        try {
            const response = await fetch(proxyUrl, {
                headers: {
                    'Origin': 'https://www.coolmathgames.com',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const html = await response.text();
            
            // Create a temporary container to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // Find the game iframe in the response
            const gameIframe = tempDiv.querySelector('iframe') || tempDiv.querySelector('#game-canvas');
            
            if (gameIframe) {
                gameContainer.innerHTML = '';
                gameContainer.appendChild(gameIframe);
            } else {
                throw new Error("Game content not found in response");
            }
            
            // Store last loaded game
            localStorage.setItem('lastGame', gamePath);
            
        } catch (error) {
            gameContainer.innerHTML = `
                <div class="error-state">
                    <p>⚠️ Failed to load game</p>
                    <p><small>${error.message}</small></p>
                    <button onclick="location.reload()">Try Again</button>
                </div>
            `;
            console.error("Game loading error:", error);
        }
    }

    // Expose functions to global scope
    window.loadGame = loadGame;
    window.loadQuickGame = loadQuickGame;

    // Load last game if available
    const lastGame = localStorage.getItem('lastGame');
    if (lastGame) {
        document.getElementById('gameUrl').value = lastGame;
    }
});
