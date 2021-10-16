export const splitBy = <T>(
  list: T[],
  filterCallback: (item: T) => boolean
): [T[], T[]] => {
  const filteredList = list.filter(filterCallback);
  const rest = list.filter((item) => !filterCallback(item));

  return [filteredList, rest];
};
