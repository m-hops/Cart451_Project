//RUN SERVER QUERY//
async function processQuery() {

    //GET CURRENT DOCUMENT VALUEnpmS//
    let val0 = document.getElementById('testQuery').value;
    
    //SEND QUERY TO SERVER.JS //
    fetch('/api/generate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      cache: "no-cache",
      body: JSON.stringify({value: val0}),    
    })
    .then(response => response.json())
    .then(data => {console.log(data.value)})
    .catch(err => {console.error('Error:', err)})
}