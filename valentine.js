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
