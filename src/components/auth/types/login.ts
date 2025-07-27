export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  image: string;
}

export interface FormDataInterface {
  username: string;
  password: string;
}

export interface FormDataError {
  username: string;
  password: string;
  global: string;
}
