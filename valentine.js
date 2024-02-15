function checkAnswer() {
    var answer = document.getElementById('answer').value;
    var result = document.getElementById('result');
    
    
    if (answer.toLowerCase().trim() === 'refrigerator') {
        result.style.display = 'block';
        result.innerHTML = "Correct! You may want to explore!";
    } else {
        result.style.display = 'block';
        result.innerHTML = "Try again! Hint: It starts with a 'R' and ends with 'r'.";
    }
}


document.querySelector('.valentine-container').addEventListener('click', function(event) {
    
    var rect = this.getBoundingClientRect();
    
    var distFromTop = event.clientY - rect.top;
    var distFromBottom = rect.bottom - event.clientY;
    var distFromLeft = event.clientX - rect.left;
    var distFromRight = rect.right - event.clientX;
    
    var borderThreshold =  10; // Adjust this value as needed

    
    if (distFromTop <= borderThreshold || distFromBottom <= borderThreshold ||
        distFromLeft <= borderThreshold || distFromRight <= borderThreshold) {
        var bottomRightText = document.getElementById('bottomRightText');
        if (bottomRightText.style.display === 'none') {
            bottomRightText.style.display = 'block';
        } else {
            bottomRightText.style.display = 'none';
        }
    }
});

function toggleHint() {
    var hintElement = document.getElementById('hint');
    if (hintElement.style.display === 'none') {
        hintElement.style.display = 'block';
    } else {
        hintElement.style.display = 'none';
    }
}
