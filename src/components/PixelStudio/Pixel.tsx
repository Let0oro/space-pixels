import { Dispatch, SetStateAction, useState } from "react";

interface PixelProps {
  icol: number;
  irow: number;
  bckColor: string;
  currColor?: string;
  setPixelColor: (irow: number, icol: number, clr: string) => void;
}

const Pixel = ({
  icol,
  irow,
  bckColor,
  currColor,
  setPixelColor,
}: PixelProps) => {

  const handlePaint = (): void => {
    setpxlClr(currColor!);
    setPixelColor(irow, icol, currColor!);
  };

  const [pxlClr, setpxlClr]: [string, Dispatch<SetStateAction<string>>] =
    useState(bckColor);

  return (
    <div
      onMouseMove={(e) => {
        if (e.buttons) handlePaint();
      }}
      onClick={handlePaint}
      style={{ ...styles.pixel, backgroundColor: pxlClr }}
      aria-data-irow={irow}
      aria-data-icol={icol}
    />
  );
};

const styles = {
  pixel: {
    height: 10,
    width: 10,
    display: "inline-block",
  },
};

export default Pixel;
