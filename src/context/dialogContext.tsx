import { create } from "zustand";

interface DialogStore {

  element: HTMLDialogElement | null;
  setElement: (def: DialogStore["element"]) => void;

  type: "public" | "user" | "";
  setType : (def: DialogStore["type"]) => void;
  
  otherUserId: number;
  setOtherUserId: (def: DialogStore["otherUserId"]) => void;
  
  shipInfo: {
    pixels?: string[];
    player_id?: number;
    ship_id?: number;
    store_id?: null | number;
    from_other_id?: null | number;
  }  
  setShipInfo: (def: DialogStore["shipInfo"]) => void;
}

export const useDialogContext = create<DialogStore>()((set) => ({
  element: null,
  setElement: (element) => set(() => ({element})),
  type: "",
  setType: (type) => set(() => ({type})),
  otherUserId: 0,
  setOtherUserId: (otherUserId) => set(() => ({otherUserId})),
  shipInfo: {},
  setShipInfo: (shipInfo) => set(() => ({shipInfo})),
}))