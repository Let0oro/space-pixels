// hooks/useEnemyMovement.tsx
import { useCallback, useEffect } from "react";

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
  let ix = 0;

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

      if (!(ix % 6)) {
        dispatch({ type: "ENEMY_SHOOT", payload: preparedToAttack });
      }

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

      const newEnemyDir = [...enemyDir];
      newEnemyDir.splice(groupEn, 1, newDir);
      dispatch({ type: "UPDATE_ENEMY_DIR", payload: newEnemyDir });

      const jumpEdging = Number(edgeL || edgeR) * sizeRow;
      let movedEnemies = arrpos.map(
        (pos) => pos + (newDir ? 0 : jumpEdging) + newDir
      );

      if (!movedEnemies.filter(existedGridEnemies).length) {
        movedEnemies = movedEnemies.filter(existedGridEnemies);
      }

      if (!movedEnemies.length) {
        const newEnemyDir = [...enemyDir];
        newEnemyDir.splice(groupEn, 1);
        dispatch({ type: "UPDATE_ENEMY_DIR", payload: newEnemyDir });
      }

      return movedEnemies;
    });

    if (needToSpawn) {
      newEnemiespos.unshift(initialEnemyPos);
      dispatch({ type: "SPAWN_ENEMIES", payload: newEnemiespos });
    }

    dispatch({
      type: "MOVE_ENEMIES",
      payload: newEnemiespos.filter((enPos) => enPos.length),
    });
  }, [enemyPos, enemyDir, sizeRow, initialEnemyPos, dispatch]);

  const movShoots = useCallback(() => {
    const existedGridShoots = (pos: number) => pos < 600 && pos >= 0;

    let newShootPos = shootPos.map((dir) => dir - sizeRow);
    newShootPos = newShootPos.filter(existedGridShoots);

    dispatch({ type: "UPDATE_SHOOT_POS", payload: newShootPos });

    let newEnShootPos = enemyShoot.map((dir) => dir + sizeRow);
    newEnShootPos = newEnShootPos.filter(existedGridShoots);

    dispatch({ type: "UPDATE_ENEMY_SHOOT_POS", payload: newEnShootPos });
  }, [shootPos, enemyShoot, sizeRow, dispatch]);

  useEffect(() => {
    let movEnemysId: undefined | number;
    if (playerPos !== -1) movEnemysId = setInterval(movEnemys, 800);
    return () => clearInterval(movEnemysId);
  }, [movEnemys, playerPos]);

  useEffect(() => {
    let movShootsId: undefined | number;
    if (playerPos !== -1) movShootsId = setInterval(movShoots, 300);
    return () => clearInterval(movShootsId);
  }, [movShoots, playerPos]);
};
