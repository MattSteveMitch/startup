export function loadImages(names) {
    var images = new Array(names.length).fill(null);
    var promises = new Array(names.length).fill(null);

    for (let i = 0; i < names.length; i++) {
        images[i] = new Image();
        images[i].src = "assets/" + names[i] + ".png";
        promises[i] = new Promise((resolve, reject) => {
            images[i].onload = () => {resolve(images[i]);};
        });
    }

    return Promise.all(promises);
}