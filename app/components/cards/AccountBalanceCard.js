import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../primitives";
import { colors, fonts } from "../../config";
import { Eye, EyeOff } from "lucide-react-native";


function formatMoney(number, locale = 'en-US', currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(number);
}


function AccountBalanceCard({ balance, navigation, style }) {
  const [visible, setVisible] = useState(false);

  const handleBalancePress = () => {
    console.log(balance);
  };

  const handleVisibiltyPress = () => {
    setVisible((prev) => !prev);
    //save visibility state to async storage. TC
  };

  return (
    <View style={[styles.balanceContainer, style]}>
      <AppText style={styles.balanceText}>Your balance:</AppText>
      <View style={styles.balanceVisibility}>
        <AppText style={styles.balance} onPress={handleBalancePress}>
          {visible ? formatMoney(balance) : "$" + "\u2217".repeat(8) + "." + "\u2217".repeat(2)}
        </AppText>
        {visible ? (
          <EyeOff
            size={24}
            color={colors.lightGray}
            onPress={handleVisibiltyPress}
          />
        ) : (
          <Eye
            size={24}
            color={colors.lightGray}
            onPress={handleVisibiltyPress}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  balanceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.invisibleGray,
    paddingHorizontal: 10,
    width: "100%",
  },
  balanceText: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.lightGray,
    textAlign: "left",
    textAlignVertical: "bottom",
  },
  balanceVisibility: {
    flexDirection: "row",
    alignItems: "center",
  },
  balance: {
    fontSize: 24,
    fontFamily: fonts.black,
    color: colors.yellow,
    textAlign: "right",
    textAlignVertical: "bottom",
    paddingRight: 10,
  },
});

export default AccountBalanceCard;
