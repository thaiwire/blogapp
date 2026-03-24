import { IUser } from "@/interfaces";
import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  setUser: (user: IUser) => set(() => ({ user })),
}));

export interface IUserStore {
    user: IUser | null;
    setUser: (user: IUser) => void;
}

export default useUserStore;

