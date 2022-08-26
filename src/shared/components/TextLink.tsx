import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";

const TextLink: React.FC<
  PropsWithChildren & { href?: string; onClick?: () => void }
> = ({ children, href, onClick }) => {
  const linkClass =
    "hover:underline text-base hover:decoration-solid decoration-2 cursor-pointer text-secondary";

  if (href)
    return (
      <Link href={href} onClick={onClick} passHref>
        <a className={linkClass}>{children}</a>
      </Link>
    );
  else
    return (
      <a className={linkClass} onClick={onClick}>
        {children}
      </a>
    );
};

export default TextLink;
