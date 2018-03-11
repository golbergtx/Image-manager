let loginBtn = document.getElementById("loginBtn");
let loginSuccessful = false;

function login(body) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'login-check', false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);
    if (xhr.status != 200) {
        return false;
    } else {
        alert( xhr.responseText );
        return true;
    }
}

loginBtn.addEventListener("submit", function (e) {
    e.preventDefault();

    loginSuccessful = login("test");

    console.log(loginSuccessful)
});