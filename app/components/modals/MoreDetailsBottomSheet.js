import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { View, StyleSheet, Text } from "react-native";
import { useModalContext } from "../../contexts";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useBottomSheetBackHandler } from "../../hooks/useBottomSheetBackHandler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { set } from "zod";
import { colors } from "../../config";

const MoreDetailsBottomSheet = forwardRef(
  ({ id = "moreDetails", onDismiss }, ref) => {
    const [infoText, setInfoText] = useState(null);
    const insets = useSafeAreaInsets();
    const { registerSheet } = useModalContext();
    const moreDetailsRef = useRef(null);
    const { handleSheetPositionChange } = useBottomSheetBackHandler(
      moreDetailsRef,
      onDismiss
    );
    // Register the modal with the context
    useLayoutEffect(() => {
      registerSheet(id, { present: presentSheet, dismiss: dismissSheet });
    }, [id, registerSheet, presentSheet, dismissSheet]);

    const presentSheet = useCallback((data) => {
      setInfoText(data.info);
      console.log("Presenting sheet with data:", data.info);
      moreDetailsRef.current?.present();
    }, []);

    const dismissSheet = useCallback(() => {
      moreDetailsRef.current?.dismiss();
    }, []);

    useImperativeHandle(ref, () => ({
      present: presentSheet,
      dismiss: dismissSheet,
    }));

    const snapPoints = useMemo(() => ["50%"], []);

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
        ref={moreDetailsRef}
        snapPoints={snapPoints}
        onChange={handleSheetPositionChange}
        containerStyle={{ marginTop: insets.top }}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.black }}
      >
        <BottomSheetView style={styles.container}>
          <View style={{ padding: 16 }}>
            <Text>More Details</Text>
            <Text>{infoText}</Text>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MoreDetailsBottomSheet;
