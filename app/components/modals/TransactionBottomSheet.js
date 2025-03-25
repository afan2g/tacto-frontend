import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { View, StyleSheet } from "react-native";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { AppText } from "../primitives";
import { useBottomSheetBackHandler } from "../../hooks/useBottomSheetBackHandler";

const TransactionBottomSheet = forwardRef(({ transaction, onDismiss }, ref) => {
  const bottomSheetRef = useRef(null);
  const { handleSheetPositionChange } =
    useBottomSheetBackHandler(bottomSheetRef);
  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => bottomSheetRef.current?.dismiss(),
  }));

  const snapPoints = useMemo(() => ["50%", "90%"], []);

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
      enableDynamicSizing={false}
    >
      <BottomSheetView style={styles.contentContainer}>
        <AppText>{transaction?.amount}</AppText>
        <AppText>{transaction?.hash}</AppText>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
    flex: 1,
    padding: 20,
  },
});

export default TransactionBottomSheet;
