import { useAuth } from "src/modules/auth/auth.context";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

const AdminContainer: React.FC<
  PropsWithChildren &
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ children, ...props }) => {
  const { user } = useAuth();
  if (!user?.isAdmin) {
    return null;
  }
  return <div {...props}>{children}</div>;
};

export default AdminContainer;
