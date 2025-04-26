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
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../config";
import { useBottomSheetBackHandler } from "../../hooks/useBottomSheetBackHandler";
import { DataProvider, useAuthContext, useModalContext } from "../../contexts";
import { useProfileSheet } from "../../hooks/useProfileSheet";
import ProfileSheetContent from "./ProfileSheetContent";
import { OtherUserHeader } from "../cards";

const ProfileBottomSheet = forwardRef(({ id = "profile", onDismiss }, ref) => {
  /* ---------- hooks ---------- */
  const {
    registerSheet,
    unregisterSheet,
    dismissSheet: ctxDismissSheet,
    dismissAllSheets,
  } = useModalContext();
  const { session } = useAuthContext();
  const bottomSheetRef = useRef(null);
  const { handleSheetPositionChange } = useBottomSheetBackHandler(
    bottomSheetRef,
    onDismiss
  );
  const insets = useSafeAreaInsets();

  /* ---------- data ---------- */
  const {
    loading,
    data,
    presentSheet: presentHookSheet,
    dismissSheet: dismissHookSheet,
  } = useProfileSheet({
    sessionUserId: session?.user?.id,
  });

  const [rootNavigation, setRootNavigation] = useState(null);

  /* ---------- raw dismiss (no context) ---------- */
  const rawDismiss = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    dismissHookSheet(); // clear query-state
  }, [dismissHookSheet]);

  /* ---------- registration ---------- */
  useEffect(() => {
    registerSheet(id, { present: presentSheet, dismiss: rawDismiss });
  }, [id, registerSheet, unregisterSheet, rawDismiss]);

  /* ---------- present ---------- */
  const presentSheet = useCallback(
    (props) => {
      if (props?.user) {
        if (props.navigation) setRootNavigation(props.navigation);
        presentHookSheet(props.user);
        bottomSheetRef.current?.present();
      } else {
        console.warn("No user provided to ProfileBottomSheet");
      }
    },
    [presentHookSheet]
  );

  /* ---------- public dismiss (through context) ---------- */
  const dismiss = useCallback(() => {
    dismissAllSheets();
  }, [dismissAllSheets]);

  /* expose to parent refs */
  useImperativeHandle(ref, () => ({ present: presentSheet, dismiss }), [
    presentSheet,
    dismiss,
  ]);

  /* ---------- misc render helpers ---------- */
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
      enableContentPanningGesture
      activeOffsetY={[-30, 30]}
      style={styles.bottomSheetModal}
      onDismiss={onDismiss}
      enableDynamicSizing={false}
      stackBehavior="push"
    >
      <DataProvider>
        {data?.friendData || data?.user?.external ? (
          <ProfileSheetContent
            user={data?.user}
            friendData={data?.friendData}
            sharedTransactions={data?.sharedTransactions}
            handleClose={dismiss}
            loading={loading}
            rootNavigation={rootNavigation}
          />
        ) : (
          <BottomSheetView style={styles.bottomSheetContainer}>
            <OtherUserHeader
              user={data?.user}
              friendData={null}
              sharedTransactions={null}
              handleClose={dismiss}
              style={styles.header}
            />
          </BottomSheetView>
        )}
      </DataProvider>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  bottomSheetModal: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: colors.black,
    shadowColor: colors.lightGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    paddingTop: 0,
    paddingBottom: 20,
    backgroundColor: colors.black,
    // Remove any potential border
    borderWidth: 0,
  },
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: colors.black, // Ensure this matches the modal background
    marginTop: -1,
    paddingTop: -1,
  },
});

export default ProfileBottomSheet;
