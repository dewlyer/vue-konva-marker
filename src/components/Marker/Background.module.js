export const shadow = {
    shadowColor: 'black',
    shadowBlur: 15,
    shadowOffsetX: 15,
    shadowOffsetY: 15,
    shadowOpacity: 0.3,
};

export function loadAllImages(src) {
    return Promise.all(src.map(url => createPromise(url)));
}

function createPromise(url) {
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
    });
}