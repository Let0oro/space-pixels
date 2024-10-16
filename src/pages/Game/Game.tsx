import {
  JSXElementConstructor,
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import "./game.css";
import { useUserContext } from "../../context/userContext";
import shadowPixel from "../../utils/shadowPixel";
import { FrontFetch } from "../../utils/FrontFetch";
import { useNavigate } from "react-router-dom";
import {
  gameReducer,
  init,
  initialEnemyPos,
  initialState,
} from "../../utils/gameReducer";

type GridDiv = ReactElement<
  HTMLDivElement,
  string | JSXElementConstructor<any>
>[];

const GRID_SEL = ".grid";
const GRID_CH_SEL = ".gridDiv";
const CLASS_PLAYER = "player_ship";
const CLASS_ENEMY = "enemy_ship";
const CLASS_SHOOT = "shoot";
const CLASS_ENEMY_SHOOT = "enemy_shoot";
const CLASS_RELOAD = "reloading";
let ix = 0;

const sel = (selector: string = GRID_CH_SEL) =>
  document.querySelector(selector);

const selChilds = (selector: string = GRID_SEL, childNumber?: number) => {
  const element = sel(selector);
  if (!element || !element?.childElementCount) return [];
  const childs = [...element.children];
  if (childNumber) return childs[childNumber] as HTMLElement;
  return childs as HTMLElement[];
};

const Game = () => {
  const { user, ships, score, setScore } = useUserContext();
  const navigation = useNavigate();

  const sizeRow = 20;
  const sizeCol = 30;
  const sizePx = 16;
  const playerShip = shadowPixel(
    ships.find(({ ship_id }) => ship_id == user.active_ship_id)?.pixels || [""],
    2
  );

  const [state, dispatch] = useReducer(gameReducer, initialState, init);

  const createGrid = (): ReactElement<
    HTMLDivElement,
    string | JSXElementConstructor<any>
  >[] => {
    if (playerPos == -1) return [gameOverScreen] as GridDiv;
    if (pause) return [pauseScreen] as GridDiv;

    const arrayDivs = [];
    for (let i = 0; i < sizeCol * sizeRow; i++) {
      const isPlayer = i == playerPos ? ` ${CLASS_PLAYER}` : "";
      const isEnemy = enemyPos.flat(1).includes(i) ? ` ${CLASS_ENEMY}` : "";
      const isEnemyShoot = enemyShoot.includes(i)
        ? ` ${CLASS_ENEMY_SHOOT}`
        : "";
      const isShoot =
        shootPos?.length && shootPos.includes(i) ? ` ${CLASS_SHOOT}` : "";
      if (playerPos == -1 || (isEnemy && isPlayer)) {
        if (playerPos != -1) dispatch({ type: "SET_PLAYER_POS", payload: -1 }); //setPlayerPos(-1);
        return [<div key={601}></div>];
      }
      if (isEnemy && isShoot) {
        const id = setTimeout(() => {
          dispatch({
            type: "SET_SHOOT_POS",
            payload: shootPos.filter((pos) => pos != i),
          });
          // setShootPos((prev) => prev.filter((pos) => pos != i));

          const prevEnNumber = enemyPos.flat(1).length;
          const returned = enemyPos.map((posarr) =>
            posarr.filter((pos) => pos != i)
          );
          if (returned.flat(1).length < prevEnNumber)
            dispatch({ type: "SET_POINTS", payload: points + 0.5 });
          // setPoints((prev) => prev + 0.5);

          dispatch({ type: "SET_ENEMY_POS", payload: returned });
          // setEnemyPos((prev) => {
          // const prevEnNumber = prev.flat(1).length;
          // const returned = prev.map((posarr) =>
          //   posarr.filter((pos) => pos != i)
          // );
          // if (returned.flat(1).length < prevEnNumber)
          //   setPoints((prev) => prev + 0.5);

          //   return returned;
          // });

          clearTimeout(id);
        }, 100);
      }
      if (isPlayer && isEnemyShoot) {
        const id = setTimeout(() => {
          dispatch({
            type: "SET_ENEMY_SHOOT",
            payload: enemyShoot.filter((pos) => pos != i),
          });
          // setEnemyShoot((prev) => prev.filter((pos) => pos != i));
          dispatch({ type: "SET_PLAYER_POS", payload: -1 });
          // setPlayerPos(-1);
          clearTimeout(id);
        }, 100);
      }
      if (isShoot && isEnemyShoot) {
        const id = setTimeout(() => {
          dispatch({
            type: "SET_ENEMY_SHOOT",
            payload: enemyShoot.filter((pos) => pos != i),
          });
          // setEnemyShoot((prev) => prev.filter((pos) => pos != i));
          dispatch({
            type: "SET_SHOOT_POS",
            payload: shootPos.filter((pos) => pos != i),
          });
          // setShootPos((prev) => prev.filter((pos) => pos != i));
          clearTimeout(id);
        }, 100);
      }
      arrayDivs.push(
        <div
          key={i}
          id={`${i}`}
          className={`gridDiv${isPlayer}${isEnemy}${isShoot}${isEnemyShoot}${reload ? " " + CLASS_RELOAD : ""}`}
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
          {isEnemy &&
            enemyPos
              .flat(1)
              .filter((pos, _, arrPos) => arrPos.includes(pos - sizeRow))
              .includes(i) && <div className="enemy_ship-prepare"></div>}
        </div>
      );
    }

    return arrayDivs;
  };

  const {
    playerPos,
    enemyPos,
    shootPos,
    enemyShoot,
    enemyDir,
    pause,
    points,
    reload,
  } = state;

  const gameOverScreen = (
    <div
      key={1}
      style={{ display: "block", width: "100%", textAlign: "center" }}
    >
      <h3>Game Over</h3>
      <button
        className="button_retry"
        onClick={() => {
          init();
          // dispatch({type: "SET_PLAYER_POS", payload: 510})
          // // setPlayerPos(initialShipPos);
          // dispatch({type: "SET_ENEMY_POS", payload: [sinitialEnemyPos]})
          // // setEnemyPos([initialEnemyPos]);
          // dispatch({type: "SET_ENEMY_DIR", payload: [1]})
          // // setEnemyDir([1]);
          // dispatch(se)
          // setShootPos([]);
          // setEnemyShoot([]);
        }}
      >
        Play Again?
      </button>
      <button
        onClick={() => {
          navigation("usermain");
        }}
      >
        Main
      </button>
    </div>
  );

  const pauseScreen = (
    <div
      key={1}
      style={{ display: "block", width: "100%", textAlign: "center" }}
    >
      <h3>Pause</h3>
      <button
        onClick={() => {
          dispatch({ type: "SET_PAUSE", payload: false });
          // setPause(false);
        }}
      >
        Resume
      </button>
      <button
        onClick={() => {
          navigation("usermain");
        }}
      >
        Main (you could lose evvery points of this match)
      </button>
    </div>
  );

  const grid: GridDiv = createGrid();

  const handleKey = useCallback(
    ({ key: ekey }: { key: string }) => {
      if (!ekey || !["ArrowRight", "ArrowLeft", "ArrowUp"].includes(ekey))
        return;

      if (ekey == "ArrowLeft")
        dispatch({
          type: "SET_PLAYER_POS",
          payload: !(playerPos % sizeRow) ? playerPos : playerPos - 1,
        });
      // setPlayerPos((prevPos) =>
      //   !(prevPos % sizeRow) ? prevPos : prevPos - 1
      // );
      if (ekey == "ArrowRight")
        dispatch({
          type: "SET_PLAYER_POS",
          payload: !((playerPos + 1) % sizeRow) ? playerPos : playerPos + 1,
        });
      // setPlayerPos((prevPos: number) =>
      //   !((prevPos + 1) % sizeRow) ? prevPos : prevPos + 1
      // );

      if (ekey == "ArrowUp") {
        if (reload) return;
        if (!reload) {
          const id = setTimeout(() => {
            dispatch({ type: "SET_RELOAD", payload: false });
            // setReload(false);
            clearInterval(id);
          }, 1000);

          dispatch({ type: "SET_RELOAD", payload: true });
          // setReload(true);

          let childs = selChilds();
          if (!Array.isArray(childs)) childs = [childs];
          const currPlayerPos = childs
            .map((el, i) =>
              el.classList.contains(CLASS_PLAYER) ? i : undefined
            )
            .find((pos) => pos);

          if (currPlayerPos)
            dispatch({
              type: "SET_SHOOT_POS",
              payload: shootPos
                ? [...shootPos, currPlayerPos]
                : [currPlayerPos],
            });
          // setShootPos((prev) =>
          //   prev ? [...prev, currPlayerPos] : [currPlayerPos]
          // );
        }
        return;
      }
    },
    [shootPos, reload]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [shootPos, reload]);

  const movEnemys = useCallback(() => {
    ix++;
    const needToSpawn = enemyPos.flat(1)[0] > 120;
    const existedGridEnemies = (pos: number) => pos < 600 && pos >= 0;

    const newEnemiespos = enemyPos.map((arrpos, groupEn) => {
      const edgeL = arrpos.some((pos) => !(pos % sizeRow));
      const edgeR = arrpos.some((pos) => !((pos + 1) % sizeRow));

      let preparedToAttack = arrpos.filter((pos) =>
        arrpos.includes(pos - sizeRow)
      );

      let currentIndex = preparedToAttack.length;

      for (let i = 0; i < currentIndex; i++) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        preparedToAttack[randomIndex] = preparedToAttack[i];
      }

      if (!(ix % 6))
        dispatch({
          type: "SET_ENEMY_SHOOT",
          payload: [...enemyShoot, ...preparedToAttack],
        });
      // if (!(ix % 6)) setEnemyShoot((prev) => [...prev, ...preparedToAttack]);

      let newDir: 1 | -1 | 0;
      if (edgeL || edgeR) {
        if (enemyDir[groupEn]) {
          newDir = 0;
        } else {
          newDir = (Number(edgeL) * 1 + Number(edgeR) * -1) as 1 | -1;
        }
      } else {
        newDir = enemyDir[groupEn];
      }
      const newEnemyDir = enemyDir;
      newEnemyDir.splice(groupEn, 1, newDir);

      dispatch({ type: "SET_ENEMY_DIR", payload: newEnemyDir });
      // setEnemyDir(newEnemyDir);

      const jumpEdging = Number(edgeL || edgeR) * sizeRow;

      let movedEnemies = arrpos.map(
        (pos) => pos + (newDir ? 0 : jumpEdging) + newDir
      );

      if (!movedEnemies.filter(existedGridEnemies).length)
        movedEnemies = movedEnemies.filter(existedGridEnemies);

      if (!movedEnemies.length) {
        const newEnemyDir = enemyDir;
        newEnemyDir.splice(groupEn, 1);
        dispatch({ type: "SET_ENEMY_DIR", payload: newEnemyDir });
        // setEnemyDir(newEnemyDir);
      }

      return movedEnemies;
    });
    if (needToSpawn) {
      newEnemiespos.unshift(initialEnemyPos);
      dispatch({ type: "SET_ENEMY_DIR", payload: [1, ...enemyDir] });
      // setEnemyDir([1, ...enemyDir]);
    }

    dispatch({
      type: "SET_ENEMY_POS",
      payload: newEnemiespos.filter((enPos) => enPos.length),
    });
    // setEnemyPos(newEnemiespos.filter((enPos) => enPos.length));
  }, [enemyPos, enemyDir, shootPos, enemyShoot]);

  const movShoots = useCallback(() => {
    const existedGridShoots = (pos: number) => pos < 600 && pos >= 0;

    let newShootPos = shootPos.map((dir) => dir - sizeRow);
    newShootPos = newShootPos.filter(existedGridShoots);

    dispatch({ type: "SET_SHOOT_POS", payload: newShootPos });
    // setShootPos(newShootPos);

    let newEnShootPos = enemyShoot.map((dir) => dir + sizeRow);
    newEnShootPos = newEnShootPos.filter(existedGridShoots);

    dispatch({ type: "SET_ENEMY_SHOOT", payload: newEnShootPos });
    // setEnemyShoot(newEnShootPos);
  }, [shootPos, enemyShoot]);

  useEffect(() => {
    let movEnemysId: undefined | number;
    if (playerPos != -1) movEnemysId = setInterval(movEnemys, 800);
    return () => clearInterval(movEnemysId);
  }, [enemyPos]);

  useEffect(() => {
    let movShootsId: undefined | number;
    if (playerPos != -1) movShootsId = setInterval(movShoots, 300);
    return () => clearInterval(movShootsId);
  }, [shootPos, enemyShoot]);

  useEffect(() => {
    const sumPoints = async () => {
      await FrontFetch.caller(
        { name: "score", method: "post" },
        { name: score.playername, points }
      );
    };
    if (playerPos == -1) {
      setScore({ ...score, points: score.points + points });
      init();
      // setEnemyPos([]);
      // setShootPos([]);
      // setEnemyShoot([]);
      sumPoints();
    }
  }, [playerPos]);

  return (
    <div>
      <div>Game</div>
      <div>Points: {points}</div>
      <button onClick={() => dispatch({ type: "SET_PAUSE", payload: true })}>
        ||
      </button>
      {/* <button onClick={() => setPause(true)}>||</button> */}
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
