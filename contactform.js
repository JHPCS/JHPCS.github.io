const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const data = {
        name: name,
        email: email,
        message: message
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'mailto:arfg.space@gmail.com');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        if (xhr.status === 200) {
            alert('Message sent successfully!');
            contactForm.reset();
        } else {
            alert('Error sending message!');
        }
    };
    xhr.send(JSON.stringify(data));
});
