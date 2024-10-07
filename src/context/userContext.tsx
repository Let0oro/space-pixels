import { create } from "zustand";

type RankStore = {
  rank: { points: number; playername: string }[];
  setRank: (def: RankStore["rank"]) => void;
};

type ShipStore = {
  ships: {
    pixels: string[];
    player_id: number;
    ship_id: number;
    store_id?: number | null;
    from_other_id?: null | number;
  }[];
  setShips: (def: ShipStore["ships"]) => void;
};

type LikeStore = {
  likes: {
    player_id: number;
    id: number;
    ship_id: number;
    store_id: null | number;
  }[];
  setLikes: (def: LikeStore["likes"]) => void;
};

type UserStore = {
  user: {
    name?: string;
    email?: string;
    active_ship_id?: number | null;
    coins?: number;
    id?: number;
    following_id?: number[] | null;
  };
  setUser: (def: UserStore["user"]) => void;
};

type UserContext = RankStore & ShipStore & LikeStore & UserStore;

export const useUserContext = create<UserContext>()((set) => ({
  rank: [],
  setRank: (rank) => set(() => ({ rank })),
  ships: [],
  setShips: (ships) => set(() => ({ ships })),
  likes: [],
  setLikes: (likes) => set(() => ({ likes })),
  user: {},
  setUser: (user) => set(() => ({ user })),
}));
