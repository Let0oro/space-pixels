import { Dispatch, SetStateAction, useState } from "react";
import Pixel from "./Pixel";

interface CanvasProps {
  size: number;
  currColor: string;
  canvasColors: Array<Array<string>>;
  setCanvasColors: Dispatch<SetStateAction<Array<Array<string>>>>;
}

const Canvas = ({ size, currColor, canvasColors, setCanvasColors }: CanvasProps) => {
  const setPixelColor = (irow: number, icol: number, clr: string): void => {
    console.log({canvasColors});
    const newCanvasColors: Array<Array<string>> = [...canvasColors];
    newCanvasColors[irow][icol] = currColor;
    console.log({newCanvasColors})
    setCanvasColors(newCanvasColors);
    console.log({canvasColors})
  };

  const defaultColor = (irow: number, icol: number): string =>
    !(irow & 1)
      ? icol & 1
        ? "white"
        : "black"
      : !(icol & 1)
        ? "white"
        : "black";

  return (
    <div
      style={{ ...styles.canvas, width: size * 10, height: size * 10 }}
      className="canvas"
    >
      {Array(size)
        .fill(0)
        .map((_, irow: number) => (
          <div style={{ ...styles.row, width: size * 10 }}>
            {Array(size)
              .fill(0)
              .map((_, icol: number) => (
                <Pixel
                  icol={icol}
                  irow={irow}
                  currColor={currColor}
                  bckColor={defaultColor(irow, icol)}
                  setPixelColor={setPixelColor}
                />
              ))}
          </div>
        ))}
    </div>
  );
};

const styles = {
  canvas: {
    borderRadius: 8,
    padding: 0,
    lineHeight: 0,
    overflow: "hidden",
    margin: "0 auto",
  },
  row: {
    height: 10,
    padding: 0,
  },
};

export default Canvas;
