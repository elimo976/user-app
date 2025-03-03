export type UserRole = 'admin' | 'user';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  dateOfBirth?: string;
  password: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  geoLocation?: {
    latitude: number;
    longitude: number;
  };
  phoneNumber?: string;
  interests?: string[];
  bio?: string;
  avatar?: string;
  avatarUrl?: string; // Nel backend rappresenta l'avatar di default
}
