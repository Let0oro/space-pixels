import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useCanvasAttributes } from "../../context/pixelContext";

interface PixelProps {
  icol: number;
  irow: number;
}

const Pixel = memo(({ icol, irow }: PixelProps) => {
  const { setMouseMove, pxArr, size, clr, setPxArr } = useCanvasAttributes(
    ({ bckColor, setMouseMove, pxArr, size, clr, setPxArr }) => ({
      bckColor,
      setMouseMove,
      pxArr,
      size,
      clr,
      setPxArr,
    })
  );
  const [currColor, setCurrColor] = useState<string>(pxArr[irow][icol]);

  const handlePaint = (): void => {
    setMouseMove(true);

    setPixelColor(irow, icol);
    setCurrColor(clr);
  };

  const sizePixel = 320 / size;

  const setPixelColor = (irow: number, icol: number): void => {
    const newPxArr = [...pxArr].map((v, i) =>
      i == irow ? v.map((c, ix) => (ix == icol ? clr : c)) : v
    );
    setPxArr(newPxArr);
  };

  return (
    <div
      className="no-drag"
      onMouseMove={(e) => {
        if (e.buttons) {
          handlePaint();
        } else setMouseMove(false);
      }}
      onClick={handlePaint}
      style={{
        ...styles.pixel,
        backgroundColor: currColor,
        width: sizePixel,
        MozWindowDragging: "no-drag",
      }}
      data-irow={irow}
      data-icol={icol}
    />
  );
});

const styles = {
  pixel: {
    aspectRatio: 1,
    display: "inline-block",
    outline: "1px solid #b836ba88",
  },
};

export default Pixel;
