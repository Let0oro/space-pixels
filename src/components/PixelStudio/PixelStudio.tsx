import Canvas from "./Canvas";
import { useCanvasAttributes } from "../../context/pixelContext";
import { useMemo, useState } from "react";
import { MuiColorInput } from "mui-color-input";
import { TinyColor } from "@ctrl/tinycolor";
import ShowAvatar from "./ShowAvatar";

const confirmAvatar = () => {};

const PixelStudio = () => {
  const { size, clr, setPxArr, setClr, setSize } = useCanvasAttributes(
    ({ size, clr, setPxArr, setClr, setSize }) => ({
      size,
      clr,
      setPxArr,
      setClr,
      setSize,
    })
  );

  useMemo(() => {
    const tinyClr = new TinyColor(clr);
    if (tinyClr.format != "hex") setClr(tinyClr.toHex8String());
  }, [clr]);

  useMemo(() => {
    setPxArr(Array(size).fill(Array(size).fill("#0000")));
  }, [size]);

  const [currentSize, setCurrentSize] = useState<number>(size);

  return (
    <>
      <h2>Create your hero</h2>
      <label
        style={{...styles.labelNumber, alignItems: "stretch", position: "relative",}}
      >
        <select
          className="number_selector"
          style={styles.numberSelector}
          value={currentSize}
          onChange={(e) => setCurrentSize(Number(e.target.value))}
        >
          <option>32</option>
          <option>16</option>
          <option>8</option>
        </select>
        <button
          style={styles.buttonNumber}
          onClick={() => {
            if (
              currentSize != size &&
              confirm(
                "Are you sure to change the canvas size? This action will clear the current pixel art"
              )
            ) {
              setSize(currentSize);
            }
          }}
        >
          Change size
        </button>
      </label>
      <MuiColorInput
        value={clr}
        onChange={setClr}
        className="color-input"
        style={{
          marginBottom: "1rem",
          border: `1px solid ${clr}`,
          borderRadius: "8px",
          color: clr
        }}
        slotProps={{ htmlInput: { value: clr }}}
        data-clr={clr}
      />
      <Canvas />
      <div style={styles.finalDiv}>
        <ShowAvatar />
        <button onClick={confirmAvatar}>Confirm avatar</button>
      </div>
    </>
  );
};

const styles = {
  numberSelector: {
    borderBottomLeftRadius: "8px",
    borderTopLeftRadius: "8px",
  },
  buttonNumber: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  labelNumber: {
    display: "flex",
    margin: "1rem auto",
    width: "10rem",
  },
  finalDiv: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    gap: "1rem",
    marginTop: "1rem",
  },
};

export default PixelStudio;
