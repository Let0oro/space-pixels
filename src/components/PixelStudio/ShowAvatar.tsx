import { useMemo } from "react";
import { useCanvasAttributes } from "../../context/pixelContext";

const ShowAvatar = () => {
  const { pxArr, size, mouseMove } = useCanvasAttributes();
  const varS = 32 / size;

  const boxShadow = useMemo(() => {
    if (!mouseMove) {
        const returned = [];
        const pxLen = pxArr.length;
        for (let i = 0; i < pxLen; i++) {
            const lineShadowRet = [];
            const currRow = pxArr[i];
            const rowLen = currRow.length;
            for (let ix = 0; ix < rowLen; ix++)
                lineShadowRet.push(`${varS * ix}px ${varS * i}px 0 ${currRow[ix]}`);
            returned.push(lineShadowRet.join(", "));
        }
        return returned.join(",");
    }
}, [mouseMove]);

  return (
    <div style={styles.frame}>
      <div
        style={{
          ...styles.avatar,
          height: varS,
          boxShadow,
          backgroundColor: pxArr[0][0],
        }}
      ></div>
    </div>
  );
};

const styles = {
  frame: {
    borderBottom: "1px solid #b836ba",
    width: 32,
    height: 32,
  },
  avatar: {
    aspectRatio: 1,
  },
};

export default ShowAvatar;
