import { atom, useAtom } from "jotai";

const modalStateAtom = atom(false);

export const useCreateChannelModal = () => {
  return useAtom(modalStateAtom);
};
