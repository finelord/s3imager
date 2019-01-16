import generate from 'nanoid/generate';

const GROUP_ID_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const GROUP_ID_LENGTH = 32;

const ID_DELIMITER = '-';
const CONFIG_DELIMITER = '-';
const DIMENSIONS_DELIMITER = 'x';

export function generateGroupId() {
  return generate(GROUP_ID_ALPHABET, GROUP_ID_LENGTH);
}

export function generateImageId(groupId, configId, width, height) {
  const dimensions = `${width}${DIMENSIONS_DELIMITER}${height}`;
  return `${groupId}${ID_DELIMITER}${configId}${CONFIG_DELIMITER}${dimensions}`;
}

export function parseImageId(imageId) {
  if (!imageId) return;

  const [groupId, configId, dimensions] = imageId.split(ID_DELIMITER);
  if (!groupId || !configId || !dimensions) return;
  if (groupId.length !== GROUP_ID_LENGTH) return;

  let [width, height] = dimensions.split(DIMENSIONS_DELIMITER);
  if (!width || !height) return;

  width = Number(width);
  height = Number(height);
  if (!width || !height) return;

  return { groupId, configId, width, height };
}
