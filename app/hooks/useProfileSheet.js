import { useCallback, useRef, useState } from "react";
import ProfileBottomSheet from "../components/modals/ProfileBottomSheet";
export const useProfileSheet = (navigation) => {
  const profileSheetRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null); // { user, friendData, sharedTransactions }

  const present = useCallback((user, friendData, sharedTransactions) => {
    setData({ user, friendData, sharedTransactions });
    setVisible(true);
    // .present() is called automatically once the modal is rendered
    setTimeout(() => {
      profileSheetRef.current?.present();
    }, 0);
  }, []);

  const dismiss = useCallback(() => {
    profileSheetRef.current?.dismiss();
  }, []);

  const onDismiss = useCallback(() => {
    setVisible(false);
    setData(null);
  }, []);

  const ProfileSheet = useCallback(() => {
    if (!visible || !data) return null;

    return (
      <ProfileBottomSheet
        ref={profileSheetRef}
        user={data.user}
        friendData={data.friendData}
        sharedTransactions={data.sharedTransactions}
        navigation={navigation}
        onDismiss={onDismiss}
      />
    );
  }, [visible, data, navigation]);

  return {
    present,
    dismiss,
    ProfileSheet,
    isVisible: visible,
  };
};
