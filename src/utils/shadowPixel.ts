const shadowPixel = (pixels: string[], ratioScale: number = 1) => {
  const boxShadow = [];
  if (pixels.length == 1) pixels = pixels[0].split(/,\s?/gi);
  const pxLen = pixels.length;
  const origsize = Math.sqrt(pxLen);
  const varS = 32 / origsize / ratioScale;

  for (let i = 0; i < pxLen; i++) {
    const lineShadowRet = [];
    const currRow = pixels[i];
    const ix = i % origsize;
    lineShadowRet.push(
      `${varS * ix}px ${varS * Math.floor(i / origsize)}px 0 ${currRow.replace(/'/gi, "")}`
    );
    boxShadow.push(lineShadowRet.join(", "));
  }
  return boxShadow.join(", ");
};

export default shadowPixel;
