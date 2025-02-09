export interface StudentTypes {
  createdAt: string;
  firstName: string;
  lastName: string;
  payment: Payment;
  phoneNumber: string;
  role: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface AdminTypes {
  createdAt: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface Payment {
  paymentHistory: string[];
  status: true;
  lastPaidDate: string;
}

export interface CollectionTypes {
  _id: string;
  collectionImage: string;
  collectionName: string;
  books: BookTypes[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Audio {
  file: string;
  label: string;
}

export interface Unit {
  title: string;
  audios: Audio[];
}

export interface Book {
  level: string;
  units: Unit[];
  _id: string;
}
export interface BookTypes {
  name: string;
  levels: [Book];
  _id: string;
}
