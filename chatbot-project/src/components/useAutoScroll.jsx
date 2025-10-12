import { useRef, useEffect } from "react";

// 自定义 Hook（自动滚动到底）
function useAutoScroll(deps = []) {
  const containerRef = useRef(null);

  useEffect(() => {
    const containerElem = containerRef.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}
export default useAutoScroll;
