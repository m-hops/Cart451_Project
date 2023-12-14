//RUN SERVER QUERY//
async function processQuery() {

    //GET CURRENT DOCUMENT VALUEnpmS//
    let field0 = document.getElementById('field0').value;
    let field1 = document.getElementById('field1').value;
    let field2 = document.getElementById('field2').value;
    let field3 = document.getElementById('field3').value;
    let field4 = document.getElementById('field4').value;
    let field5 = document.getElementById('field5').value;

    let sent0 = `When people read my story, I want them to feel ${field0}.`;
    let sent1 = `The lesson/moral of my story is ${field1}.`;
    let sent2 = `The genre that would best describe my story is ${field2}.`;
    let sent3 = `One important detail of my story is ${field3}.`;
    let sent4 = `The place my story physically takes place is ${field4}.`;
    let sent5 = `The time my story takes place in is ${field5}.`;
    
    let finalQuery = `${sent0} ${sent1} ${sent2} ${sent3} ${sent4} ${sent5}`

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
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay").style.display = "block";
  document.getElementById("imageHolder").innerHTML = '<img src="https://100k-faces.glitch.me/random-image" id="returnedImage">';
  document.getElementById("returnedResults").innerHTML = text;
}

function closePopup() {
  document.getElementById("imageHolder").innerHTML = "";
  document.getElementById("popup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

