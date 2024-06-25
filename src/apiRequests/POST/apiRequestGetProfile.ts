import axios from "axios";
import { CheckLocalStorageForJWT } from "../../utils/utilIndex";

export default async function apiRequestGetProfile(): Promise<
  { sub: number; email: string } | string
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
