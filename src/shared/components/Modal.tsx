import useOutsideClick from "src/shared/hooks/useOutsideClick";
import { PropsWithChildren, useRef } from "react";

const Modal: React.FC<
  PropsWithChildren<{ onOutsideClick?: () => void; fullScreen?: boolean }>
> = ({ children, onOutsideClick, fullScreen = false }) => {
  const ref = useRef(null);
  useOutsideClick(ref, () => onOutsideClick?.());

  return (
    <div
      style={{ margin: 0 }}
      className="z-20 fixed inset-0 bg-[rgba(0,0,0,0.7)] dark:bg-[rgba(0,0,0,0.9)] flex justify-center overflow-y-auto"
    >
      <div className={`h-full p-16 ${fullScreen ? "w-full" : ""}`}>
        <div className={fullScreen ? "h-full w-full" : "h-fit"} ref={ref}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
