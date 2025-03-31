document.addEventListener('DOMContentLoaded', function() {
    const loadBtn = document.getElementById('load-btn');
    const statusMessage = document.getElementById('status-message');
    const content = document.getElementById('content');
    const loading = document.getElementById('loading');
    const proxyFrame = document.getElementById('proxy-frame');
    
    // Hide loading initially
    loading.style.display = 'none';
    
    loadBtn.addEventListener('click', function() {
        try {
            loading.style.display = 'block';
            statusMessage.textContent = '';
            
            // Create proxy iframe
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';
            iframe.style.height = '600px';
            iframe.style.border = 'none';
            
            // You can try different approaches:
            
            // Approach 1: Direct loading (least likely to work with blockers)
            iframe.src = 'https://www.coolmathgames.com/';
            
            // Approach 2: Using a free CORS proxy (may work with some blockers)
            // iframe.src = 'https://cors-anywhere.herokuapp.com/https://www.coolmathgames.com/';
            
            // Clear previous content and add the iframe
            content.innerHTML = '';
            content.appendChild(iframe);
            
            iframe.onload = function() {
                loading.style.display = 'none';
            };
            
            iframe.onerror = function() {
                loading.style.display = 'none';
                statusMessage.textContent = 'Error loading content. Try another approach.';
            };
            
        } catch (error) {
            loading.style.display = 'none';
            statusMessage.textContent = 'Error: ' + error.message;
        }
    });
});
