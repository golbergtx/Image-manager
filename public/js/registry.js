let registryForm = new Vue({
    el: '#registryForm',
    data: {
        login: "",
        password: "",
        firstName: "",
        lastName: "",
        age: "",
        registrySuccessFull: false,
        loginExist: false,
        showErrorLoginMessage: false,
        disableSaveDataBtn: false
    },
    watch: {
        age: function (newAge) {
            Number(newAge) > 0 ? this.disableSaveDataBtn = false : this.disableSaveDataBtn = true;
        }
    },
    methods: {
        submit: function () {
            let data = "login=" + encodeURIComponent(this.login) + "&password=" + encodeURIComponent(this.password)
                + "&firstName=" + encodeURIComponent(this.firstName) + "&lastName=" + encodeURIComponent(this.lastName)
                + "&age=" + encodeURIComponent(this.age);
            this.sendDataToServer(data);

            if (!this.registrySuccessFull) {
                //this.showErrorLoginMessage = true;
            } else {
                window.location = "/";
            }
        },
        validateData: function () {
        },
        sendDataToServer: function (body) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'registry-user', false);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(body);
            if (xhr.status === 200) {
                this.registrySuccessFull = true;
            } else if (xhr.status === 409) {
                this.loginExist = true;
            } else {
                this.registrySuccessFull = false;
            }
        }
    }
});