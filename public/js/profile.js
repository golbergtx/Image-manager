let profileForm = new Vue({
    el: '#profileForm',
    data: {
        profileData: {},
        avatarFileName: "",
        choseNewAvatarFile: null,
        loginExist: false,
        showErrorMessage: false,
        showSuccessfullyMessage: false
    },
    watch: {
        showSuccessfullyMessage: function (newProfileData) {
            setTimeout(() => {
                this.showSuccessfullyMessage = false;
            }, 3000)
        }
    },
    methods: {
        init: function () {
            this.profileData = JSON.parse(this.getProfileData());
            this.avatarFileName = "/user-avatar/" + this.profileData.avatarFileName;
        },
        submit: function () {
            let data = "login=" + encodeURIComponent(this.profileData.login) + "&firstName=" + encodeURIComponent(this.profileData.firstName)
                + "&lastName=" + encodeURIComponent(this.profileData.lastName) + "&age=" + encodeURIComponent(this.profileData.age);

            this.checkLogin("login=" + encodeURIComponent(this.profileData.login));

            if (!this.loginExist) {
                this.showSuccessfullyMessage = this.sendDataToServer(data);

                if (this.choseNewAvatarFile) {
                    this.sendFileToServer();
                }
            }
        },
        validateData: function () {
        },
        dropFile: function (event) {
            let file = event.target.files[0];
            this.choseNewAvatarFile = file;

            let reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = function () {
                profileForm.avatarFileName = reader.result;
            }
        },
        checkLogin: function (body) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'check-login', false);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(body);
            console.log(xhr.status);
            if (xhr.status === 200) {
                this.loginExist = false;
            } else if (xhr.status === 409) {
                this.loginExist = true;
            }
        },
        getProfileData: function () {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'get-user-data', false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
            if (xhr.status != 200) {
                return null;
            } else {
                return xhr.responseText;
            }
        },
        sendDataToServer: function (body) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/update-user-data', false);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(body);
            if (xhr.status === 200) {
                return true;
            } else {
                return false;
            }
        },
        sendFileToServer: function () {
            let file = this.choseNewAvatarFile;

            let xhr = new XMLHttpRequest();
            let formData = new FormData();

            formData.append('new-avatar', file);

            xhr.open('POST', '/upload-new-avatar', false);
            xhr.send(formData);

            xhr.onreadystatechange = () => {
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    alert("Произошла ошибка при загрузке файлов");
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
});

profileForm.init();