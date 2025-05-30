import Canvas from "../components/PixelStudio/Canvas";
import { useCanvasAttributes } from "../context/pixelContext";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MuiColorInput } from "mui-color-input";
import { TinyColor } from "@ctrl/tinycolor";
import ShowAvatar from "../components/PixelStudio/ShowAvatar";
import { FrontFetch } from "../utils/FrontFetch.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext.tsx";

const SizeSelector = () => {
  const { size, setSize } = useCanvasAttributes();

  const [currentSize, setCurrentSize] = useState<number>(size);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "0",
        justifyContent: "center",
      }}
    >
      <select
        className="number_selector"
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
    </div>
  );
};

const ColorInput = () => {
  const { clr, setClr } = useCanvasAttributes();

  useMemo(() => {
    const tinyClr = new TinyColor(clr);
    if (tinyClr.format != "hex8") setClr(tinyClr.toHex8String());
  }, [clr]);

  const clrTransp = useCallback(
    (ifIsTransp: string) =>
      clr.length == 9 && clr.slice(-2) == "00" ? ifIsTransp : clr,
    [clr]
  );

  const clrTranspBlind = useCallback(() => {
    if (clr.length == 9)
      setClr(clr.replace(/.{2}$/, clr.slice(-2) == "00" ? "ff" : "00"));
  }, [clr]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "0",
        justifyContent: "center",
      }}
    >
      <MuiColorInput
        value={clr}
        onChange={setClr}
        className="color-input"
        style={{
          border: `1px solid ${clrTransp("#ffffffff")}`,
          borderColor: clrTransp("#ffffffff"),
          color: clrTransp("#ffffffff"),
        }}
        slotProps={{
          htmlInput: {
            style: { fontFamily: "Tiny5" },
            value: clrTransp("Transparent"),
          },
        }}
      />
      <button onClick={clrTranspBlind}>Eraser</button>
    </div>
  );
};

const PixelStudio = ({
  title = true,
  setNewShip,
}: {
  title?: boolean;
  setNewShip?: Dispatch<SetStateAction<boolean>>;
}) => {
  const { pxArr, size, setPxArr } = useCanvasAttributes();
  const { user } = useUserContext()

  const navigate = useNavigate();
  const { pathname: path } = useLocation();

  const confirmAvatar = async () => {
    const secuence = pxArr.flat(1);
    const response = await FrontFetch.caller(
      { name: "ship", method: "post", typeMethod: "painted" },
      { secuence, player: user }
    );
    if (response) {
      if (path == "/pixel") {
        navigate("/usermain");
      } else {
        setNewShip && setNewShip((bfr) => !bfr);
      }
      setPxArr(Array(size).fill(Array(size).fill("#0000")));
    }
  };

  useEffect(() => {
    if (pxArr.length != size)
      setPxArr(Array(size).fill(Array(size).fill("#0000")));
  }, [size]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {title && <h2>Create your hero</h2>}
      {title && (
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: ".5rem",
            alignItems: "stretch",
            height: "min-content",
            marginBottom: "1rem",
          }}
        >
          <SizeSelector />
          <ColorInput />
        </label>
      )}
      <Canvas />
      {title || <ColorInput />}
      {title || <SizeSelector />}
      <div style={styles.finalDiv}>
        <ShowAvatar />
        <button onClick={confirmAvatar}>Confirm avatar</button>
      </div>
    </div>
  );
};

const styles = {
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
