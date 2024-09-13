import { create } from "zustand";

type MouseStore = {
  mouseMove: boolean;
  setMouseMove: (def: MouseStore["mouseMove"]) => void;
};

type PixelStore = {
  pxArr: Array<Array<string>>;
  setPxArr: (def: PixelStore["pxArr"]) => void;
};

type SizeCanvasStore = {
  size: number;
  setSize: (size: SizeCanvasStore["size"]) => void;
};

type CurrColorStore = {
  clr: string;
  setClr: (clr: CurrColorStore["clr"]) => void;
};

type CanvasAttributes = PixelStore &
  SizeCanvasStore & MouseStore &
  CurrColorStore & { bckColor: string };

export const useCanvasAttributes = create<CanvasAttributes>()((set) => ({
  bckColor: "#0000",
  mouseMove: false,
  setMouseMove: (mouseMove) => set(() => ({mouseMove})),
  pxArr: Array(8).fill(Array(8).fill("#0000")),
  setPxArr: (pxArr) => set(() => ({ pxArr })),
  size: 8,
  setSize: (size) => set(() => ({ size })),
  clr: "#000000",
  setClr: (clr) => set(() => ({ clr })),
}));
