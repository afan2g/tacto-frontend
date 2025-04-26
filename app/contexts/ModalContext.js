import React, { createContext, useContext, useState, useRef } from "react";

// Create the context
const ModalContext = createContext(null);

/**
 * Provider component that allows bottom sheets to be stacked and managed
 */
export const ModalProvider = ({ children }) => {
  // Store active modal/sheet references
  const [activeModals, setActiveModals] = useState([]);
  // Store references to registered modal/sheet components
  const modalsRef = useRef({});

  /**
   * Register a modal component with the context
   * @param {string} id - Unique identifier for the modal/sheet
   * @param {Object} ref - Reference to the modal component
   */
  const registerSheet = (id, ref) => {
    console.log(`Registering sheet: ${id}`);
    modalsRef.current[id] = ref;
  };

  /**
   * Unregister a modal component from the context
   * @param {string} id - Unique identifier for the modal/sheet
   */
  const unregisterSheet = (id) => {
    console.log(`Unregistering sheet: ${id}`);
    delete modalsRef.current[id];
  };

  /**
   * Present a modal/sheet
   * @param {string} id - Unique identifier for the modal/sheet
   * @param {Object} props - Props to pass to the modal/sheet
   */
  const presentSheet = (id, props = {}) => {
    console.log(`Presenting sheet: ${id}`, props);
    // Check if the modal is registered
    if (!modalsRef.current[id]) {
      console.warn(`Modal with id "${id}" not found`);
      return;
    }

    // Add the modal to active modals stack if not already active
    if (!activeModals.includes(id)) {
      setActiveModals((prev) => [...prev, id]);
    }

    // Present the modal with props
    modalsRef.current[id].present(props);
  };

  /**
   * Dismiss a modal/sheet
   * @param {string} id - Unique identifier for the modal/sheet
   */
  const dismissSheet = (id) => {
    console.log(`Dismissing sheet: ${id}`);
    // Check if the modal is registered
    if (!modalsRef.current[id]) {
      console.warn(`Modal with id "${id}" not found`);
      return;
    }

    // Dismiss the modal
    modalsRef.current[id].dismiss();

    // Remove the modal from active modals
    setActiveModals((prev) => prev.filter((modalId) => modalId !== id));
  };

  /**
   * Dismiss all active modals/sheets
   */
  const dismissAllSheets = () => {
    console.log(`Dismissing all sheets`);
    // Dismiss each active modal
    activeModals.forEach((id) => {
      if (modalsRef.current[id]) {
        modalsRef.current[id].dismiss();
      }
    });

    // Clear active modals
    setActiveModals([]);
  };

  return (
    <ModalContext.Provider
      value={{
        registerSheet,
        unregisterSheet,
        presentSheet,
        dismissSheet,
        dismissAllSheets,
        activeModals,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

/**
 * @param {Object} children - The children components to be rendered inside the provider.
 * @returns {UseModal} - The ModalProvider component.
 * /
/**
 * @typedef {Object} UseModal
  * @property {Function} registerSheet - Function to register a modal/sheet component.
  * @property {Function} unregisterSheet - Function to unregister a modal/sheet component.
  * @property {Function} presentSheet - Function to present a modal/sheet.
  * @property {Function} dismissSheet - Function to dismiss a modal/sheet.
  * @property {Function} dismissAllSheets - Function to dismiss all active modals/sheets.
  * @property {Array} activeModals - Array of currently active modals/sheets.
  */

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};
