interface State {
  shootPos: number[];
  enemyShoot: number[];
  playerPos: number;
  enemyPos: number[][];
  enemyDir: (1 | -1 | 0)[];
  reload: boolean;
  points: number;
  pause: boolean;
}

type Action =
  | { type: "SET_SHOOT_POS"; payload: number[] }
  | { type: "SET_ENEMY_SHOOT"; payload: number[] }
  | { type: "SET_PLAYER_POS"; payload: number }
  | { type: "SET_ENEMY_POS"; payload: number[][] }
  | { type: "SET_ENEMY_DIR"; payload: (1 | -1 | 0)[] }
  | { type: "SET_RELOAD"; payload: boolean }
  | { type: "SET_POINTS"; payload: number }
  | { type: "SET_PAUSE"; payload: boolean };

const numSeq = (length: number, from: number = 0) =>
  Array.from({ length }, (_, i: number) => from + i);

export const initialShipPos = 510;
export const initialEnemyPos = [...numSeq(15, 0), ...numSeq(15, 20)];

export const initialState: State = {
  shootPos: [],
  enemyShoot: [],
  playerPos: initialShipPos,
  enemyPos: [initialEnemyPos],
  enemyDir: [1],
  reload: false,
  points: 0,
  pause: false,
};

export const init = () => initialState;

export const gameReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_SHOOT_POS":
      return { ...state, shootPos: action.payload };
    case "SET_ENEMY_SHOOT":
      return { ...state, enemyShoot: action.payload };
    case "SET_PLAYER_POS":
      return { ...state, playerPos: action.payload };
    case "SET_ENEMY_POS":
      return { ...state, enemyPos: action.payload };
    case "SET_ENEMY_DIR":
      return { ...state, enemyDir: action.payload };
    case "SET_RELOAD":
      return { ...state, reload: action.payload };
    case "SET_POINTS":
      return { ...state, points: action.payload };
    case "SET_PAUSE":
      return { ...state, pause: action.payload };
    default:
      return state;
  }
};
