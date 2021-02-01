import {Dispatch, ReactNode, SetStateAction} from "react";
import Modal from "react-modal";

export default function ElModal({isOpen, closeModal, children}: {
    isOpen: boolean,
    closeModal: () => any,
    children: ReactNode,
}) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={{content: {transform: "translateX(-50%)"}}}
            className="fixed top-24 left-1/2 max-w-sm p-4 bg-white shadow-md"
        >
            {children}
        </Modal>
    )
}