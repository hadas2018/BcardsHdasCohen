export interface unnormalizedUser {
  _id: string;
  isAdmin: boolean;
  createdAt: string;
  first: string;
  middle?: string;
  last: string;
  phone: string;
  email: string;
  password: string;
  image?: string;
  alt?: string;
  state?: string;
  country: string;
  city: string;
  street: string;
  houseNumber: number;
  zip: number;
  isBusiness: boolean;
}
