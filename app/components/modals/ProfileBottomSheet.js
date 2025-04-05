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
import { useData } from "../../contexts";
import ProfileSheetContent from "./ProfileSheetContent";
import ProfileSkeletonLoader from "../skeletons/ProfileSkeletonLoader";

const ProfileBottomSheet = forwardRef(
  (
    {
      user,
      friendData,
      sharedTransactions,
      loading = false, // Rename to make it clear it's external
      onDismiss,
      navigation,
    },
    ref
  ) => {
    // Internal state to manage content
    const bottomSheetRef = useRef(null);
    const { handleSheetPositionChange } = useBottomSheetBackHandler(
      bottomSheetRef,
      onDismiss
    );
    const { profile } = useData();
    const insets = useSafeAreaInsets();

    // Enhanced ref methods - add setLoading to control internal state
    useImperativeHandle(ref, () => ({
      present: () => bottomSheetRef.current?.present(),
      dismiss: () => bottomSheetRef.current?.dismiss(),
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
      >
        <ProfileSheetContent
          user={user}
          friendData={friendData}
          profile={profile}
          sharedTransactions={sharedTransactions}
          handleClose={handleClose}
        />
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
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
  },
  bottomSheetModal: {
    borderWidth: 0,
    backgroundColor: colors.black,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
    padding: 20,
  },
  errorText: {
    color: colors.lightGray,
    fontSize: 16,
    textAlign: "center",
  },
  closeIcon: {
    position: "absolute",
    marginLeft: 12,
    zIndex: 3,
  },
  tabBarContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: "absolute",
    zIndex: 1,
    backgroundColor: colors.black, // Ensure consistent background
    // Remove any borders that might be causing lines
    borderTopWidth: 0,
    borderBottomWidth: 0,
    elevation: 0, // Remove Android elevation shadow
    shadowOpacity: 0, // Remove iOS shadow
  },
  headerContainer: {
    top: 0,
    left: 0,
    right: 0,
    position: "absolute",
    zIndex: 1,
    backgroundColor: colors.black, // Ensure consistent background
    // Remove any borders
    borderBottomWidth: 0,
  },
  collapsedHeaderStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.blackShade40,
    justifyContent: "center",
    zIndex: 2,
    alignItems: "center",
    flexDirection: "row",
    // Remove any borders
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
});

export default ProfileBottomSheet;
