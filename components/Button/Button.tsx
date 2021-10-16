type Props = {
  children: string;
  onClick: () => void;
  className?: string;
};
export const Button = ({ children, onClick, className = "" }: Props) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`bg-cta hover:bg-ctaLight py-1 px-4 rounded m-auto ease-in-out duration-300 text-white ${className}`}
    >
      {children}
    </button>
  );
};
