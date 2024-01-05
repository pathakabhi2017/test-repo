export default function capitalizeFirstLetter(name) {
  return name.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}
