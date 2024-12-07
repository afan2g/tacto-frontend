import getRandomDate from "../utils/getRandomDate";
import { colors } from "../config";
import {
  Clock,
  ChartSpline,
  ArrowDownUp,
  CircleDollarSign,
} from "lucide-react-native";
export const FAKEPROFILE = {
  fullName: "Aaron Fan",
  username: "@afan2k",
  profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
  balance: 123456.12,
};

export const FAKE_TRANSACTIONS_PENDING = [
  {
    id: 1,
    timestamp: getRandomDate(),
    amount: 100,
    status: "pending",
    otherUser: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://i.pravatar.cc/80",
    },
    action: "send",
  },
  {
    id: 2,
    timestamp: getRandomDate(),
    amount: 100,
    status: "pending",
    otherUser: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://i.pravatar.cc/80",
    },
    action: "send",
  },
  {
    id: 3,
    timestamp: getRandomDate(),
    amount: 100,
    status: "pending",
    otherUser: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://i.pravatar.cc/80",
    },
    action: "receive",
  },
];

export const FAKE_TRANSACTIONS_COMPLETED = [
  {
    id: 1,
    timestamp: getRandomDate(),
    amount: 100,
    status: "completed",
    otherUser: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://i.pravatar.cc/80",
    },
    action: "receive",
  },
  {
    id: 2,
    timestamp: getRandomDate(),
    amount: 100,
    status: "completed",
    otherUser: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://i.pravatar.cc/80",
    },
    action: "send",
  },
  {
    id: 3,
    timestamp: getRandomDate(),
    amount: 100,
    status: "completed",
    otherUser: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://i.pravatar.cc/80",
    },
    action: "send",
  },
  {
    id: 4,
    timestamp: getRandomDate(),
    amount: 104,
    status: "completed",
    otherUser: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://i.pravatar.cc/80",
    },
    action: "receive",
  },
];

export const FAKE_HOME_SCREEN_DATA = [
  {
    from: {
      fullName: "Aaron Fan",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
      username: "@afan2k",
    },
    to: {
      fullName: "Kyle Li",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
      username: "@wheresme2010",
    },
    amount: 10.0,
    memo: "Ullamco excepteur reprehenderit reprehenderit non eiusmod velit ullamco ullamco eu ullamco voluptate.",
    score: 2,
    commentCount: 1,
    txid: 1,
    time: getRandomDate("week"),
  },
  {
    from: {
      fullName: "Kevin Liu",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      fullName: "Nate Gale",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    amount: 121.1,
    memo: "Aute ad sunt nisi officia sunt consectetur esse labore ad deserunt occaecat.",
    score: 0,
    commentCount: 0,
    txid: 2,
    time: getRandomDate("day"),
  },
  {
    from: {
      fullName: "James Hill",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      fullName: "Michael Reeves",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    amount: 6.51,
    memo: "Fugiat id et consequat ea nulla ex pariatur id amet mollit esse sit consectetur.",
    score: 3,
    commentCount: 11,
    txid: 3,
    time: getRandomDate("hour"),
  },
  {
    from: {
      fullName: "Jill Pyle",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      fullName: "Miranda Knox",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    amount: 7.01,
    memo: "Magna deserunt ipsum fugiat reprehenderit anim velit.",
    score: 1,
    commentCount: 1,
    txid: 4,
    time: getRandomDate(),
  },
];

export const FAKEUSERS = [
  {
    fullName: "Aaron Fan",
    username: "@afan2k",
    profilePicUrl: "https://i.pravatar.cc/80",
  },
  {
    fullName: "Cindy Fan",
    username: "@cf96",
    profilePicUrl: "https://i.pravatar.cc/80",
  },
  {
    fullName: "Andrew Zhai",
    username: "@zhaizhaizhai",
    profilePicUrl: "https://i.pravatar.cc/80",
  },
  {
    fullName: "Nate Gale",
    username: "@nutgel",
    profilePicUrl: "https://i.pravatar.cc/80",
  },
  {
    fullName: "Kyle Li",
    username: "@wheresme2010",
    profilePicUrl: "https://i.pravatar.cc/80",
  },
];

export const FAKE_DROPDOWN_ITEMS = [
  {
    label: "Age",
    value: "age",
    icon: () => <Clock size={24} color={colors.fadedGray} />,
  },
  {
    label: "Volume",
    value: "volume",
    icon: () => <ChartSpline size={24} color={colors.fadedGray} />,
  },
  {
    label: "Transaction Count",
    value: "transactionCount",
    icon: () => <ArrowDownUp size={24} color={colors.fadedGray} />,
  },
  {
    label: "Net Value",
    value: "netValue",
    icon: () => <CircleDollarSign size={24} color={colors.fadedGray} />,
  },
];

export const FAKE_SPLIT_GROUPS_PREVIEW = [
  {
    title: "Roommates",
    recentTransactions: 1,
    volume: 100,
  },
  {
    title: "Friends",
    recentTransactions: 3,
    volume: 300,
  },
  {
    title: "Family",
    recentTransactions: 2,
    volume: 200,
  },
];
