export const getRandomElement = (list) =>
  list[Math.floor(Math.random() * list.length)];

export const removeDuplicates = <T>(list: T[]): T[] => {
  return [...new Set(list)];
};

export const removeItemAll = (arr, value) => {
  let i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
};

export const removeItemOnce = (arr, value: number) => {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
};
