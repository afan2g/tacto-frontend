const getRandomContrastingColor = (bgColor) => {
  const luminance = (color) => {
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;

    const normalize = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    return (
      0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b)
    );
  };

  let color;
  let contrast;
  const bgLuminance = luminance(bgColor);

  do {
    color = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    contrast = Math.abs(luminance(color) - bgLuminance);
  } while (contrast < 0.5); // Ensure sufficient contrast

  return color;
};

export default getRandomContrastingColor;
