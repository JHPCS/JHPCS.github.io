function checkAnswer() {
    var answer = document.getElementById('answer').value;
    var result = document.getElementById('result');
    
    
    if (answer.toLowerCase().trim() === 'sam') {
        result.style.display = 'block';
        result.innerHTML = "Correct! You found my secret!";
    } else {
        result.style.display = 'block';
        result.innerHTML = "Try again! Hint: It starts with a 'S' and ends with 'm'.";
    }
}
