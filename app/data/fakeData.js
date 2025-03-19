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
  full_name: "Aaron Fan",
  username: "@afan2k",
  avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
  balance: 123456.12,
};

export const FAKE_TRANSACTIONS_PENDING = [
  {
    id: 1,
    timestamp: getRandomDate(),
    amount: 100,
    status: "pending",
    otherUser: {
      full_name: "Kyle Li",
      username: "@wheresme2010",
      avatar_url: "https://i.pravatar.cc/80",
    },
    action: "send",
  },
  {
    id: 2,
    timestamp: getRandomDate(),
    amount: 100,
    status: "pending",
    otherUser: {
      full_name: "Kyle Li",
      username: "@wheresme2010",
      avatar_url: "https://i.pravatar.cc/80",
    },
    action: "send",
  },
  {
    id: 3,
    timestamp: getRandomDate(),
    amount: 100,
    status: "pending",
    otherUser: {
      full_name: "Kyle Li",
      username: "@wheresme2010",
      avatar_url: "https://i.pravatar.cc/80",
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
      full_name: "Kyle Li",
      username: "@wheresme2010",
      avatar_url: "https://i.pravatar.cc/80",
    },
    action: "receive",
  },
  {
    id: 2,
    timestamp: getRandomDate(),
    amount: 100,
    status: "completed",
    otherUser: {
      full_name: "Kyle Li",
      username: "@wheresme2010",
      avatar_url: "https://i.pravatar.cc/80",
    },
    action: "send",
  },
  {
    id: 3,
    timestamp: getRandomDate(),
    amount: 100,
    status: "completed",
    otherUser: {
      full_name: "Kyle Li",
      username: "@wheresme2010",
      avatar_url: "https://i.pravatar.cc/80",
    },
    action: "send",
  },
  {
    id: 4,
    timestamp: getRandomDate(),
    amount: 104,
    status: "completed",
    otherUser: {
      full_name: "Kyle Li",
      username: "@wheresme2010",
      avatar_url: "https://i.pravatar.cc/80",
    },
    action: "receive",
  },
];

export const FAKE_HOME_SCREEN_DATA = [
  {
    from: {
      full_name: "Aaron Fan",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
      username: "@afan2k",
    },
    to: {
      full_name: "Kyle Li",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
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
      full_name: "Kevin Liu",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      full_name: "Nate Gale",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
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
      full_name: "James Hill",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      full_name: "Michael Reeves",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
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
      full_name: "Jill Pyle",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      full_name: "Miranda Knox",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
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
      full_name: "Jill Pyle",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      full_name: "Miranda Knox",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
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
      full_name: "Jill Pyle",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      full_name: "Miranda Knox",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
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
      full_name: "Jill Pyle",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      full_name: "Miranda Knox",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
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
      full_name: "Jill Pyle",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      full_name: "Miranda Knox",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
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
      full_name: "Jill Pyle",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      full_name: "Miranda Knox",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
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
      full_name: "Jill Pyle",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      full_name: "Miranda Knox",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
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
      full_name: "Gayle Esser",
      avatar_url: "https://i.pravatar.cc/80",
      username: "@bcadge0",
    },
    to: {
      full_name: "Barbette Cadge",
      avatar_url: "https://i.pravatar.cc/80",
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
      full_name: "Kinny Borthram",
      avatar_url: "https://i.pravatar.cc/80",
      username: "@ycrabbe1",
    },
    to: {
      full_name: "Yank Crabbe",
      avatar_url: "https://i.pravatar.cc/80",
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
      full_name: "Konstantin Ashdown",
      avatar_url: "https://i.pravatar.cc/80",
      username: "@fdillinton2",
    },
    to: {
      full_name: "Frederique Dillinton",
      avatar_url: "https://i.pravatar.cc/80",
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
      full_name: "Brandise Bunton",
      avatar_url: "https://i.pravatar.cc/80",
      username: "@cboatwright3",
    },
    to: {
      full_name: "Cathrine Boatwright",
      avatar_url: "https://i.pravatar.cc/80",
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
      full_name: "Tabbatha Keal",
      avatar_url: "https://i.pravatar.cc/80",
      username: "@cbeagley4",
    },
    to: {
      full_name: "Corrianne Beagley",
      avatar_url: "https://i.pravatar.cc/80",
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
      full_name: "Virgilio Gartrell",
      avatar_url: "https://i.pravatar.cc/80",
      username: "@ibuglar5",
    },
    to: {
      full_name: "Inessa Buglar",
      avatar_url: "https://i.pravatar.cc/80",
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
      full_name: "Oralie Pomphrey",
      avatar_url: "https://i.pravatar.cc/80",
      username: "@rrobecon6",
    },
    to: {
      full_name: "Rosamund Robecon",
      avatar_url: "https://i.pravatar.cc/80",
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
      full_name: "Raffarty Liepina",
      avatar_url: "https://i.pravatar.cc/80",
      username: "@twalcot7",
    },
    to: {
      full_name: "Thibaud Walcot",
      avatar_url: "https://i.pravatar.cc/80",
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
      full_name: "Koralle Ibbs",
      avatar_url: "https://i.pravatar.cc/80",
      username: "@cpires8",
    },
    to: {
      full_name: "Colan Pires",
      avatar_url: "https://i.pravatar.cc/80",
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
      full_name: "Puff Dumberell",
      avatar_url: "https://i.pravatar.cc/80",
      username: "@ejoules9",
    },
    to: {
      full_name: "Etheline Joules",
      avatar_url: "https://i.pravatar.cc/80",
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
    full_name: "Aaron Fan",
    username: "@afan2k",
    avatar_url: "https://i.pravatar.cc/80",
  },
  {
    full_name: "Cindy Fan",
    username: "@cf96",
    avatar_url: "https://i.pravatar.cc/80",
  },
  {
    full_name: "Andrew Zhai",
    username: "@zhaizhaizhai",
    avatar_url: "https://i.pravatar.cc/80",
  },
  {
    full_name: "Nate Gale",
    username: "@nutgel",
    avatar_url: "https://i.pravatar.cc/80",
  },
  {
    full_name: "Kyle Li",
    username: "@wheresme2010",
    avatar_url: "https://i.pravatar.cc/80",
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
    full_name: "Aaron Fan",
    username: "@afan2k",
    avatar_url: "https://i.pravatar.cc/80",
    friends: 10,
    mutualFriends: 5,
    friendStatus: "pending",
  },
  {
    full_name: "Cindy Fan",
    username: "@cf96",
    avatar_url: "https://i.pravatar.cc/80",
    friends: 10,
    mutualFriends: 5,
    friendStatus: "accepted",
  },
  {
    full_name: "Andrew Zhai",
    username: "@zhaizhaizhai",
    avatar_url: "https://i.pravatar.cc/80",
    friends: 10,
    mutualFriends: 5,
    friendStatus: "none",
  },
  {
    full_name: "Nate Gale",
    username: "@nutgel",
    avatar_url: "https://i.pravatar.cc/80",
    friends: 10,
    mutualFriends: 5,
    friendStatus: "pending",
  },
  {
    full_name: "Kyle Li",
    username: "@wheresme2010",
    avatar_url: "https://i.pravatar.cc/80",
    friends: 10,
    mutualFriends: 5,
    friendStatus: "accepted",
  },
];

export const FAKE_TRANSACTION_POST = {
  post: {
    from: {
      full_name: "Aaron Fan",
      username: "@afan2k",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
    },
    to: {
      full_name: "Kyle Li",
      username: "@wheresme2010",
      avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
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
        full_name: "Kyle Li",
        username: "@wheresme2010",
        avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 1,
      commentCount: 0,
      time: getRandomDate("hour"),
      id: 1,
    },
    {
      user: {
        full_name: "Aaron Fan",
        username: "@afan2k",
        avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 2,
      commentCount: 1,
      time: getRandomDate("hour"),
      id: 2,
    },
    {
      user: {
        full_name: "Kyle Li",
        username: "@wheresme2010",
        avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 1,
      commentCount: 0,
      time: getRandomDate("hour"),
      id: 3,
    },
    {
      user: {
        full_name: "Aaron Fan",
        username: "@afan2k",
        avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 2,
      commentCount: 1,
      time: getRandomDate("hour"),
      id: 4,
    },
    {
      user: {
        full_name: "Kyle Li",
        username: "@wheresme2010",
        avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 1,
      commentCount: 0,
      time: getRandomDate("hour"),
      id: 5,
    },
    {
      user: {
        full_name: "Aaron Fan",
        username: "@afan2k",
        avatar_url: "https://api.dicebear.com/9.x/bottts-neutral/png",
      },
      text: "This is a reply to the transaction post.",
      score: 2,
      commentCount: 1,
      time: getRandomDate("hour"),
      id: 6,
    },
  ],
};
