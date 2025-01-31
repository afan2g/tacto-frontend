// CountryPicker.tsx
import React, { useState, useCallback, useMemo, forwardRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { BottomSheetModal, BottomSheetFlashList } from "@gorhom/bottom-sheet";
import defaultCountries from "../../../lib/countryDialInfo.json";
import { useBottomSheetBackHandler } from "../../hooks/useBottomSheetBackHandler";

const CountryPickerModal = forwardRef(
  (
    {
      styles: customStyles = {},
      countryData = defaultCountries,
      onSelectCountry,
    },
    ref
  ) => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [search, setSearch] = useState("");
    const { handleSheetPositionChange } = useBottomSheetBackHandler(ref);

    const snapPoints = useMemo(() => ["50%", "90%"], []);
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
      const filterFn = defaultFilterFunction;
      return countriesArray.filter((country) => filterFn(country, search));
    }, [countriesArray, search, defaultFilterFunction]);

    const handleSearchChange = useCallback((text) => {
      setSearch(text);
    }, []);

    const handleFocus = useCallback(() => {
      if (!keyboardVisible) {
        ref.current?.expand();
      }
    }, [keyboardVisible]);

    const handleSelectCountry = useCallback(
      (country) => {
        onSelectCountry(country);
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
      [onSelectCountry]
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        keyboardBehavior="fillParent"
        enableDynamicSizing={false}
        onChange={handleSheetPositionChange}
      >
        <View style={styles.bottomSheetContent}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search country or dial code..."
              onChangeText={handleSearchChange}
              onFocus={handleFocus}
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
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
});

export default CountryPickerModal;
