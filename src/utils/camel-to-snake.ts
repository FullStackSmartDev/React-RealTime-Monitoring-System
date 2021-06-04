export default function camelToSnake(text: string) {
  const isUpperCased = (char: string) => char.toUpperCase() === char && char.toLowerCase() !== char;
  return text
    .split('')
    .reduce(
      (array, char) => {
        if (isUpperCased(char)) {
          return [...array, '_', char.toLowerCase()];
        }
        return [...array, char];
      },
      [] as string[],
    )
    .join('');
}
