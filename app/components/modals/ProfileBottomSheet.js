import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../config";
import { useBottomSheetBackHandler } from "../../hooks/useBottomSheetBackHandler";
import { DataProvider, useAuthContext } from "../../contexts";
import { useModalContext } from "../../contexts";
import ProfileSheetContent from "./ProfileSheetContent";
import { useProfileSheet } from "../../hooks/useProfileSheet";

/**
 * ProfileBottomSheet component
 * @component
 * @property {string} id - Unique identifier for this bottom sheet
 * @property {Function} onDismiss - Callback function to be called when the bottom sheet is dismissed
 * @returns {JSX.Element} - Rendered component
 */
const ProfileBottomSheet = forwardRef(({ id = "profile", onDismiss }, ref) => {
  // Get modal context
  const { registerSheet, unregisterSheet } = useModalContext();
  const { session } = useAuthContext();
  // Internal state
  const [sheetProps, setSheetProps] = useState({});
  const bottomSheetRef = useRef(null);
  const { handleSheetPositionChange } = useBottomSheetBackHandler(
    bottomSheetRef,
    onDismiss
  );
  const insets = useSafeAreaInsets();

  // Use the profile sheet hook to fetch user data
  const {
    loading,
    data,
    presentSheet: presentHookSheet,
    dismissSheet: dismissHookSheet,
    fetchProfileData,
  } = useProfileSheet({
    sessionUserId: session.user.id,
    onSuccess: (data) => console.log("Profile data loaded successfully"),
    onError: (error) => console.error("Error loading profile data:", error),
  });

  // Register this sheet with the context
  useEffect(() => {
    console.log("Registering profile sheet:", id);
    registerSheet(id, {
      present: presentSheet,
      dismiss: dismissSheet,
    });

    return () => {
      unregisterSheet(id);
    };
  }, [id, registerSheet, unregisterSheet]);

  // Present the sheet with user data
  const presentSheet = useCallback(
    (props) => {
      console.log("Presenting profile sheet with props:", props);
      if (props && props.user) {
        setSheetProps(props);

        // Use the hook's presentSheet method with the user
        presentHookSheet(props.user);
      } else {
        console.warn("No user data provided to ProfileBottomSheet");
      }

      bottomSheetRef.current?.present();
    },
    [presentHookSheet]
  );

  // Dismiss the sheet
  const dismissSheet = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    dismissHookSheet();
  }, [dismissHookSheet]);

  // Enhanced ref methods for external control
  useImperativeHandle(ref, () => ({
    present: presentSheet,
    dismiss: dismissSheet,
  }));

  const snapPoints = useMemo(() => [364 + insets.top, "100%"], [insets.top]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetPositionChange}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: colors.lightGray }}
      backgroundStyle={{ backgroundColor: colors.black }}
      containerStyle={{ marginTop: insets.top }}
      enableOverDrag={false}
      enableContentPanningGesture={true}
      activeOffsetY={[-30, 30]}
      style={styles.bottomSheetModal}
      onDismiss={onDismiss}
      enableDynamicSizing={false}
      // Make sure this gets rendered on top of other sheets
      stackBehavior="push"
    >
      <DataProvider>
        <ProfileSheetContent
          user={data?.user}
          friendData={data?.friendData}
          sharedTransactions={data?.sharedTransactions}
          handleClose={handleClose}
          loading={loading}
        />
      </DataProvider>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  bottomSheetModal: {
    borderWidth: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: colors.lightGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ProfileBottomSheet;
