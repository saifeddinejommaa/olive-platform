// src/common/hooks/usePageTitle.ts

import { useEffect } from "react";
import { usePageTitleStore } from "../stores/usePageTittleStore";

export function usePageTitle(title: string | undefined | null, subTitle: string | undefined | null) {
  const setTitle = usePageTitleStore((state) => state.setTitle);

  useEffect(() => {
    setTitle(title ?? null, subTitle?? null);
    return () => setTitle(null, null);
  }, [title, setTitle, subTitle]);
}