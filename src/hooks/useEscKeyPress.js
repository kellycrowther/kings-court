import { useEffect } from "react";

export default function useEscKeyPress(task) {
  useEffect(() => {
    const handleEscPress = e => {
      if (e.keyCode === 27) {
        task(e);
      }
    };

    document.addEventListener("keydown", handleEscPress, false);
    return () => document.removeEventListener("keydown", handleEscPress, false);
  });
}
