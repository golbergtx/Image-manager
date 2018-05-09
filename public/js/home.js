let gallery = new Vue({

    data: {
        galleryData: []
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
        getGalleryData: function () {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'get-gallery-data', false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
            if (xhr.status != 200) {
                return null;
            } else {
                return JSON.parse(xhr.responseText);
            }
        }
    }
});
console.log( gallery.getGalleryData() );

