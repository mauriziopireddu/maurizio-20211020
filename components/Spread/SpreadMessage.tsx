type Props = {
  children: string;
};

export const SpreadMessage = ({ children }: Props) => {
  return <p className="m-auto text-secondary text-center">{children}</p>;
};
