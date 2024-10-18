// Game.tsx
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
import { useEnemyMovement } from "../../hooks/useEnemyMovement"; // Import the custom hook
import "./game.css"; // Ensure styles are loaded

const GameGrid = lazy(() => import("../../components/Game/GameGrid"));
const GameOverScreen = lazy(
  () => import("../../components/Game/GameOverScreen")
);
const PauseScreen = lazy(() => import("../../components/Game/PauseScreen"));

const Game: React.FC = () => {
  const { user, ships, score, setScore } = useUserContext();
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

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        dispatch({ type: "MOVE_PLAYER", payload: state.playerPos - 1 });
      } else if (event.key === "ArrowRight") {
        dispatch({ type: "MOVE_PLAYER", payload: state.playerPos + 1 });
      } else if (event.key === "ArrowUp") {
        if (!state.reload) {
          dispatch({ type: "SHOOT" });
          dispatch({ type: "RELOAD" });
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
    // Comprobación de disparos del jugador que impactan en los enemigos
    state.shootPos.forEach((shootPos) => {
      const enemyHitIndex = state.enemyPos
        .flat()
        .findIndex((enemyPos) => enemyPos === shootPos);

      if (enemyHitIndex !== -1) {
        // Eliminar enemigo y disparo
        const updatedEnemyPos = state.enemyPos.map((group) =>
          group.filter((pos) => pos !== shootPos)
        );
        dispatch({ type: "MOVE_ENEMIES", payload: updatedEnemyPos });

        // Eliminar disparo del jugador
        const updatedShootPos = state.shootPos.filter(
          (pos) => pos !== shootPos
        );
        dispatch({ type: "SHOOT_PLAYER", payload: updatedShootPos });

        // Aumentar la puntuación del jugador
        dispatch({ type: "ADD_POINTS", payload: 1 });
      }
    });

    // Comprobación de disparos enemigos que impactan en el jugador
    state.enemyShoot.forEach((enemyShootPos) => {
      if (enemyShootPos === state.playerPos) {
        // Golpe al jugador
        dispatch({ type: "PLAYER_HIT" });

        // Eliminar el disparo enemigo
        const updatedEnemyShoot = state.enemyShoot.filter(
          (pos) => pos !== enemyShootPos
        );
        dispatch({ type: "SHOOT_ENEMIES", payload: updatedEnemyShoot });

        // Opcionalmente, finalizar el juego o reducir vida del jugador
      }
    });
  }, [
    state.shootPos,
    state.enemyPos,
    state.enemyShoot,
    state.playerPos,
    dispatch,
  ]);

  // Use the custom hook for enemy movement and shooting logic
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

  useEffect(() => {
    console.log({ enemyPos: state.enemyPos });
  }, [state.enemyPos]);

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
            handleShootCollision={() => {
              handleShootCollision;
            }}
          />
        </div>
      </Suspense>
    </div>
  );
};

export default Game;
