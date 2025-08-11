export type Role = 'Admin' | 'FacilityOwner' | 'User';

export interface UserDTO {
  _id: string;
  email: string;
  role: Role;
}



