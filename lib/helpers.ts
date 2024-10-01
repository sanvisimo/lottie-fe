export function RGBAToHexA(rgba: Array<number>) {
  const start = [...rgba];
  for (const R in rgba) {
    start[R] = Math.round(rgba[R] * 255);
  }

  let r = start[0].toString(16),
    g = start[1].toString(16),
    b = start[2].toString(16),
    a = Math.round(start[3] * 255).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;
  if (a.length == 1) a = "0" + a;

  return "#" + r + g + b;
}

export function hexToRGB(h: string) {
  let r = "",
    g = "",
    b = "";

  // 3 digits
  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return [Number(r) / 255, Number(g) / 255, Number(b) / 255, 1];
}
