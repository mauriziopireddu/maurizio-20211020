import { Button } from "components/Button";
import { Overlay } from "./Overlay";

type Props = {
  onClick: () => unknown;
};

export const Modal = ({ onClick }: Props) => {
  return (
    <Overlay>
      <dialog
        open
        className="flex flex-col px-8 py-9 bg-gray-800 shadow-md rounded-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex flex-col ml-3">
              <div className="font-medium leading-none text-gray-100 mb-1">
                Feed disconnected
              </div>
              <p className="text-sm text-gray-500 leading-none mt-1">
                You have been disconnected
              </p>
            </div>
          </div>
          <Button className="ml-6 flex" onClick={onClick}>
            Reconnect
          </Button>
        </div>
      </dialog>
    </Overlay>
  );
};
