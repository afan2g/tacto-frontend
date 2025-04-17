import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";

import { colors, fonts } from "../../config";
import { UserCardVertical } from "../cards";
import { MoveRight, X } from "lucide-react-native";
import { AppText } from "../primitives";
import { ArrowBigUp, ArrowBigDown } from "lucide-react-native";

function TransactionModal({ transaction, visible, close }) {
  if (!transaction) return null; // Render nothing if no user is selected

  const {
    from_user: from,
    to_user: to,
    amount,
    score = 0,
    commentCount = 0,
    memo,
    status,
    method_id: type,
    id: identifier,
  } = transaction;
  console.log(transaction);
  const shortId = identifier.slice(0, 8).toUpperCase();
  console.log("id shortened", shortId);
  const created_at = new Date(transaction.created_at);
  const completed_at = new Date(transaction.updated_at);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={close}
      style={{ backdropColor: colors.black }}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={close}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.transactionContainer}>
              <X
                size={32}
                color={colors.lightGray}
                style={styles.closeIcon}
                onPress={close}
              />
              <View style={styles.headerContainer}>
                <UserCardVertical user={from} scale={0.6} style={styles.user} />
                <MoveRight
                  size={24}
                  color={colors.lightGray}
                  style={styles.arrow}
                />
                <UserCardVertical user={to} scale={0.6} style={styles.user} />
              </View>
              <View style={styles.textContainer}>
                <AppText style={styles.text}>{memo}</AppText>
                <View style={styles.bottomContainer}>
                  <View style={styles.voteContainer}>
                    <ArrowBigUp
                      color={colors.lightGray}
                      size={24}
                      style={styles.vote}
                    />
                    <AppText style={styles.score}>{score}</AppText>
                    <ArrowBigDown
                      color={colors.lightGray}
                      size={24}
                      style={styles.vote}
                    />
                  </View>
                  <AppText style={styles.comments}>
                    {commentCount} comment{commentCount != 1 ? "s" : ""}
                  </AppText>
                </View>
              </View>
              <View style={styles.separator} />
              <View style={styles.detailContainer}>
                <View style={styles.detailRow}>
                  <AppText style={[styles.detailText, styles.labelText]}>
                    Status:
                  </AppText>
                  <AppText style={styles.detailValue}>{status}</AppText>
                </View>
                <View style={styles.detailRow}>
                  <AppText style={[styles.detailText, styles.labelText]}>
                    Type:
                  </AppText>
                  <AppText style={styles.detailValue}>{type}</AppText>
                </View>
                <View style={styles.detailRow}>
                  <AppText style={[styles.detailText, styles.labelText]}>
                    Amount:
                  </AppText>
                  <AppText style={styles.detailValue}>
                    ${amount.toFixed(2)}
                  </AppText>
                </View>
                <View style={styles.detailRow}>
                  <AppText style={[styles.detailText, styles.labelText]}>
                    Created:
                  </AppText>
                  <AppText style={styles.detailValue}>
                    {created_at.toLocaleString()}
                  </AppText>
                </View>
                <View style={styles.detailRow}>
                  <AppText style={[styles.detailText, styles.labelText]}>
                    Completed:
                  </AppText>
                  <AppText style={styles.detailValue}>
                    {completed_at.toLocaleString()}
                  </AppText>
                </View>
                <View style={styles.detailRow}>
                  <AppText style={[styles.detailText, styles.labelText]}>
                    Identifier:
                  </AppText>
                  <AppText style={styles.detailValue}>{shortId}</AppText>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Keeps the dimmed background
    justifyContent: "center",
    alignItems: "center",
  },
  transactionContainer: {
    alignItems: "center",
    width: "80%",
    backgroundColor: colors.black,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.blackTint40,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 20,
    paddingBottom: 10,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  user: {
    flex: 1,
  },
  arrow: {
    flex: 1,
  },
  textContainer: {
    width: "100%",
  },
  text: {
    color: colors.grayOpacity50,
    fontFamily: fonts.regular,
    fontSize: 16,
    textAlign: "justify",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  voteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  vote: {},
  score: {
    color: colors.yellow,
    fontFamily: fonts.bold,
    fontSize: 16,
    marginHorizontal: 5,
  },
  comments: {
    color: colors.lightGray,
    fontFamily: fonts.medium,
    fontSize: 14,
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: colors.blackTint10,
    marginVertical: 15,
    borderRadius: 2,
  },
  detailContainer: {
    width: "100%",
  },
  detailText: {
    color: colors.lightGray,
    fontFamily: fonts.regular,
    fontSize: 16,
    marginBottom: 5,
    textAlignVertical: "bottom",
  },
  labelText: {
    color: colors.grayOpacity50,
    fontFamily: fonts.medium,
    textAlignVertical: "bottom",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8, // Add spacing between rows
    textAlignVertical: "bottom",
  },
  detailValue: {
    color: colors.lightGray,
    fontFamily: fonts.regular,
    fontSize: 16,
    textAlign: "right", // Align values to the right for a cleaner look
    textAlignVertical: "bottom",
  },
});

export default TransactionModal;
