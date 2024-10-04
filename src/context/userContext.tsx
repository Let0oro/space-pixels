import { create } from "zustand";

type RankStore = {
  rank: {points: number, playername: string}[];
  setRank: (def: RankStore["rank"]) => void;
};

type ShipStore = {
  ships: {pixels: string[], player_id: number, ship_id: number, store_id?: number | null}[];
  setShips: (def: ShipStore["ships"]) => void;
};

type UserStore = {
  user:   {  
  name?: string;
  email?: string;
  active_ship_id?: number | null,
  coins?: number,
  id?: number, 
  };
  setUser: (def: UserStore["user"]) => void;
};

type UserContext = RankStore & ShipStore & UserStore;

export const useUserContext = create<UserContext>()((set) => ({
  rank: [],
  setRank: (rank) => set(() => ({rank})),
  ships: [],
  setShips: (ships) => set(() => ({ships})),
  user:   {},
    setUser: (user) => set(() => ({user})),
}));
