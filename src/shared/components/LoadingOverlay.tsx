import LoadingSpinner from "src/shared/components/LoadingSpinner";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

type LoadingOverlayProps = {
  loading: boolean;
};

const LoadingOverlay: React.FC<
  PropsWithChildren &
    LoadingOverlayProps &
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, loading, className, ...props }) => {
  return (
    <div {...props} className={`relative ${className}`}>
      {loading && (
        <div className="border-0 absolute inset-0 flex items-center justify-center z-10 bg-white dark:bg-stone-900 opacity-70">
          <LoadingSpinner />
        </div>
      )}
      {children}
    </div>
  );
};

export default LoadingOverlay;
