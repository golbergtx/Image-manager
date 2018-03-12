let loginForm = new Vue({
    el: '#loginForm',
    data: {
        login: null,
        password: null,
        loginSuccessFull: false,
        showErrorLoginMessage: false
    },
    methods: {
        submit: function () {
            this.loginSuccessFull = this.loginToServer();
            if (!this.loginSuccessFull) {
                this.showErrorLoginMessage = true;
            }
        },
        loginToServer: function (body) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'login-check', false);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(body);
            if (xhr.status != 200) {
                return false;
            } else {
                return true;
            }
        }
    }
});
//debug
console.log(loginForm);
