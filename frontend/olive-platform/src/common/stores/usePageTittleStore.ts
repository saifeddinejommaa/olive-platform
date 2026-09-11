import { create } from "zustand";

interface PageTitleStoreState {
    title: string | null;
    subTitle: string | null;
    setTitle: (title: string | null, subTitle: string | null) => void;
}

export const usePageTitleStore = create<PageTitleStoreState>((set) => ({
    title: null,
    subTitle: null,
    setTitle: (title, subTitle) => {
        set({ title });
        set({ subTitle });
    },
}));