//RUN SERVER QUERY//
async function processQuery() {

    //GET CURRENT DOCUMENT VALUEnpmS//
    let field0 = document.getElementById('field0').value.toLowerCase(); 
    let field1 = document.getElementById('field1').value.toLowerCase();
    let field2 = document.getElementById('field2').value.toLowerCase();
    let field3 = document.getElementById('field3').value.toLowerCase();
    let field4 = document.getElementById('field4').value.toLowerCase();
    let field5 = document.getElementById('field5').value.toLowerCase();

    let sent0 = `When people read my story, I want them to feel ${field0}.`;
    let sent1 = `The lesson/moral of my story is ${field1}.`;
    let sent2 = `The genre(s) that would best describe my story is ${field2}.`;
    let sent3 = `One important detail of my story is ${field3}.`;
    let sent4 = `The location where my story takes place is ${field4}.`;
    let sent5 = `The time my story takes place in is ${field5}.`;
    
    let finalQuery = `${sent0} ${sent1} ${sent2} ${sent3} ${sent4} ${sent5}`

    loadScreen();

    //console.log(finalQuery);

    //SEND QUERY TO SERVER.JS //
    fetch('/api/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      cache: "no-cache",
      body: JSON.stringify({value: finalQuery}),    
    })
    .then(response => response.json())
    .then(data => {openPopup(data.value)})
    .catch(err => {console.error('Error:', err)})
}

async function openPopup(text) {

  document.getElementById("loadingText").style.display = "none";
  document.getElementById("loader").style.display = "none";
  document.getElementById("returnedResults").style.display = "block";

  let newImageLink = generateNewImage();
  let parsedOutput = text.replace(/\\n/g, '<br><br>');

  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay").style.display = "block";
  document.getElementById("imageHolder").innerHTML = '<img src=' + newImageLink + ' id="returnedImage">';
  document.getElementById("returnedResults").innerHTML = '<br>' + parsedOutput;
  document.getElementById("closeOverlayBTN").style.display = "block";
}

function loadScreen() {
  document.getElementById("closeOverlayBTN").style.display = "none";
  document.getElementById("returnedResults").style.display = "none";
  document.getElementById("loadingText").style.display = "block";
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay").style.display = "block";
  document.getElementById("loader").style.display = "block";
}

function closePopup() {
  document.getElementById("imageHolder").innerHTML = "";
  document.getElementById("popup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

function generateNewImage() {
  const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  
  const strPad = str => {
    return '000'.slice(str.toString().length) + str
  }
  
//GENERATES NEW URL//
const randomImageUrl = () => {
  const baseUrl = 'https://ozgrozer.github.io/100k-faces/'
  const firstFolder = '0'
  const secondFolder = randomInt(0, 9)
  const randomFile = strPad(randomInt(0, 999))
  const filename = `00${secondFolder}${randomFile}`
  const fullURL = `${baseUrl}${firstFolder}/${secondFolder}/${filename}.jpg`
  
  //CLEANS UP RESULT//
  const output = JSON.stringify([fullURL]);
  const regex = /[\[\]"]/g;
  const modifiedOutput = output.replace(regex, '');

  return modifiedOutput
}  

return randomImageUrl();
}


