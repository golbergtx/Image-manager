let categories = new Vue({
    el: "#categories",
    data: {
        categoryName: "",
        galleryData: [],
        categoriesList: [],
        enableEmptyCategoryMessage: false,
        enableEmptyCategoriesMessage: false
    },
    methods: {
        init: function () {
            try {
                this.galleryData = JSON.parse(this.getGalleryData());
            } catch (err) {
                console.log(err);
                this.galleryData = null;
                return alert("Can`t create category list, something went wrong!");
            }
            this.buildCategoriesList();
            this.isEmptyCategories();
        },
        removeCategory: function (event) {
            let index = Number(event.target.getAttribute("data-category-index"));
            this.categoriesList.splice(index, 1);
            this.isEmptyCategories();
            this.saveGalleryData();
        },
        editCategory: function (event) {
            let index = Number(event.target.getAttribute("data-category-index"));
            let categoryName = event.target.getAttribute("data-category-name");
            editPopup.changeCategoryName(categoryName);
            editPopup.changeCategoryIndex(index);
            editPopup.openPopup(true);
        },
        addCategory: function () {
            editPopup.openPopup(false);
        },
        buildCategoriesList: function () {
            this.categoriesList = this.galleryData.gallery;
        },
        isEmptyCategories: function () {
            this.enableEmptyCategoriesMessage = !this.categoriesList.length;
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
        saveGalleryData: function () {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', 'save-gallery-data', false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(this.galleryData));
            if (xhr.status === 200) {
                console.log("Gallery data successfully saved!")
            } else {
                console.warn("Gallery data not saved!")
            }
        }
    }
});
categories.init();

let editPopup = new Vue({
    el: "#editPopup",
    data: {
        popupOpened: false,
        categoryIndex: 0,
        categoryName: "",
        editMode: false,
        disableSaveDataBtn: true
    },
    watch: {
        categoryName: function (newCategoryName) {
            this.disableSaveDataBtn = !newCategoryName;
        }
    },
    methods: {
        closePopup: function () {
            this.popupOpened = false;
        },
        openPopup: function (value = false) {
            this.popupOpened = true;
            this.editMode = value;
        },
        changeCategoryName: function (value) {
            this.categoryName = value;
        },
        changeCategoryIndex: function (value) {
            this.categoryIndex = Number(value);
        },
        saveData: function () {
            if (this.editMode) {
                categories.categoriesList[this.categoryIndex].categoryName = this.categoryName;
                this.closePopup();
                this.refresh();
                categories.saveGalleryData();
            } else {
                categories.categoriesList.push({
                    categoryName: this.categoryName,
                    imageFilesNames: []
                });
                this.closePopup();
                this.refresh();
                categories.isEmptyCategories();
                categories.saveGalleryData();
            }
        },
        refresh: function () {
            this.categoryIndex = 0;
            this.categoryName = "";
            this.editMode = false;
        }
    }
});