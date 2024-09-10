import { Dispatch, SetStateAction, useState } from "react";
import Canvas from "./Canvas";

const confirmAvatar = () => {};

const PixelStudio = () => {
  const [size, setSize]: [number, Dispatch<SetStateAction<number>>] =
    useState(32);
  const [currColor, setCurrColor]: [string, Dispatch<SetStateAction<string>>] =
    useState("");
  const [currSize, setCurrSize]: [number, Dispatch<SetStateAction<number>>] =
    useState(size);

  const defaultCanvas = Array(size).fill(Array(size).fill("#0000"));

  const [canvasColors, setCanvasColors]: [
    Array<Array<string>>,
    Dispatch<SetStateAction<Array<Array<string>>>>,
  ] = useState(defaultCanvas);

  return (
    <>
      <h2>Create your hero</h2>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "1rem auto",
          gap: ".5rem",
          width: "10rem",
        }}
      >
        <input
          style={styles.numberInput}
          type="number"
          defaultValue={32}
          max={32}
          min={0}
          value={currSize}
          onChange={(e) => setCurrSize(Number(e.target.value))}
        />
        <button
          onClick={() => {
            if (
              confirm(
                "Are you sure to change the canvas size? This action will clear the current pixel art"
              )
            ) {
              setSize(currSize);
            }
          }}
        >
          Change size
        </button>
      </label>
      <label style={styles.labelColor}>
        <input
          type="color"
          onChange={(e) => setCurrColor(e.target.value)}
          value={currColor}
        />
        <span>
          {" "}
          {"->"} {currColor || "#000"}
        </span>
      </label>
      <Canvas
        size={size}
        currColor={currColor}
        canvasColors={canvasColors}
        setCanvasColors={setCanvasColors}
      />
      <button onClick={confirmAvatar}>Confirm avatar</button>
    </>
  );
};

const styles = {
  labelColor: {
    display: "block",
    marginBottom: "1rem",
  },
  numberInput: {
    width: "3rem",
    marginBottom: "1rem",
  },
  labelNumber: {
    display: "flex",
    flexDirection: "column",
    gap: ".5rem",
    width: "10rem",
    marginBottom: "1rem",
  },
};

export default PixelStudio;
