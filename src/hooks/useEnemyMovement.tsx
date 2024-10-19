import { useCallback, useEffect, useState } from "react";

interface UseEnemyMovementProps {
  enemyPos: number[][];
  enemyDir: (1 | -1 | 0)[];
  shootPos: number[];
  enemyShoot: number[];
  playerPos: number;
  sizeRow: number;
  initialEnemyPos: number[];
  dispatch: React.Dispatch<any>;
}

export const useEnemyMovement = ({
  enemyPos,
  enemyDir,
  shootPos,
  enemyShoot,
  playerPos,
  sizeRow,
  initialEnemyPos,
  dispatch,
}: UseEnemyMovementProps) => {
  const [frames, setFrames] = useState(0);

  const movEnemys = useCallback(() => {
    setFrames((prevFrames) => prevFrames + 1);
    const needToSpawn = enemyPos[0][0] > 120;
    const existedGridEnemies = (pos: number) => pos < 600 && pos >= 0;

    let newEnemiesPos = [...enemyPos];
    let newEnemiesDir = [...enemyDir];

    if (needToSpawn) {
      newEnemiesPos.unshift(initialEnemyPos);
      newEnemiesDir.unshift(1);
    }

    newEnemiesPos = [...newEnemiesPos].map((arrpos, groupEn) => {
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
      if (!(frames % 6))
        dispatch({
          type: "SPAWN_ENEMY_SHOOT",
          payload: preparedToAttack.map(
            (shot) => shot + (edgeL || edgeR ? sizeRow : 0)
          ),
        });

      let newDir: 1 | -1 | 0;

      if (edgeL || edgeR) {
        if (newEnemiesDir[groupEn]) {
          newDir = 0;
        } else {
          newDir = (Number(edgeL) * 1 + Number(edgeR) * -1) as 1 | -1;
        }
      } else {
        newDir = newEnemiesDir[groupEn];
      }
      newEnemiesDir.splice(groupEn, 1, newDir);

      const jumpEdging = Number(edgeL || edgeR) * sizeRow;

      let movedEnemies = arrpos.map(
        (pos) => pos + (newDir ? 0 : jumpEdging) + newDir
      );

      movedEnemies = movedEnemies.filter(existedGridEnemies);

      return movedEnemies;
    });

    dispatch({
      type: "MOVE_ENEMIES",
      payload: newEnemiesPos.filter((enPos) => enPos.length),
    });

    dispatch({
      type: "UPDATE_ENEMY_DIR",
      payload: newEnemiesDir,
    });
  }, [frames]);

  const movShoots = useCallback(() => {
    const existedGridShoots = (pos: number) => pos < 600 && pos >= 0;

    let newShootPos = shootPos.map((dir) => dir - sizeRow);
    newShootPos = newShootPos.filter(existedGridShoots);

    dispatch({ type: "SHOOT_PLAYER", payload: newShootPos });

    let newEnShootPos = enemyShoot.map((dir) => dir + sizeRow);
    newEnShootPos = newEnShootPos.filter(existedGridShoots);

    dispatch({ type: "SHOOT_ENEMIES", payload: newEnShootPos });
  }, [shootPos, enemyShoot]);

  useEffect(() => {
    let movEnemysId: undefined | number;
    if (playerPos !== -1) movEnemysId = setInterval(movEnemys, 800);
    return () => clearInterval(movEnemysId);
  }, [movEnemys]);

  useEffect(() => {
    let movShootsId: undefined | number;
    if (playerPos !== -1) movShootsId = setInterval(movShoots, 300);
    return () => clearInterval(movShootsId);
  }, [movShoots]);
};
