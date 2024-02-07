function checkAnswer() {
    var answer = document.getElementById('answer').value;
    var result = document.getElementById('result');
    
    
    if (answer.toLowerCase().trim() === 'Sam') {
        result.style.display = 'block';
        result.innerHTML = "Correct! You found my secret!";
    } else {
        result.style.display = 'block';
        result.innerHTML = "Try again! Hint: It starts with a 'Y' and ends with 'me'.";
    }
}
