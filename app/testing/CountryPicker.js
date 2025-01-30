// CountryPicker.tsx
import React, { useRef, useState, useCallback, useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetFlashList,
} from "@gorhom/bottom-sheet";
import defaultCountries from "../../lib/countryDialInfo.json";
import { useBottomSheetBackHandler } from "../hooks/useBottomSheetBackHandler";
const CountryPicker = ({
  initialCountry = {
    name: "United States",
    flag: "🇺🇸",
    dial_code: "+1",
  },
  searchPlaceholder = "Search country or dial code...",
  renderItem,
  snapPoints = ["60%", "90%"],
  styles: customStyles = {},
  filterFunction,
  countryData = defaultCountries,
  onSelectCountry,
  onModalOpen,
  onModalClose,
  onSearchChange,
}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const bottomSheetModalRef = useRef(null);
  const { handleSheetPositionChange } =
    useBottomSheetBackHandler(bottomSheetModalRef);
  const countriesArray = useMemo(() => {
    return Object.entries(countryData).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [countryData]);

  const defaultFilterFunction = useCallback((country, searchText) => {
    const searchLower = searchText.toLowerCase();
    return (
      country.name.toLowerCase().includes(searchLower) ||
      country.dial_code.includes(searchText)
    );
  }, []);

  const filteredCountries = useMemo(() => {
    if (!search) return countriesArray;
    const filterFn = filterFunction || defaultFilterFunction;
    return countriesArray.filter((country) => filterFn(country, search));
  }, [countriesArray, search, filterFunction, defaultFilterFunction]);

  const handlePresentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
    onModalOpen?.();
  }, [onModalOpen]);

  const handleSelectCountry = useCallback(
    (country) => {
      setSelectedCountry(country);
      onSelectCountry?.(country);
      bottomSheetModalRef.current?.dismiss();
      setSearch("");
      onModalClose?.();
    },
    [onSelectCountry, onModalClose]
  );

  const handleSearchChange = useCallback(
    (text) => {
      setSearch(text);
      onSearchChange?.(text);
    },
    [onSearchChange]
  );

  const handleFocus = useCallback(() => {
    // Don't expand if already at max height
    if (!keyboardVisible) {
      bottomSheetModalRef.current?.expand();
    }
  }, [keyboardVisible]);

  const defaultRenderItem = useCallback(
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
    [handleSelectCountry, styles]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableOpacity
        style={styles.selectedCountry}
        onPress={handlePresentModal}
      >
        <Text style={styles.flag}>{selectedCountry.flag}</Text>
        <Text style={styles.countryName}>{selectedCountry.name}</Text>
        <Text style={styles.dialCode}>{selectedCountry.dial_code}</Text>
      </TouchableOpacity>

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={snapPoints}
          keyboardBehavior="fillParent"
          enableDynamicSizing={false}
          onDismiss={onModalClose}
          onChange={handleSheetPositionChange}
        >
          <View style={styles.bottomSheetContent}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={searchPlaceholder}
                onChangeText={handleSearchChange}
                onFocus={handleFocus}
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
              />
            </View>

            <BottomSheetFlashList
              data={filteredCountries}
              renderItem={renderItem || defaultRenderItem}
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
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectedCountry: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
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
    marginLeft: 8,
  },
});

export default CountryPicker;
