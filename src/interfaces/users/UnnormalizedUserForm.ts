// src/interfaces/users/UnnormalizedUserForm.ts

/**
 * ממשק המייצג את המבנה של טופס המשתמש
 * כולל את כל השדות שיש בטופס
 */
export interface UnnormalizedUserForm {
    first: string;
    middle: string;
    last: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    image: string;
    alt: string;
    state: string;
    country: string;
    city: string;
    street: string;
    houseNumber: string | number;
    zip: string | number;
    isBusiness: boolean;
  }