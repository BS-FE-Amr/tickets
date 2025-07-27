export type UsersFilterValue = 'firstName' | 'lastName' | 'age' | 'id';

export type UsersContextType = {
  searchValue: string;
  filterValue: UsersFilterValue;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setFilterValue: React.Dispatch<React.SetStateAction<UsersFilterValue>>;
};

export interface UsersProps {
  page: number;
  pageSize: number;
  filterKey: UsersFilterValue;
  filterValue: string;
}

export interface UsersFullData {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: 'male' | 'female' | string;
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  ip: string;
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    country: string;
  };
  macAddress: string;
  university: string;
  bank: {
    cardExpire: string;
    cardNumber: string;
    cardType: string;
    currency: string;
    iban: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
  };
  ein: string;
  ssn: string;
  userAgent: string;
  crypto: {
    coin: string;
    wallet: string;
    network: string;
  };
  role: string;
}

export type UsersData = Partial<
  Pick<UsersFullData, 'id' | 'firstName' | 'lastName' | 'age'>
>;

export interface UsersResponse {
  users: UsersFullData[];
  total: number;
  skip: number;
  limit: number;
}

