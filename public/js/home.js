let gallery = new Vue({
    el: "#gallery",
    data: {
        galleryData: [],
        categoriesList: [],
        category: {},
        categoryCountImages: 0,
        imagesList: [],
        IMAGE_LIST_COUNT: 6,
        previousBtnDisabled: true,
        nextBtnDisabled: true
    },
    methods: {
        init: function () {
            try {
                this.galleryData = JSON.parse(this.getGalleryData());
            } catch (err) {
                console.log(err);
                this.galleryData = null;
                return alert("Can`t create Image gallery, something went wrong!");
            }
            this.buildCategoriesList();
            this.buildCategory();
            this.buildImagesList();
            this.previousBtnDisabled = !this.checkChanceBrowsePreviousImages();
            this.nextBtnDisabled = !this.checkChanceBrowseNextImages();
        },
        activateCategory: function (event) {
            let category = this.getCategory(event.target.innerText);
            if (category) {
                this.buildCategory(category.categoryName);
                this.buildImagesList();
                this.previousBtnDisabled = !this.checkChanceBrowsePreviousImages();
                this.nextBtnDisabled = !this.checkChanceBrowseNextImages();
            } else {
                alert("Sorry, can't activate this category!")
            }
        },
        previousImages: function () {
            let firstIndexOfElement = this.imagesList[0].index;

            this.buildImagesList(firstIndexOfElement - this.IMAGE_LIST_COUNT);
            this.previousBtnDisabled = !this.checkChanceBrowsePreviousImages();
            this.nextBtnDisabled = !this.checkChanceBrowseNextImages();
        },
        nextImages: function () {
            let lastIndexOfElement = this.imagesList[this.imagesList.length - 1].index;

            this.buildImagesList(lastIndexOfElement + 1);
            this.previousBtnDisabled = !this.checkChanceBrowsePreviousImages();
            this.nextBtnDisabled = !this.checkChanceBrowseNextImages();
        },
        checkChanceBrowsePreviousImages: function () {
            let firstIndexOfImagesList = this.imagesList[0].index;
            return (firstIndexOfImagesList > 0);
        },
        checkChanceBrowseNextImages: function () {
            let lastIndexOfImagesList = this.imagesList[this.imagesList.length - 1].index;
            let lastIndexOfCategory = this.categoryCountImages - 1;
            return (lastIndexOfImagesList < lastIndexOfCategory);
        },
        buildImagesList: function (startIndex = 0) {
            let index = startIndex;
            this.imagesList.length = 0;
            for (let i = 0; i < this.IMAGE_LIST_COUNT; i++) {
                if (!this.category.imageFilesNames[index]) {
                    break;
                }
                else {
                    this.imagesList.push(
                        {
                            index: index,
                            fileName: this.category.imageFilesNames[index]
                        }
                    );
                }
                index++;
            }
        },
        buildCategory: function (categoryName) {
            this.category = this.getCategory(categoryName);
            this.categoryCountImages = this.category.imageFilesNames.length;
        },
        buildCategoriesList: function () {
            this.categoriesList = this.galleryData.gallery;
        },
        getCategory: function (categoryName = null) {
            let result = null;

            if (!categoryName) {
                return this.galleryData.gallery[0];
            }
            this.galleryData.gallery.forEach(function (item, i, arr) {
                if (item.categoryName === categoryName) {
                    result = item;
                    // Дописать return (WIP)
                }
            });

            return result;
        },
        getGalleryData: function () {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'get-gallery-data', false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
            if (xhr.status != 200) {
                return null;
            } else {
                return xhr.responseText;
            }
        },
        openPopupFileUploadForm: function () {
            popupFileUploadForm.popupFileUploadFormOpened = true;
        }
    }
});
gallery.init();

console.log("imagesList");
console.log(gallery.imagesList);

console.log("categoryList");
console.log(gallery.categoriesList);

console.log("category");
console.log(gallery.category);

console.log("galleryData");
console.log(gallery.galleryData);

let popupFileUploadForm = new Vue({
    el: "#popupFileUploadForm",
    data: {
        popupFileUploadFormOpened: false,
        fileUploadFormActive: false,
        choseFiles: [],
        previewList: [],
        progressBarValue: 0,
        filesDone: 0,
        filesToDo: 0
    },
    methods: {
        closePopupFileUploadForm: function () {
            this.popupFileUploadFormOpened = false;
            this.refresh();
        },
        activateFileUploadForm: function () {
            this.fileUploadFormActive = true;
        },
        deactivateFileUploadForm: function () {
            this.fileUploadFormActive = false;
        },
        dropFile: function (event) {
            this.fileUploadFormActive = false;
            let files = event.target.files || event.dataTransfer.files;

            this.initProgressBar(files.length);

            for (let i = 0; i < files.length; i++) {
                if (files[i].type.match('image.*')) {
                    this.choseFiles.push(files[i]);
                    this.previewFile(files[i]);
                } else {
                    alert("The file must be a picture!");
                }
            }
        },
        previewFile: function (file) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                popupFileUploadForm.previewList.push(reader.result);
                popupFileUploadForm.progressDone();
            }
        },
        initProgressBar: function (countFiles = 0) {
            this.progressBarValue = 0;
            this.filesDone = 0;
            this.filesToDo = countFiles;
        },
        progressDone: function () {
            this.filesDone++;
            this.progressBarValue = this.filesDone / this.filesToDo * 100
        },
        uploadFiles: function () {
            let files = this.choseFiles;
            let xhr = new XMLHttpRequest();
            let formData = new FormData();

            this.choseFiles.forEach(function (item) {
                formData.append('new-images', item);
            });

            xhr.open('POST', 'upload-new-images', true);
            xhr.send(formData);

            xhr.onreadystatechange = () => {
                if (xhr.readyState != 4) return;

                if (xhr.status != 200) {
                    alert("Произошла ошибка при загрузке файлов");
                } else {
                    alert("Файлы успешно загружены!");
                    this.refresh();
                    let fileNames = JSON.parse(xhr.responseText);

                    fileNames.forEach(function (item) {
                        gallery.category.imageFilesNames.push(item);
                        gallery.categoryCountImages++;
                        gallery.buildImagesList(gallery.imagesList[0].index);
                        gallery.nextBtnDisabled = !gallery.checkChanceBrowseNextImages();
                    });
                }
            }
        },
        refresh: function () {
            this.choseFiles = [];
            this.previewList = [];
            this.initProgressBar();
        }
    }
});