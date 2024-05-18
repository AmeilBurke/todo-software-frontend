import axios from "axios";

export default async function apiRequestSignin(
  email: string,
  password: string
): Promise<{ access_token: string } | string> {
  return await axios
    .post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      email: email,
      password: password,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return String(error);
    });
}
