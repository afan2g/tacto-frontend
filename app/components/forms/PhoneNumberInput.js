import React, { useRef, useState, useCallback } from "react";
import { Text, TouchableOpacity } from "react-native";
import PhoneInput from "react-phone-number-input/react-native-input";

import { View, StyleSheet } from "react-native";

import { colors } from "../../config";
import CountryPickerModal from "../modals/CountryPickerModal";
import { ChevronDown } from "lucide-react-native";

export default function PhoneNumberInput() {
  const pickerRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: "US",
    dial_code: "+1",
    flag: "🇺🇸",
    name: "United States",
  });
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleModal = () => {
    if (isModalOpen) {
      pickerRef.current?.dismiss();
    } else {
      pickerRef.current?.present();
    }
    setIsModalOpen((prev) => !prev);
  };

  const handleSelectCountry = useCallback((country) => {
    setSelectedCountry(country);
    pickerRef.current?.dismiss();
    setIsModalOpen(false);
  }, []);

  const handlePhoneNumber = useCallback((value) => {
    setPhoneNumber(value);
    console.log("Phone number:", value);
  }, []);

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
        <PhoneInput
          style={styles.phoneInput}
          country={selectedCountry.code}
          value={phoneNumber}
          onChange={handlePhoneNumber}
          placeholder="Phone Number"
        />
      </View>

      <CountryPickerModal
        ref={pickerRef}
        initialCountry={selectedCountry}
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
