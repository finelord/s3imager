export function moveItemInArray(arr, fromIndex, toIndex) {
  const element = arr[fromIndex];
  const arrCopy = [...arr];
  arrCopy.splice(fromIndex, 1);
  arrCopy.splice(toIndex, 0, element);
  return arrCopy;
}
