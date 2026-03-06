import { IUser } from "@/interface";
import { create } from "zustand";

const useUsersStore = create((set) => ({
  user: null,
  setUser: (user: IUser) => set(() => ({ user })),
}));

export interface IUsersStore {
  user: IUser | null;
  setUser: (user: IUser) => void;
}

export default useUsersStore;