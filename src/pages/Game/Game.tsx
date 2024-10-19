import React, {
  useReducer,
  useEffect,
  useCallback,
  Suspense,
  lazy,
} from "react";
import { useNavigate } from "react-router-dom";
import { gameReducer, gameInitialState, numSeq } from "../../utils/gameReducer";
import shadowPixel from "../../utils/shadowPixel";
import { useUserContext } from "../../context/userContext";
import { useEnemyMovement } from "../../hooks/useEnemyMovement";
import "./game.css";
import { FrontFetch } from "../../utils/FrontFetch";

const GameGrid = lazy(() => import("../../components/Game/GameGrid"));
const GameOverScreen = lazy(
  () => import("../../components/Game/GameOverScreen")
);
const PauseScreen = lazy(() => import("../../components/Game/PauseScreen"));

const Game: React.FC = () => {
  const { user, setUser, ships, score, setScore } = useUserContext();
  const navigation = useNavigate();
  const [state, dispatch] = useReducer(gameReducer, gameInitialState);

  const sizeRow = 20;
  const sizeCol = 30;
  const initialEnemyPos = [...numSeq(15, 0), ...numSeq(15, 20)];

  const playerShip = shadowPixel(
    ships.find(({ ship_id }) => ship_id === user.active_ship_id)?.pixels || [
      "",
    ],
    2
  );

  const sumPoints = useCallback(async () => {
    await FrontFetch.caller(
      { name: "score", method: "post" },
      { points: state.points }
    );
    if (state.points >= 20)
      setUser({
        ...user,
        coins: (user.coins || 0) + Math.floor(state.points / 20),
      });
  }, [state.playerPos, state.points]);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        dispatch({ type: "MOVE_PLAYER", payload: state.playerPos - 1 });
      } else if (event.key === "ArrowRight") {
        dispatch({ type: "MOVE_PLAYER", payload: state.playerPos + 1 });
      } else if (event.key === "ArrowUp") {
        if (!state.reload) {
          dispatch({ type: "SHOOT" });

          const id = setTimeout(() => {
            dispatch({ type: "RELOAD", payload: false });
            clearInterval(id);
          }, 1000);

          dispatch({ type: "RELOAD", payload: true });
        }
      }
    },
    [state.playerPos, state.reload]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [handleKey]);

  const handleRetry = () => dispatch({ type: "RESET" });
  const handleMain = () => navigation("/usermain", { replace: true });
  const handlePause = () => dispatch({ type: "PAUSE" });

  const handleShootCollision = useCallback(() => {
    state.shootPos.forEach((shootPos) => {
      const enemyHitIndex = state.enemyPos
        .flat()
        .findIndex((enemyPos) => enemyPos === shootPos);

      if (enemyHitIndex !== -1) {
        const updatedEnemyPos = state.enemyPos.map((group) =>
          group.filter((pos) => pos !== shootPos)
        );
        dispatch({ type: "MOVE_ENEMIES", payload: updatedEnemyPos });

        const updatedShootPos = state.shootPos.filter(
          (pos) => pos !== shootPos
        );
        dispatch({ type: "SHOOT_PLAYER", payload: updatedShootPos });

        dispatch({ type: "ADD_POINTS", payload: 1 });
      }
    });

    state.enemyShoot.forEach((enemyShootPos) => {
      if (enemyShootPos === state.playerPos) {
        dispatch({ type: "PLAYER_HIT" });

        const updatedEnemyShoot = state.enemyShoot.filter(
          (pos) => pos !== enemyShootPos
        );
        dispatch({ type: "SHOOT_ENEMIES", payload: updatedEnemyShoot });
      }
    });
  }, [state.shootPos, state.enemyPos, state.enemyShoot, state.playerPos]);

  useEnemyMovement({
    enemyPos: state.enemyPos,
    enemyDir: state.enemyDir,
    shootPos: state.shootPos,
    enemyShoot: state.enemyShoot,
    playerPos: state.playerPos,
    sizeRow,
    initialEnemyPos,
    dispatch,
  });

  useEffect(() => {
    console.log({ scPoints: score.points });
    console.log({ stPoints: state.points });
    if (state.playerPos === -1) {
      setScore({ ...score, points: score.points + state.points });
      sumPoints();
      window.removeEventListener("keydown", handleKey);
    }
  }, [state.points, state.playerPos]);

  if (!state.enemyPos.length || !ships.length) {
    return <div>Loading...</div>;
  }

  if (state.playerPos === -1) {
    return (
      <Suspense fallback={<div>Loading Game Over Screen...</div>}>
        <GameOverScreen onRetry={handleRetry} onMain={handleMain} />
      </Suspense>
    );
  }

  if (state.pause) {
    return (
      <Suspense fallback={<div>Loading Pause Screen...</div>}>
        <PauseScreen
          onResume={() => dispatch({ type: "RESUME" })}
          onMain={handleMain}
        />
      </Suspense>
    );
  }

  return (
    <div>
      <div>Game</div>
      <div>Points: {state.points}</div>
      <button onClick={handlePause}>||</button>

      <Suspense fallback={<div>Loading Grid...</div>}>
        <div
          style={{
            width: sizeRow * 16,
            height: sizeCol * 16,
            display: "flex",
            flexWrap: "wrap",
            margin: "2rem auto",
          }}
          className="grid"
        >
          <GameGrid
            state={state}
            playerShip={playerShip}
            handleShootCollision={handleShootCollision}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default Game;
