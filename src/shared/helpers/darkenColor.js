export function darkenColor(rgbColor, steps) {
    // Parse the input RGB color
    const rgbValues = rgbColor.match(/\d+/g).map(Number);

    const colors = [];
    const darkenFactor = 30; // How much to darken each step

    for (let i = 0; i < steps; i++) {
      const newR = Math.max(rgbValues[0] - i * darkenFactor, 0);
      const newG = Math.max(rgbValues[1] - i * darkenFactor, 0);
      const newB = Math.max(rgbValues[2] - i * darkenFactor, 0);

      const newColor = `rgb(${newR}, ${newG}, ${newB})`;
      colors.push(newColor);
    }

    return colors; // Zwracamy tablicę kolorów
  }
