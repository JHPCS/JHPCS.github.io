function closeDisclaimer() {
  var disclaimer = document.getElementById('disclaimer');
  disclaimer.style.display = 'none';
}


window.onload = function() {

  var disclaimer = document.getElementById('disclaimer');
  disclaimer.style.display = 'block';


  const textColorInput = document.getElementById("textColor");
  const containerColorInput = document.getElementById("containerColor");
  const backgroundColorInput = document.getElementById("backgroundColor");


  textColorInput.value = defaultButtonColors.textColor;
  containerColorInput.value = defaultButtonColors.containerColor;
  backgroundColorInput.value = defaultButtonColors.backgroundColor;
};

const defaultButtonColors = {
  textColor: "#FFFFFF", 
  containerColor: "#29465B",  
  backgroundColor: "#1F3B4D" 
};


const facts= [

  'When you put water in the microwave it can go over 100° celsius without boiling! The reason for this is due to the microwave directly heating up the water instead of the container. The "super heated" water is trapped inside of the rest of the water by surface tension.',
  'In the 1960s the CIA made a cyborg cat. The project cost 20 million USD and it was called "Acoustic Kitty". They implanted a microphone in the ear canal of the cat, and had an antenna running through its body even through its tail. This was for connection. They also placed batteries somewhere in the cat which was not specified. They released the cat to spy on 2 Russians in a park; it got hit and killed by a taxi. They waited til the Russians were not looking so they could gather the tech without them getting to it.',
  'A man once ate an entire airplane! The reason he was able to do this was because his stomach acid was stronger than the average person, his stomach lining was also tougher than the average person. Soft foods like eggs, bananas, etc, would actually hurt his stomach, he got a award for the weirdest diet and he then ate the award.',
  'You can legally buy a tank! There are a ton of things you have to do to the tank before legally owning it, for example you have to remove the firing mechanism. However if you have a Destructive Device permit or license you can keep everything.',
  'Why JFK airport throws away hundreds of pounds of fruit and food each day. Fruits in other countries may have other diseases and things that could harm fruit in the US. For example US oranges were going bad due to other fruit in other countries it took 2 years for the US orange shortage to stop.',
  'You can see your nose all the time, your brain just ignores it.',
  'In your entire life you walk the equivalent of 2 times around the world!',
  'As you may know, yawns are "contagious", however psychopaths are immune to contagious yawning since they lack empathy. ',
  'Harmony Homes has a housing development in Henderson, Nevada, a suburb of Las Vegas, and they are naming all of their streets after Pokemon characters. It is still under construction but Jigglypuff and Snorlax lane are listed on Google Maps. Charmander lane and Charizard are coming soon. I saw a sign for Squirtle lane but on Google Maps it says squirrel so who knows. The Construction Administration Manager, Andrea Miller said street names were hard so she asked her kids to name them, this is not the first set of street names with funny names either. In a previous development they named all the streets after paw patrol characters. The next set of streets she said will be named after Yellowstone characters.',
  'A Brazilian priest launched himself into the sky attached to 1000 helium party balloons so he could beat the world record of longest time in flight with party balloons. He did this to raise money for a roadside chapel. Reverend Adelir Antonio de Carli took off from Paranagua on April 20th, 2008. He was very experienced in skydiving and trained in wilderness survival. He took off with all the equipment needed, the chair that was attached to the balloons could be used as a floatation device, he was wearing a parachute and a thermal aluminum suit, he carried a mobile phone, a sat phone, and a GPS. He did not know how to use the GPS though. Shortly after takeoff he lost control of his flying contraption. He called the military police later to determine his location which was 16 miles from the island of Tamboretes. The last call he made to his friends saying he was about to crash into the ocean. The priest was declared missing 8 hours after takeoff. The Brazilian Navy searched for the priest but called the search off 9 days later. 3 months later half of his body and deflated balloons were found by an oil rig support vessel. ',
  'Woodpeckers wrap their tongue around their skull. The tongue is also supported by bone and cartilage called the hyoid apparatus. This is to protect their skull whilst they are pecking at a tree. The hyoid bones have stiffer and spongier parts that help dissipate energy, like a bike helmet.',
  'Thomas Jefferson was not only a president but also a farmer, a lawyer, an architect, an inventor, an archaeologist, and a musician. He could also read books in 7 different languages. ',
  'The myth about peeing on jellyfish stings is a lie. It will actually make things worse. The jellyfish stinging cells, nematocysts, actually inject a venom into you. The myth says it will stop those from firing but it can actually do the opposite and make more fire. Vinegar however is much better than pee. You should also pluck off the tentacles with tweezers if you can. It will disturb the un-fired cells less than scrubbing with sea water or using a credit card. Heat can also help break down the compounds and make the pain go away faster.',
  'The speed of commercial airliners has not increased since the 1960s. It tops out at around 590 MPH. It is fast but more than likely will not become faster. The shape of the wing is called an airfoil which is needed for the plane to work and looks kinda like a teardrop, the air flowing over the top of that shape goes faster than the air below the shape. When you reach 80% the speed of sound the air going over the top of the wing starts to break the sound barrier. That creates shockwaves, which creates drag, which slows the plane down. You could overcome that drag but it would use so much fuel that flights would get way more expensive.',
  'A lot of expensive cars you might see have a Montana license plate. These expensive cars have a lot of sales tax like a 3 million dollar bugatti may be 300k in sales tax. Also the cars do not have to touch Montana for the license plate. There is one con, crashing your car with this montana license plate and not living there, insurance may not pay.',
  'Medical bills can be expensive, a lot of the time there are errors in them. You can ask for an itemized bill to see every charge and if there is something there that should not be there you can argue it to not pay that charge.',
  'In 75 BCE Julius Caesar, who would later become the dictator of the Roman empire, was kidnapped by pirates. He was only 25 at the time but probably the worst person they could mess with. For starters when the pirates told him his servants would have to pay 20 talents(620kg) of silver if he wanted to live Julius laughed and felt insulted, he told them 50 talents(1550kg) of silver is a better price. In the 38 days it took his servants to get the silver he refused to behave like a captive. He treated the pirates like he was in charge of them, bossing them around and telling them to not talk whilst he slept. The pirates respected him and his wishes, they also let him do basically anything he wanted. He was friendly with them as well but he promised once he was free he would hunt them down and crucify them. They did not take the threat seriously but once he paid the ransom and was free to go he kept his word, got a small fleet and killed all of them.',
  'Most of the time if you grab a pair of pants, put it around your neck and make the waist touch each other and they touch it should fit you. Of course it also depends on your body type.',
  'School buses are yellow because we see yellow faster than any other color. Some people think they see red faster however out of your peripheral vision you see yellow 1.24 times faster than you would see red. So in 1974 the National Association Of State Directors Of Pupil Transportation made the color of buses yellow since then they have found more reflective colors but everyone knows what a school bus looks like so yellow it is.',
  'The reason that plastic dishes in the dishwater are not always dry is due to the fact it is not as good at holding onto heat like glass, metal, and ceramic. The dishwasher can reach temperatures of up to 170 degrees F the metal, glass, ceramic, dishes soak up that heat and make the water evaporate off them by the end of the cycle.',
  'In 2016 a 30 something year old blonde woman got on a plane in Philadelphia. When she got to her seat and sat down she thought the man next to her felt a little off. He had a foreign accent, looked Middle Eastern and was focused on writing down something in a strange language in his notebook. She would try to engage in small talk with the man but he would  deflect her questions because he was so focused on his notebook. She was scared that he was a terrorist that intended on bringing down a plane so she quietly told the flight attendant and told her about the man just in case. The womans seatmate was escorted by the authorities for questioning, around an hour later they then realized something ridiculous. The weird language the man was writing in was math, the man was Guido Menzio, a tenured and decorated Ivy League economist. He was doing last minute prep for a talk he was about to give that week involving differential equations which was the reason he did not want to talk to the woman. Guido was Italian, not even Middle Eastern.  ',
  'In the early 2000s a tiny honey badger named Stoffel escaped from his enclosure and immediately went to fight the lions in the exhibit next to him. Since lions are well, they severely mauled him. Stoffel had to spend 2 months recovering in the hospital clinic. However as soon as he was let out he escaped his enclosure and went to the lions once again. After he did this Stoffels enclosure was relocated across the park away from the lions. The staff put a female honey badger in his pen to keep him distracted too. However he used her to escape, standing on top of her head to unlock the gate. When he escaped that time his handler built an entire new, escape proof pen without a gate. But in just hours Stoffel climbed the trees and escaped that way, when the trees were removed he piled up rocks to escape. Then the rocks were removed and he just molded dirt to escape. This last time he broke into his handlers house and tried to get into his bedroom. The handler was terrified that it was a burglar.',
  'In 1995 around 4 in the morning a 41 year old man snuck into the back of the Duffys Circus facility in Galway, Ireland, his intention was to pet the tigers. When he arrived at the tiger cage he found 7 tigers behind heavy iron bars and wire mesh, but there was a gap at the bottom of the wire mesh where the staff would put the tigers food in. The man put his arm in the cage to try and pet one of the tigers and the tiger promptly ripped his arm off at the elbow. The man then did what any logical person would do and used his still attached arm to try to take the lost arm back from the tiger. Another tiger then took his arm off at the elbow. The man went to find help and was immediately transported to the hospital where he was treated for his injuries.',
















];


let currentFactIndex= 23; 
let factHistory = [];


function displayRandomFact() {
const factDisplay= document.getElementById("factDisplay");
const randomIndex= Math.floor(Math.random() * facts.length);
factHistory.push(factDisplay.textContent);
factDisplay.textContent = facts[randomIndex];
currentFactIndex= randomIndex;

}


function displaySelectedFact() {
  const factDisplay = document.getElementById("factDisplay");
  const dropdown = document.getElementById("factDropdown");
  const selectedIndex = dropdown.value;
  
  if (selectedIndex >= 0 && selectedIndex < facts.length) {
    factDisplay.textContent = facts[selectedIndex];
  } else {
    factDisplay.textContent = "Invalid selection";
  }
}
const factDropdown = document.getElementById("factDropdown");
factDropdown.addEventListener("change", displaySelectedFact);




function undoLastFact () {
const factDisplay = document.getElementById("factDisplay");
if (factHistory.length>0) {
const previousFact=factHistory.pop();






  factDisplay.textContent=previousFact;
  
}











else {
factDisplay.textContent="No previous fact available.";






}














};
const factDisplay = document.getElementById("factDisplay");
const readFactButton = document.getElementById("readFactButton")
const stopReadingButton = document.getElementById("stopReadingButton")
let utterance = null; 
readFactButton.addEventListener("click", () => {
const textToRead = factDisplay.textContent;
utterance = new SpeechSynthesisUtterance(textToRead);
window.speechSynthesis.speak(utterance);





}



);
stopReadingButton.addEventListener("click", () => {
window.speechSynthesis.cancel();










});






















  const menuIcon = document.querySelector(".menu-icon");
  const menuLinks = document.querySelector(".menu-links");

  menuIcon.addEventListener("click", () => {
      menuLinks.classList.toggle("show-menu");
  });
;
function toggleMenu() {
  const menuLinks = document.querySelector(".menu-links");
  menuLinks.classList.toggle("open"); 
}




document.addEventListener("DOMContentLoaded", function () {
  const fontSizeSlider = document.getElementById("fontSizeSlider");
  const fontSizeValue = document.getElementById("fontSizeValue");

  function updateFontSize() {
    const newSize = fontSizeSlider.value + "px";
    factDisplay.style.fontSize = newSize;
    fontSizeValue.textContent = newSize;
  }

  fontSizeSlider.addEventListener("input", updateFontSize);
  updateFontSize();
});





        
        
        
        
        
        
     

document.getElementById("openSettings").addEventListener("click", function() {
  document.getElementById("settingsPanel").style.display = "block";
});

document.getElementById("applySettings").addEventListener("click", function() {
    const textColorInput = document.getElementById("textColor");
    const containerColorInput = document.getElementById("containerColor");
    const backgroundColorInput = document.getElementById("backgroundColor");
    const buttonTextColorInput = document.getElementById("buttonTextColor"); // Add this line

    const textColor = textColorInput.value;
    const containerColor = containerColorInput.value;
    const backgroundColor = backgroundColorInput.value;
    const buttonTextColor = buttonTextColorInput.value; // Add this line

    const factDisplay = document.getElementById("factDisplay");
    const container = document.getElementById("container");
    const factButton = document.getElementById("btn"); // Add this line

    if (textColor !== textColorInput.defaultValue) {
        factDisplay.style.color = textColor;
    }

    if (containerColor !== containerColorInput.defaultValue) {
        container.style.backgroundColor = containerColor;
    }

    if (backgroundColor !== backgroundColorInput.defaultValue) {
        document.body.style.backgroundColor = backgroundColor;
    }

    if (buttonTextColor !== buttonTextColorInput.defaultValue) { // Add this block
        factButton.style.color = buttonTextColor;
    }

    document.getElementById("settingsPanel").style.display = "none";
});



const apiKey = 'AIzaSyC80a9hJHBehf8pum1EM8YOL3_9OO3ISAc';

    
    function searchVideos() {
      const searchInput = document.getElementById('searchInput').value;
      if (!searchInput) {
        alert('Please enter a song name');
        return;
      }

     
      fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchInput}&type=video&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.items.length === 0) {
            alert('No videos found');
          } else {
            
            const videoListDiv = document.getElementById('videoList');
            videoListDiv.innerHTML = '';
            data.items.forEach(item => {
              const videoTitle = item.snippet.title;
              const videoId = item.id.videoId;
              const listItem = document.createElement('div');
              listItem.innerHTML = `<a href="#" onclick="playVideo('${videoId}')">${videoTitle}</a>`;
              videoListDiv.appendChild(listItem);
            });
          }
        })
        .catch(error => console.error('Error:', error));
    }

    
    function playVideo(videoId) {
      const playerDiv = document.getElementById('player');
      playerDiv.innerHTML = ''; 

     
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.frameBorder = 0;
      iframe.allowFullscreen = true;
      playerDiv.appendChild(iframe);
    }

