export const numSeq = (length: number, from: number = 0) =>
  Array.from({ length }, (_, i: number) => from + i);

export const gameInitialState = {
  shootPos: [] as number[],
  enemyShoot: [] as number[],
  playerPos: 510,
  enemyPos: [[...numSeq(15, 0), ...numSeq(15, 20)]],
  enemyDir: [1] as (1 | -1 | 0)[],
  reload: false,
  points: 0,
  pause: false,
};

export type GameState = typeof gameInitialState;

export type GameAction =
  | { type: "MOVE_PLAYER"; payload: number }
  | { type: "SHOOT_PLAYER"; payload: number[] }
  | { type: "SHOOT_ENEMIES"; payload: number[] }
  | { type: "SPAWN_ENEMY_SHOOT"; payload: number[] }
  | { type: "UPDATE_ENEMY_DIR"; payload: (-1 | 0 | 1)[] }
  | { type: "MOVE_ENEMIES"; payload: number[][] }
  | { type: "SHOOT" }
  | { type: "SHOOT" }
  | { type: "PLAYER_HIT" }
  | { type: "RELOAD" }
  | { type: "ADD_POINTS"; payload: number }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESET" };

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case "MOVE_PLAYER":
      return { ...state, playerPos: action.payload };
    case "MOVE_ENEMIES":
      return { ...state, enemyPos: action.payload };
    case "SPAWN_ENEMY_SHOOT":
      return { ...state, enemyShoot: [...state.enemyShoot, ...action.payload] };
    case "UPDATE_ENEMY_DIR":
      return { ...state, enemyDir: action.payload };
    case "SHOOT_PLAYER":
      return { ...state, shootPos: action.payload };
    case "SHOOT":
      return { ...state, shootPos: [...state.shootPos, state.playerPos] };
    case "SHOOT_ENEMIES":
      return { ...state, enemyShoot: action.payload };
    case "PLAYER_HIT":
      return { ...state, playerPos: -1 };
    case "RELOAD":
      return { ...state, reload: true };
    case "ADD_POINTS":
      return { ...state, points: state.points + action.payload };
    case "PAUSE":
      return { ...state, pause: true };
    case "RESUME":
      return { ...state, pause: false };
    case "RESET":
      return gameInitialState;
    default:
      return state;
  }
};
