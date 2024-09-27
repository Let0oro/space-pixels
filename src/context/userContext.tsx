import { create } from "zustand";

type RankStore = {
  rank: string[];
  setRank: (def: RankStore["rank"]) => void;
};

type UserStore = {
  user:   {  
  name?: string;
  email?: string;
  id?: number};
  setUser: (def: UserStore["user"]) => void;
};

type UserContext = RankStore & UserStore;

export const useUserContext = create<UserContext>()((set) => ({
  rank: [],
  setRank: (rank) => set(() => ({rank})),
  user:   {},
    setUser: (user) => set(() => ({user})),
}));
