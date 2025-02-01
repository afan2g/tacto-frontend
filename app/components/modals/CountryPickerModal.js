import React, {
  useState,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetFlashList,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { sortedCountries } from "../../../lib/countryData";
import { useBottomSheetBackHandler } from "../../hooks/useBottomSheetBackHandler";

const CountryPickerModal = forwardRef(({ onSelectCountry, onDismiss }, ref) => {
  const bottomSheetRef = useRef(null);
  const [search, setSearch] = useState("");
  const { handleSheetPositionChange } =
    useBottomSheetBackHandler(bottomSheetRef);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    present: () => bottomSheetRef.current?.present(),
    dismiss: () => {
      bottomSheetRef.current?.dismiss();
      setSearch(""); // Clear search when dismissing
      onDismiss?.();
    },
  }));

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  const filteredCountries = useMemo(() => {
    if (!search) return sortedCountries;
    const searchLower = search.toLowerCase();
    return sortedCountries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchLower) ||
        country.dial_code.includes(search)
    );
  }, [sortedCountries, search]);

  const handleSearchChange = useCallback((text) => {
    setSearch(text);
  }, []);

  const handleSelectCountry = useCallback(
    (country) => {
      onSelectCountry(country);
      bottomSheetRef.current?.dismiss();
      setSearch("");
    },
    [onSelectCountry]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.countryItem}
        onPress={() => handleSelectCountry(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <Text style={styles.countryName}>{item.name}</Text>
        <Text style={styles.dialCode}>{item.dial_code}</Text>
      </TouchableOpacity>
    ),
    [handleSelectCountry]
  );

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
      keyboardBehavior="interactive"
      enableDynamicSizing={false}
      onChange={handleSheetPositionChange}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      onDismiss={() => setSearch("")}
    >
      <View style={styles.bottomSheetContent}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search country or dial code..."
            onChangeText={handleSearchChange}
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>

        <BottomSheetFlashList
          data={filteredCountries}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="none"
          estimatedItemSize={65}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "white",
  },
  searchInput: {
    height: 40,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "white",
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
  },
  dialCode: {
    fontSize: 16,
    color: "#64748B",
  },
});

export default CountryPickerModal;
