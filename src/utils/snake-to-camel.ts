export default function snakeToCamel(text: string) {
  return text
    .split('')
    .map((char, index, text) => {
      if (char === '_') {
        return '';
      }
      if (index && text[index - 1] === '_') {
        return char.toUpperCase();
      }
      return char.toLowerCase();
    })
    .join('');
}
