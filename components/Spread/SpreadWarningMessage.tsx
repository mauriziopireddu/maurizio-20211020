type Props = {
  children: string;
};

export const SpreadWarningMessage = ({ children }: Props) => {
  return (
    <p className="m-auto text-yellow-800 text-center">
      Spread not available: {children}
    </p>
  );
};
