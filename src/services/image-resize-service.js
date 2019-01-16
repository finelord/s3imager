import Pica from 'pica';
import { convertFileToImage } from './data-converter-service';

const pica = Pica();

// TODO: utilize options
export const resizeImage = (image, options = {}) => {
  return new Promise((resolve, reject) => {
    convertFileToImage(image).then(img => {
      let { dimension, value } = options;
      if (!dimension || !value) {
        return reject(); // TODO: add reject reason
      }

      let height, width;

      switch (dimension) {
        case 'min':
          dimension = img.height < img.width ? 'height' : 'width';
          break;
        case 'max':
          dimension = img.height > img.width ? 'height' : 'width';
          break;
      }

      switch (dimension) {
        case 'height':
          height = value;
          width = Math.round((img.width * height) / img.height);
          break;
        case 'width':
          width = value;
          height = Math.round((img.height * width) / img.width);
          break;
        default:
          return reject(); // TODO: add reject reason
      }

      const offScreenCanvas = document.createElement('canvas');
      offScreenCanvas.height = height;
      offScreenCanvas.width = width;

      pica
        .resize(img, offScreenCanvas, {
          quality: 3,
          unsharpAmount: 75,
          unsharpRadius: 0.75,
          unsharpThreshold: 2,
          transferable: true
        })
        .then(async () => {
          const blob = await pica.toBlob(offScreenCanvas, 'image/jpeg');
          const meta = {
            height,
            width,
            dimension
          };
          resolve([blob, meta]);
        });
    });
  });
};
