import { useEffect, useState } from "react";

// True when something has been loading for longer than `delay` milliseconds.
// Used to explain that the free server may be waking up.
export default function useSlowLoading(loading, delay = 4000) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!loading) return undefined;
    const timer = setTimeout(() => setSlow(true), delay);
    return () => {
      clearTimeout(timer);
      setSlow(false);
    };
  }, [loading, delay]);

  return loading && slow;
}
