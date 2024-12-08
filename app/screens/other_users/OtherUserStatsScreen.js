import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../components/primitives";
import { colors, fonts } from "../../config";

function OtherUserStatsScreen(props) {
  return (
    <View style={styles.container}>
      <AppText
        style={{
          fontSize: 20,
          color: colors.lightGray,
          fontFamily: fonts.black,
        }}
      >
        Stats
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OtherUserStatsScreen;
