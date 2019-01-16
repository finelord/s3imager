export function convertImageToArrayBuffer(image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => resolve(event.target.result);
    reader.onerror = () => reject(); // TODO: figure out if we want to return/throw err here
    reader.readAsArrayBuffer(image);
  });
}

export function convertFileToImage(image) {
  // TODO: figure out if we need reject here
  return new Promise(resolve => {
    const img = new Image();
    img.src = URL.createObjectURL(image);
    img.onload = () => resolve(img);
  });
}
