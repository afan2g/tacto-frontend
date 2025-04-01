import React, { createContext, useContext, useState } from "react";

export interface UserModal {
    name: 'user-profile',
}

export type Modal = | UserModal ;
const ModalContext = createContext<{
    isModalOpen: boolean;
    activeModals: Modal[];
}>({
    isModalOpen: false,
    activeModals: [],
})

const ModalControllerContext = createContext<{
    openModal: (modal: Modal) => void;
    closeModal: () => boolean;
    closeAllModals: () => boolean;
}>({
    openModal: () => {},
    closeModal: () => false,
    closeAllModals: () => false,
})

export function ModalProvider({ children }: React.PropsWithChildren<{}>) {
    const [activeModals, setActiveModals] = useState<Modal[]>([]);
    const isModalOpen = activeModals.length > 0;

    const openModal = (modal: Modal) => {
        setActiveModals((prev) => [...prev, modal]);
    };

    const closeModal = () => {
        if (activeModals.length === 0) return false;
        setActiveModals((prev) => prev.slice(0, -1));
        return true;
    };

    const closeAllModals = () => {
        if (activeModals.length === 0) return false;
        setActiveModals([]);
        return true;
    };

    const state = React.useMemo(
        () => ({
          isModalOpen: activeModals.length > 0,
          activeModals,
        }),
        [activeModals],
      )
    
      const methods = React.useMemo(
        () => ({
          openModal,
          closeModal,
          closeAllModals,
        }),
        [openModal, closeModal, closeAllModals],
      )
    

    return (
        <ModalContext.Provider value={state}>
            <ModalControllerContext.Provider value={methods}>
                {children}
            </ModalControllerContext.Provider>
        </ModalContext.Provider>
    );
}

export const useModal = () => useContext(ModalContext);
export const useModalController = () => useContext(ModalControllerContext);