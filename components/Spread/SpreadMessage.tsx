type Props = {
  children: string;
  className?: string;
};

export const SpreadMessage = ({ children, className }: Props) => {
  return (
    <p className={`mx-auto text-secondary text-center ${className}`}>
      {children}
    </p>
  );
};
