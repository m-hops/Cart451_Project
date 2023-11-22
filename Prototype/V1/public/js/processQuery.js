//RUN SERVER QUERY//
async function processQuery() {

    //GET CURRENT DOCUMENT VALUE//
    let val1 = document.getElementById('query1').value;
    let val2 = document.getElementById('query2').value;
    let finalOutput = "I'm writing a " + val1 + " story set in the " + val2 + " .";
    
    //SEND QUERY TO SERVER.JS //
    fetch('/api/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      cache: "no-cache",
      body: JSON.stringify({value0: finalOutput}),    
    })
    .then(response => response.json())
    .then(data => {openPopup(data.value)})
    .catch(err => {console.error('Error:', err)})
}

async function openPopup(text) {
  let newImageLink = generateNewImage();
  let parsedOutput = text.replace(/\\n/g, '<br><br>');

  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay").style.display = "block";
  document.getElementById("imageHolder").innerHTML = '<img src=' + newImageLink + ' id="returnedImage">';
  document.getElementById("returnedResults").innerHTML = '<br>' + parsedOutput;
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

