import {Dispatch, ReactNode, SetStateAction} from "react";
import Modal from "react-modal";

export default function ElModal({isOpen, setIsOpen, children}: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    children: ReactNode,
}) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            style={{content: {transform: "translateX(-50%)"}}}
            className="fixed top-24 left-1/2 max-w-sm p-4 bg-white shadow-md"
        >
            {children}
        </Modal>
    )
}