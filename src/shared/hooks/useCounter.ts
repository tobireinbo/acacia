import { useState, useEffect } from "react";

export default function useCounter(
  initialCount: number,
  stop: boolean,
  interval: number = 1000
) {
  const [counter, setCounter] = useState<number>(initialCount);
  useEffect(() => {
    let _interval = setInterval(() => {
      if (!stop) {
        setCounter((state) => state + 1);
      } else {
        clearInterval(_interval);
      }
    }, interval);
    return () => {
      setCounter(initialCount);
      clearInterval(_interval);
    };
  }, [stop]);

  useEffect(() => {
    setCounter(initialCount);
  }, [initialCount]);

  return counter;
}
