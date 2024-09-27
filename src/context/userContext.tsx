import { create } from "zustand";

type MouseStore = {
  mouseMove: boolean;
  setMouseMove: (def: MouseStore["mouseMove"]) => void;
};

type CanvasAttributes = MouseStore;

export const useCanvasAttributes = create<CanvasAttributes>()((set) => ({
  mouseMove: false,
  setMouseMove: (mouseMove) => set(() => ({mouseMove})),
}));
