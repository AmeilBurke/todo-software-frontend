import axios from "axios";

export default async function IsJWTTokenValid(
  jwtToken: string
): Promise<{ sub: number; email: string } | string> {
  return await axios
    .get(`${import.meta.env.VITE_API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    .then((response) => {
      return { sub: response.data.sub, email: response.data.email };
    })
    .catch((error) => {
      return String(error);
    });
}
