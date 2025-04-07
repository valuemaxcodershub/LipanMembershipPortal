import { Helmet } from "react-helmet";

export const PageMeta = ({ children }: {children: React.ReactNode}) => {
  return <Helmet>{children}</Helmet>;
};
