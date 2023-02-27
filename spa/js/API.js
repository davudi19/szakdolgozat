// Example POST method implementation:
var e = 0;
async function postData(url = '', data = {}) {
  // Default options are marked with *
  console.log("token: " + JSON.parse(localStorage.getItem("user")).token);
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'bearer '+JSON.parse(localStorage.getItem("user")).token,
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: testJSON(data)? data : JSON.stringify(data) // body data type must match "Content-Type" header
  });
  if (response.status == 401) {
    e++;
    refreshToken();
  }else{
    return response.json(); // parses JSON response into native JavaScript objects
  }
}

// Example GET method implementation:
async function getData(url = '') {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'bearer '+JSON.parse(localStorage.getItem("user")).token,
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  if (response.status == 401) {
    if (e == 2) {
      new Auth().logOut();
      e = 0;
      return;
    }
    e++;
    refreshToken();
  }else
  {
    e = 0;
    return response; // parses JSON response into native JavaScript objects
  }
}

async function refreshToken() {
    postData('https://api.foksz.dvpc.hu/api/account/refreshtoken',localStorage.getItem('user')).then((data) => {
    console.log(data);
    localStorage.removeItem('user');
    localStorage.setItem('user',JSON.stringify(data));
  });
}



function testJSON(text) {
    if (typeof text !== "string") {
        return false;
    }
    try {
        JSON.parse(text);
        return true;
    } catch (error) {
        return false;
    }
}