import axios from "axios";
import { Account } from "../../types/TypeIndex";

export default async function apiRequestCreateProfile(
  username: string,
  email: string,
  password: string
): Promise<Account | string> {
  return await axios
    .post(`${import.meta.env.VITE_API_URL}/accounts`, {
      accountUsername: username,
      accountEmail: email,
      accountPassword: password,
      accountRole: 1,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return String(error);
    });
}
