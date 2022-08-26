import Footer from "src/shared/components/Footer";
import { PropsWithChildren } from "react";

const CenterLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="h-full">
      <div className="flex items-center justify-center min-h-full w-full">
        {children}
      </div>
      <Footer />
    </div>
  );
};
export default CenterLayout;
