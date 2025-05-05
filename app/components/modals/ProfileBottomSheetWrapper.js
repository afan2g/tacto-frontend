import React, { forwardRef, useRef, useImperativeHandle } from "react";
import { useData } from "../../contexts";
import { useAuthContext } from "../../contexts";
import ProfileBottomSheet from "./ProfileBottomSheet";

const ProfileBottomSheetWrapper = forwardRef(
  ({ id = "profile", onDismiss }, ref) => {
    const { profile, isLoadingData } = useData();
    const { session } = useAuthContext();

    const modalRef = useRef(null);

    // Forward the ref methods to the internal modal ref
    useImperativeHandle(
      ref,
      () => ({
        present: (...args) => modalRef.current?.present(...args),
        dismiss: () => modalRef.current?.dismiss(),
      }),
      [modalRef.current]
    );

    // If still loading or no profile, return a placeholder that won't register with modal system
    if (isLoadingData || !profile || !session) {
      return null;
    }

    // Once profile is available, render the actual component
    return <ProfileBottomSheet id={id} onDismiss={onDismiss} ref={modalRef} />;
  }
);

// Use this in your App.js instead of direct ProfileBottomSheet
export default ProfileBottomSheetWrapper;
