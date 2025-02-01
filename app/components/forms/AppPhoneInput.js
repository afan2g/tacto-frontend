import React, { useRef, useState, useCallback } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { View, StyleSheet } from "react-native";
import {
  AsYouType,
  isValidPhoneNumber,
  parsePhoneNumber,
} from "libphonenumber-js/mobile";
import { colors } from "../../config";
import CountryPickerModal from "../modals/CountryPickerModal";
import { ChevronDown } from "lucide-react-native";
import { countryLookup } from "../../../lib/countryData";
export default function AppPhoneInput({
  onChangeNumber,
  onChangeCountry,
  initialCountry,
}) {
  const pickerRef = useRef(null);
  const [rawValue, setRawValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    initialCountry || countryLookup["US"]
  );

  const handleModal = useCallback(() => {
    pickerRef.current?.present();
  }, []);

  const handleSelectCountry = useCallback(
    (country) => {
      setSelectedCountry(country);
      onChangeCountry?.(country);
      setRawValue("");
      setFormattedValue("");
      pickerRef.current?.dismiss();
    },
    [onChangeCountry]
  );

  const handlePhoneNumber = (text) => {
    // Get just the digits from the input.

    if (isValidPhoneNumber(text)) {
      const validNumber = parsePhoneNumber(text);
      console.log("Valid Phone Number:", validNumber);
      setRawValue(validNumber.nationalNumber);
      const formatted = validNumber.formatNational();
      setFormattedValue(formatted);
      onChangeNumber?.(formatted);
      if (validNumber.country) {
        const newCountry = countryLookup[validNumber.country];
        if (newCountry) {
          setSelectedCountry(newCountry);
          onChangeCountry?.(newCountry);
        }
      }
      return;
    }
    const newDigits = text.replace(/\D/g, "");

    // If the new text length is less than the current formatted value’s length,
    // but the number of digits remains unchanged,
    // we assume the user tried to delete a formatting character.
    if (
      text.length < formattedValue.length &&
      newDigits.length === rawValue.length &&
      rawValue.length > 0
    ) {
      // Force deletion: remove the last digit from our raw value.
      const updatedDigits = rawValue.slice(0, -1);
      setRawValue(updatedDigits);
      const formatted = new AsYouType(selectedCountry.code).input(
        updatedDigits
      );
      setFormattedValue(formatted);
      onChangeNumber?.(formatted);
      console.log(
        "Forced deletion -> Raw:",
        updatedDigits,
        "Formatted:",
        formatted
      );
    } else if (newDigits.length !== rawValue.length) {
      // A genuine change in the digits has occurred.
      setRawValue(newDigits);
      const formatted = new AsYouType(selectedCountry.code).input(newDigits);
      setFormattedValue(formatted);
      onChangeNumber?.(formatted);
      console.log("Updated -> Raw:", newDigits, "Formatted:", formatted);
    }
    // Otherwise, if nothing changed in the digits, do nothing.
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.pickerButton} onPress={handleModal}>
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.dialCode}>{selectedCountry.dial_code}</Text>
          <ChevronDown
            size={24}
            color={colors.blackTint40}
            style={styles.chevronDown}
          />
        </TouchableOpacity>

        <TextInput
          value={formattedValue}
          placeholder="Phone number"
          style={styles.phoneInput}
          autoComplete="tel"
          keyboardType="phone-pad"
          onChangeText={handlePhoneNumber}
        />
      </View>

      <CountryPickerModal
        ref={pickerRef}
        onSelectCountry={handleSelectCountry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingLeft: 10,
    paddingRight: 5,
    borderRightWidth: 1,
  },
  flag: {
    fontSize: 24,
  },
  dialCode: {
    fontSize: 16,
    color: "#64748B",
    marginLeft: 8,
  },
  chevronDown: {
    marginLeft: 5,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
  },
});
