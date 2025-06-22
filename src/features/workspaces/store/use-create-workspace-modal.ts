import { atom, useAtom } from "jotai";

const modalStateAtom = atom(false);

export const useCreateWorkspaceModal = () => {
  return useAtom(modalStateAtom);
};
