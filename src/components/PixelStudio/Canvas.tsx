import Pixel from "./Pixel";
import { useCanvasAttributes } from "../../context/pixelContext";
import { v4 as uuid } from "uuid";

const Canvas = () => {
  const { size } = useCanvasAttributes(({ pxArr, clr, size, setPxArr }) => ({
    pxArr, clr, size, setPxArr
  }));

  // const defaultColor = (irow: number, icol: number): string =>
  // !(irow & 1)
  //   ? icol & 1
  //     ? "white"
  //     : "black"
  //   : !(icol & 1)
  //     ? "white"
  //     : "black";


  return (
    <div
      style={{ ...styles.canvas, width: 320, height: 320, MozWindowDragging: "no-drag" }}
      className="canvas no-drag"
    >
      {Array(size).fill(0).map((_, irow: number) => (
        <div
        className="no-drag"
          key={uuid()}
          style={{ ...styles.row, width: 320, height: 320 / size, MozWindowDragging: "no-drag" }}
        >
          {Array(size)
            .fill(0)
            .map((_, icol: number) => (
              <Pixel key={uuid()} icol={icol} irow={irow} />
            ))}
        </div>
      ))}
    </div>
  );
};

const styles = {
  canvas: {
    // borderRadius: 8,
    padding: 0,
    lineHeight: 0,
    overflow: "hidden",
    margin: "0 auto",
    outline: "1px solid #b836ba",
  },
  row: {
    padding: 0,
  },
};

export default Canvas;
