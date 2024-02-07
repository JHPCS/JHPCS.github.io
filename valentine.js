// Add event listener to answer submission button
const button = document.querySelector('button');
button.addEventListener('click', function(event) {
  event.preventDefault();

  // Get user input
  const answer = document.querySelector('input[name="answer"]').value;

  // Check if answer is correct
  if (answer.toLowerCase() === "your answer goes here") {
    // Show success message
    alert("Congratulations! You guessed the riddle correctly!");
  } else {
    // Show error message
    alert("Oops, that's not quite right. Try again!");
  }
});
