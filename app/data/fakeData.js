import getRandomDate from "../utils/getRandomDate";
import { colors } from "../config";
import {
  Clock,
  ChartSpline,
  ArrowDownUp,
  CircleDollarSign,
} from "lucide-react-native";
import generateRandomHash from "../utils/generateRandomHash";
import { memo } from "react";
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
    txid: 5,
    time: getRandomDate(),
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
    txid: 6,
    time: getRandomDate(),
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
    txid: 7,
    time: getRandomDate(),
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
    txid: 8,
    time: getRandomDate(),
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
    txid: 9,
    time: getRandomDate(),
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
    txid: 10,
    time: getRandomDate(),
  },
];

export const FAKE_TRANSACTIONS_FULL = [
  {
    from: {
      fullName: "Gayle Esser",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@bcadge0",
    },
    to: {
      fullName: "Barbette Cadge",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@bcadge0",
    },
    amount: 39.38,
    score: 8,
    commentCount: 4,
    completed_at: getRandomDate(),
    status: "canceled",
    type: "tap",
    created_at: getRandomDate(),
    identifier: generateRandomHash(),
    memo: "Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
  },
  {
    from: {
      fullName: "Kinny Borthram",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@ycrabbe1",
    },
    to: {
      fullName: "Yank Crabbe",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@ycrabbe1",
    },
    amount: 490.91,
    score: 15,
    commentCount: 3,
    completed_at: getRandomDate(),
    status: "pending",
    type: "tap",
    created_at: getRandomDate(),
    identifier: generateRandomHash(),
    memo: "Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
  },
  {
    from: {
      fullName: "Konstantin Ashdown",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@fdillinton2",
    },
    to: {
      fullName: "Frederique Dillinton",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@fdillinton2",
    },
    amount: 801.29,
    score: 15,
    commentCount: 1,
    completed_at: getRandomDate(),
    status: "completed",
    type: "request fulfillment",
    created_at: getRandomDate(),
    identifier: generateRandomHash(),
    memo: "Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
  },
  {
    from: {
      fullName: "Brandise Bunton",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@cboatwright3",
    },
    to: {
      fullName: "Cathrine Boatwright",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@cboatwright3",
    },
    amount: 878.75,
    score: 0,
    commentCount: 1,
    completed_at: getRandomDate(),
    status: "canceled",
    type: "request fulfillment",
    created_at: getRandomDate(),
    identifier: generateRandomHash(),
    memo: "Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
  },
  {
    from: {
      fullName: "Tabbatha Keal",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@cbeagley4",
    },
    to: {
      fullName: "Corrianne Beagley",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@cbeagley4",
    },
    amount: 921.76,
    score: 6,
    commentCount: 5,
    completed_at: getRandomDate(),
    status: "completed",
    type: "request fulfillment",
    created_at: getRandomDate(),
    identifier: generateRandomHash(),
    memo: "Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
  },
  {
    from: {
      fullName: "Virgilio Gartrell",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@ibuglar5",
    },
    to: {
      fullName: "Inessa Buglar",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@ibuglar5",
    },
    amount: 583.75,
    score: 13,
    commentCount: 4,
    completed_at: getRandomDate(),
    status: "completed",
    type: "tap",
    created_at: getRandomDate(),
    identifier: generateRandomHash(),
    memo: "Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
  },
  {
    from: {
      fullName: "Oralie Pomphrey",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@rrobecon6",
    },
    to: {
      fullName: "Rosamund Robecon",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@rrobecon6",
    },
    amount: 823.56,
    score: 8,
    commentCount: 9,
    completed_at: getRandomDate(),
    status: "canceled",
    type: "tap",
    created_at: getRandomDate(),
    identifier: generateRandomHash(),
    memo: "Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
  },
  {
    from: {
      fullName: "Raffarty Liepina",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@twalcot7",
    },
    to: {
      fullName: "Thibaud Walcot",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@twalcot7",
    },
    amount: 689.04,
    score: 0,
    commentCount: 2,
    completed_at: getRandomDate(),
    status: "completed",
    type: "direct transfer",
    created_at: getRandomDate(),
    identifier: generateRandomHash(),
    memo: "Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
  },
  {
    from: {
      fullName: "Koralle Ibbs",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@cpires8",
    },
    to: {
      fullName: "Colan Pires",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@cpires8",
    },
    amount: 342.17,
    score: 7,
    commentCount: 4,
    completed_at: getRandomDate(),
    status: "pending",
    type: "request fulfillment",
    created_at: getRandomDate(),
    identifier: generateRandomHash(),
    memo: "Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
  },
  {
    from: {
      fullName: "Puff Dumberell",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@ejoules9",
    },
    to: {
      fullName: "Etheline Joules",
      profilePicUrl: "https://i.pravatar.cc/80",
      username: "@ejoules9",
    },
    amount: 394.31,
    score: 6,
    commentCount: 0,
    completed_at: getRandomDate(),
    status: "completed",
    type: "request fulfillment",
    created_at: getRandomDate(),
    identifier: generateRandomHash(),
    memo: "Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.",
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

export const FAKE_OTHER_USERS = [
  {
    fullName: "Aaron Fan",
    username: "@afan2k",
    profilePicUrl: "https://i.pravatar.cc/80",
    friends: 10,
    mutualFriends: 5,
    friendStatus: "pending",
  },
  {
    fullName: "Cindy Fan",
    username: "@cf96",
    profilePicUrl: "https://i.pravatar.cc/80",
    friends: 10,
    mutualFriends: 5,
    friendStatus: "accepted",
  },
  {
    fullName: "Andrew Zhai",
    username: "@zhaizhaizhai",
    profilePicUrl: "https://i.pravatar.cc/80",
    friends: 10,
    mutualFriends: 5,
    friendStatus: "none",
  },
  {
    fullName: "Nate Gale",
    username: "@nutgel",
    profilePicUrl: "https://i.pravatar.cc/80",
    friends: 10,
    mutualFriends: 5,
    friendStatus: "pending",
  },
  {
    fullName: "Kyle Li",
    username: "@wheresme2010",
    profilePicUrl: "https://i.pravatar.cc/80",
    friends: 10,
    mutualFriends: 5,
    friendStatus: "accepted",
  },
];

export const FAKE_TRANSACTION_POST = {
  post: {
    from: {
      fullName: "Aaron Fan",
      username: "@afan2k",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      fullName: "Kyle Li",
      username: "@wheresme2010",
      profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    amount: 10.0,
    memo: "Ullamco excepteur reprehenderit reprehenderit non eiusmod velit ullamco ullamco eu ullamco voluptate.",
    score: 2,
    commentCount: 1,
    txid: 1,
    time: getRandomDate("week"),
  },
  replies: [
    {
      user: {
        fullName: "Kyle Li",
        username: "@wheresme2010",
        profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 1,
      commentCount: 0,
      time: getRandomDate("hour"),
      id: 1,
    },
    {
      user: {
        fullName: "Aaron Fan",
        username: "@afan2k",
        profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 2,
      commentCount: 1,
      time: getRandomDate("hour"),
      id: 2,
    },
    {
      user: {
        fullName: "Kyle Li",
        username: "@wheresme2010",
        profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 1,
      commentCount: 0,
      time: getRandomDate("hour"),
      id: 3,
    },
    {
      user: {
        fullName: "Aaron Fan",
        username: "@afan2k",
        profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 2,
      commentCount: 1,
      time: getRandomDate("hour"),
      id: 4,
    },
    {
      user: {
        fullName: "Kyle Li",
        username: "@wheresme2010",
        profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 1,
      commentCount: 0,
      time: getRandomDate("hour"),
      id: 5,
    },
    {
      user: {
        fullName: "Aaron Fan",
        username: "@afan2k",
        profilePicUrl: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 2,
      commentCount: 1,
      time: getRandomDate("hour"),
      id: 6,
    },
  ],
};
