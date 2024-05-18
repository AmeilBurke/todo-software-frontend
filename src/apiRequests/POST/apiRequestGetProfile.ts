import axios from "axios";
import { Account } from "../../types/TypeIndex";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";

export default async function apiRequestGetProfile(): Promise<
  Account | string
> {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${CheckLocalStorageForJWT()}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return String(error);
    });
}
