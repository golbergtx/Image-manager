let loginForm = new Vue({
    el: '#loginForm',
    data: {
        login: "",
        password: "",
        loginSuccessFull: false,
        showErrorLoginMessage: false
    },
    methods: {
        submit: function () {
            let data = "login=" + encodeURIComponent(this.login) + "&password=" + encodeURIComponent(this.password);
            this.loginSuccessFull = this.loginToServer(data);
            if (!this.loginSuccessFull) {
                this.showErrorLoginMessage = true;
            } else {
                window.location = "/";
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