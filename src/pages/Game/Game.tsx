import {
  JSXElementConstructor,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import "./game.css";
import { useUserContext } from "../../context/userContext";
import shadowPixel from "../../utils/shadowPixel";

const GRID_SEL = ".grid";
const GRID_CH_SEL = ".gridDiv";
const CLASS_PLAYER = "player_ship";
const CLASS_ENEMY = "enemy_ship";

const numSeq = (length: number, from: number = 0) =>
  Array.from({ length }, (_, i: number) => from + i);

const sel = (selector: string = GRID_CH_SEL) =>
  document.querySelector(selector);

const selAll = (selector: string = GRID_CH_SEL) => [
  ...document.querySelectorAll(selector),
];

const selByPos = (selector: string = GRID_CH_SEL, pos: number) =>
  [...document.querySelectorAll(selector)][pos];

const selChilds = (selector: string = GRID_SEL, childNumber?: number) => {
  const element = sel(selector);
  console.log({ element, selector });
  if (!element || !element?.childElementCount) return [];
  const childs = [...element.children];
  if (childNumber) return childs[childNumber] as HTMLElement;
  return childs as HTMLElement[];
};

const Game = () => {
  const { user, ships, score, setScore } = useUserContext();

  const sizeRow = 20;
  const sizeCol = 30;
  const sizePx = 16;
  const initialShipPos = 510;
  const initialEnemyPos = [...numSeq(15, 0), ...numSeq(15, 20)];
  const playerShip = shadowPixel(
    ships.find(({ ship_id }) => ship_id == user.active_ship_id)?.pixels || [""],
    2
  );

  const [playerPos, setPlayerPos] = useState<number>(initialShipPos);
  const [enemyPos, setEnemyPos] = useState<number[][]>([initialEnemyPos]);
  const [enemyDir, setEnemyDir] = useState<(1 | -1)[]>([1]);

  const createGrid = (): ReactElement<
    HTMLDivElement,
    string | JSXElementConstructor<any>
  >[] => {
    const arrayDivs = [];
    for (let i = 0; i < sizeCol * sizeRow; i++) {
      const isPlayer = i == playerPos ? ` ${CLASS_PLAYER}` : "";
      const isEnemy = enemyPos.flat(1).includes(i) ? ` ${CLASS_ENEMY}` : "";
      if (playerPos == -1 || (isEnemy && isPlayer)) {
        setPlayerPos(-1);
        setEnemyPos([]);

        return [
          <div key={1} style={{ display: "block", textAlign: "center" }}>
            gameOver
          </div>,
        ];
      }
      arrayDivs.push(
        <div
          key={i}
          id={`${i}`}
          className={`gridDiv${isPlayer}${isEnemy}`}
          style={{
            height: sizePx,
            position: "relative",
            overflow: "visible",
            zIndex: isPlayer ? 100 : 0,
          }}
        >
          {isPlayer && (
            <div
              className="player_ship--shadow"
              style={{
                boxShadow: playerShip,
              }}
            ></div>
          )}
        </div>
      );
    }

    return arrayDivs;
  };

  const gameOverScreen = (
    <div
      key={1}
      style={{ display: "block", width: "100%", textAlign: "center" }}
    >
      <h3>Game Over</h3>
      <button
        className="button_retry"
        onClick={() => {
          setPlayerPos(initialShipPos);
          setEnemyPos([initialEnemyPos]);
          setEnemyDir([1]);
        }}
      >
        Play Again?
      </button>
    </div>
  );

  const grid: ReactElement<HTMLDivElement>[] =
    playerPos != -1 ? createGrid() : [gameOverScreen];

  const handleKey = useCallback(({ key: ekey }: { key: string }) => {
    if (!ekey || !["ArrowRight", "ArrowLeft"].includes(ekey)) return;
    const dir = ekey as "ArrowRight" | "ArrowLeft";
    if (dir == "ArrowLeft")
      setPlayerPos((prevPos) => (!(prevPos % sizeRow) ? prevPos : prevPos - 1));
    if (dir == "ArrowRight")
      setPlayerPos((prevPos: number) =>
        !((prevPos + 1) % sizeRow) ? prevPos : prevPos + 1
      );
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, []);

  const movEnemys = () => {
    const needToSpawn = enemyPos.flat(1)[0] > 120;
    const existedGridEnemies = (pos: number) => pos < 600 && pos >= 0;

    const newEnemiespos = enemyPos.map((arrpos, groupEn) => {
      const edgeL = arrpos.some((pos) => !(pos % sizeRow));
      const edgeR = arrpos.some((pos) => !((pos + 1) % sizeRow));

      const newDir: 1 | -1 = (Number(edgeL) * 1 + Number(edgeR) * -1 ||
        enemyDir[groupEn]) as 1 | -1;
      const newEnemyDir = enemyDir;
      newEnemyDir.splice(groupEn, 1, newDir);

      setEnemyDir(newEnemyDir);

      const jumpEdging = Number(edgeL || edgeR) * sizeRow;

      let movedEnemies = arrpos.map((pos) => pos + jumpEdging + newDir);

      if (!movedEnemies.filter(existedGridEnemies).length)
        console.log({
          sum: jumpEdging + newDir,
          jumpEdging,
          newDirDescomposed: {
            edgeL,
            edgeR,
            currentGroup: enemyDir[groupEn],
            completeEnemies: enemyDir,
          },
        });
      if (!movedEnemies.filter(existedGridEnemies).length)
        movedEnemies = movedEnemies.filter(existedGridEnemies);

      if (!movedEnemies.length) {
        const newEnemyDir = enemyDir;
        newEnemyDir.splice(groupEn, 1);
        setEnemyDir(newEnemyDir);
      }

      return movedEnemies;
    });
    if (needToSpawn) newEnemiespos.unshift(initialEnemyPos);
    if (needToSpawn) setEnemyDir([1, ...enemyDir]);

    setEnemyPos(newEnemiespos.filter((enPos) => enPos.length));
  };

  useEffect(() => {
    let id: undefined | number;
    if (playerPos != -1) {
      id = setInterval(() => movEnemys(), 800);
      return () => clearInterval(id);
    }
  }, [enemyPos]);

  return (
    <div>
      <div>Game</div>
      <div
        style={{
          width: sizeRow * sizePx,
          display: "flex",
          flexWrap: "wrap",
          margin: "2rem auto",
        }}
        className="grid"
      >
        {grid}
      </div>
    </div>
  );
};

export default Game;
