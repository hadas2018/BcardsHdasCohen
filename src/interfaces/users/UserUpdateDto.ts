// src/interfaces/users/UserUpdateDto.ts
import { UserAddress } from "./UserAddress";
import { UserImage } from "./UserImage";
import { UserName } from "./UserName";


export interface UserUpdateDto {
  name: UserName;
  phone: string;
  image: UserImage;
  address: UserAddress;
  password?: string; // אופציונלי - רק אם המשתמש רוצה לעדכן סיסמה
}