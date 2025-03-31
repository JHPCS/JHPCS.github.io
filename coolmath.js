document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gameUrlInput = document.getElementById('gameUrl');
    const loadButton = document.getElementById('loadButton');
    const gameContainer = document.getElementById('gameContainer');
    const quickButtons = document.querySelectorAll('.quick-links button');
    
    // Event Listeners
    loadButton.addEventListener('click', loadGame);
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            gameUrlInput.value = this.dataset.path;
            loadGame();
        });
    });
    
    // Main Game Loader
    async function loadGame() {
        const gamePath = gameUrlInput.value.trim();
        if (!gamePath) {
            showError("Please enter a game path!");
            return;
        }
        
        const proxyUrl = `https://cors-anywhere.herokuapp.com/https://www.coolmathgames.com${gamePath}`;
        
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
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'text/html'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Try to find game content
            const gameContent = doc.querySelector('#game-canvas') || 
                              doc.querySelector('iframe') || 
                              doc.querySelector('.game-container');
            
            if (gameContent) {
                gameContainer.innerHTML = '';
                gameContainer.appendChild(gameContent.cloneNode(true));
                
                // Fix relative URLs
                const base = document.createElement('base');
                base.href = `https://www.coolmathgames.com${gamePath}`;
                gameContainer.prepend(base);
                
                localStorage.setItem('lastGame', gamePath);
            } else {
                throw new Error("Game content not found");
            }
            
        } catch (error) {
            showError(`Failed to load game: ${error.message}`);
            console.error("Loading error:", error);
        }
    }
    
    // Helper Functions
    function showError(message) {
        gameContainer.innerHTML = `
            <div class="error-state">
                <p>${message}</p>
                <button onclick="location.reload()">Try Again</button>
            </div>
        `;
    }
    
    // Load last game if available
    const lastGame = localStorage.getItem('lastGame');
    if (lastGame) {
        gameUrlInput.value = lastGame;
    }
});
