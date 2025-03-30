import axios from "axios";
import { User } from "../interfaces/users/User";

const API: string = import.meta.env.VITE_USERS_API;

export function registerUser(normalizedUser: User) {
  return axios.post(API, normalizedUser);
}

export function loginUser(user: any) {
  return axios.post(`${API}/login`, user);
}

export function getUserById(id: string) {
  return axios.get(`${API}/${id}`, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}

export function updateUser(id: string, updatedUser: any) {
  const userToSend = { ...updatedUser };

  if ("_id" in userToSend) {
    delete userToSend._id;
  }

  if ("email" in userToSend) {
    delete userToSend.email;
  }

  if ("isBusiness" in userToSend) {
    delete userToSend.isBusiness;
  }
  if ("password" in userToSend) {
    delete userToSend.password;
  }
  console.log("Fields being sent to server:", userToSend);

  return axios.put(`${API}/${id}`, userToSend, {
    headers: {
      "x-auth-token": sessionStorage.getItem("token"),
    },
  });
}
