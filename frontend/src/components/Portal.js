import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // 直接渲染到body，不需要等待状态更新
  return createPortal(children, document.body);
};

export default Portal; 