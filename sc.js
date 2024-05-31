document.addEventListener('DOMContentLoaded', loadScrapbook);

document.getElementById('imageUpload').addEventListener('change', handleImageUpload);

async function loadScrapbook() {
    const response = await fetch('http://localhost:3000/api/items');
    const items = await response.json();
    items.forEach(item => {
        let element;
        if (item.type === 'image') {
            element = document.createElement('img');
            element.src = item.content;
        } else if (item.type === 'text') {
            element = document.createElement('div');
            element.className = 'text';
            element.textContent = item.content;
        } else if (item.type === 'video') {
            element = document.createElement('video');
            element.src = item.content;
            element.controls = true;
        }
        if (element) {
            addPageElement(element);
        }
    });
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        addPageElement(img);

        // Save to server
        await saveItem({ type: 'image', content: e.target.result });
    }
    reader.readAsDataURL(file);
}

async function addText() {
    const text = prompt("Enter your text:");
    if (text) {
        const textElement = document.createElement('div');
        textElement.className = 'text';
        textElement.textContent = text;
        addPageElement(textElement);

        // Save to server
        await saveItem({ type: 'text', content: text });
    }
}

async function addVideo() {
    const url = prompt("Enter video URL:");
    if (url) {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        addPageElement(video);

        // Save to server
        await saveItem({ type: 'video', content: url });
    }
}

function addPageElement(element) {
    const page = document.createElement('div');
    page.className = 'page';
    page.appendChild(element);
    document.getElementById('pages').appendChild(page);
}

async function saveItem(item) {
    await fetch('http://localhost:3000/api/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });
}
