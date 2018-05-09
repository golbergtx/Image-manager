let gallery = new Vue({
    el: "#gallery",
    data: {
        galleryData: [],
        category: {},
        imagesList: [],
        test:[ {name: "1"}, {name: "2"}],
        imagesListCount: 6
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
        },

        buildImagesList: function (startIndex = 0) {
            let index = startIndex;

            this.imagesList.length = 0;
            for (let i = 0; i < this.imagesListCount; i++) {
                this.imagesList.push(
                    {
                        index: index,
                        fileName: this.category.imageFilesNames[index]
                    }
                );
                index++;
            }
        },
        buildCategory: function (categoryName) {
            this.category = this.getCategory(categoryName);
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
gallery.buildCategory("Общие");
gallery.category.imageFilesNames[0] = "fuck";

console.log("imagesList");
console.log(gallery.imagesList);

console.log("category");
console.log(gallery.category);

console.log("galleryData");
console.log(gallery.galleryData);

