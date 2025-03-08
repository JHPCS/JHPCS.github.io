// Show hit marker
function showHitMarker() {
    const hitMarker = document.getElementById('hit-marker');
    hitMarker.style.opacity = '1';
    
    // Hide after a short delay
    setTimeout(() => {
        hitMarker.style.opacity = '0';
    }, 100);
}

// Update the HUD
function updateHUD() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('ammo').textContent = gameState.ammo;
    document.getElementById('max-ammo').textContent = gameState.maxAmmo;
}
