import React, { useEffect } from "react";
import { useData } from "../../contexts";
import { useModalContext } from "../../contexts";
const ModalRegistryUpdater = () => {
  const { profile, isLoadingData } = useData();
  const { unregisterSheet, registerSheet, activeModals } = useModalContext();

  console.log("UPDATING MODALS: ModalRegistryUpdater mounted");
  console.log("UPDATING MODALS: Profile:", profile);
  useEffect(() => {
    console.log("UPDATING MODALS: Profile changed:", profile);
    if (profile && !isLoadingData) {
      // Force re-register bottom sheets with latest context
      console.log(
        "UPDATING MODALS: Re-registering modals after profile loaded"
      );
      unregisterSheet("profile");

      // Wait a tick to ensure unregister completes
      setTimeout(() => {
        const modalRef = activeModals.find((id) => id === "profile");
        if (modalRef && modalRef.present && modalRef.dismiss) {
          registerSheet("profile", {
            present: modalRef.present,
            dismiss: modalRef.dismiss,
          });
        }
      }, 0);
    }
  }, [profile, isLoadingData]);

  return null; // This component doesn't render anything
};

// Add this component to your App.js inside the DataProvider
export default ModalRegistryUpdater;
