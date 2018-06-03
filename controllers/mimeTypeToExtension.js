let mimeTypes = {
    "image/jpeg": "jpg",
    "image/png": "png"
};

exports.convertToExtension = function (mimeType) {
    return mimeTypes[mimeType] ? mimeTypes[mimeType] : ""
};