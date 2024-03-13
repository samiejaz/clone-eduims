import { useEffect } from "react";

const useKeyCombination = (callback, keyCombination) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === keyCombination) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback, keyCombination]);
};

export default useKeyCombination;
