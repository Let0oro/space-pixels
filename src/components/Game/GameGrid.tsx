import React, { useEffect } from "react";
import { GameState } from "../../utils/gameReducer";

interface GridProps {
  state: GameState;
  playerShip: string;
  handleShootCollision: (i?: number) => void;
}

const GameGrid: React.FC<GridProps> = ({
  state,
  playerShip,
  handleShootCollision,
}) => {
  const { shootPos, enemyShoot, playerPos, enemyPos, reload } = state;
  const sizeRow = 20;
  const sizeCol = 30;
  const sizePx = 16;

  useEffect(handleShootCollision, [shootPos, enemyShoot, handleShootCollision]);

  const gridDivs = [];

  for (let i = 0; i < sizeCol * sizeRow; i++) {
    const isPlayer = i === playerPos ? " player_ship" : "";
    const isEnemy = enemyPos.flat(1).includes(i) ? " enemy_ship" : "";
    const isEnemyShoot = enemyShoot.includes(i) ? " enemy_shoot" : "";
    const isShoot = shootPos.includes(i) ? " shoot" : "";

    gridDivs.push(
      <div
        key={i}
        id={`${i}`}
        className={`gridDiv${isPlayer}${isEnemy}${isShoot}${isEnemyShoot}${reload ? " reloading" : ""}`}
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
            style={{ boxShadow: playerShip }}
          ></div>
        )}
      </div>
    );
  }

  return <>{gridDivs}</>;
};

export default GameGrid;
