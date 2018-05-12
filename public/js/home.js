let gallery = new Vue({
    el: "#gallery",
    data: {
        galleryData: [],
        category: {},
        categoryCountImages: 0,
        imagesList: [],
        imagesListCount: 6,
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
            this.buildCategory();
            this.buildImagesList();
            this.previousBtnDisabled = !this.checkChanceBrowsePreviousImages();
            this.nextBtnDisabled = !this.checkChanceBrowseNextImages();
        },

        previousImages: function () {
            let firstIndexOfElement = this.imagesList[0].index;

            this.buildImagesList(firstIndexOfElement - this.imagesListCount);
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
            let lastIndexOfCategory = this.category.imageFilesNames.length - 1;
            return (lastIndexOfImagesList < lastIndexOfCategory);
        },
        buildImagesList: function (startIndex = 0) {
            let index = startIndex;
            this.imagesList.length = 0;
            for (let i = 0; i < this.imagesListCount; i++) {
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
        }
    }
});
gallery.init();

console.log("imagesList");
console.log(gallery.imagesList);

console.log("category");
console.log(gallery.category);

console.log("galleryData");
console.log(gallery.galleryData);
