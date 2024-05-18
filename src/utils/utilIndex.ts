export const CheckLocalStorageForJWT = () => {
  const result = localStorage.getItem("JWTToken");
  if (result === null) {
    return false;
  } else {
    return result;
  }
};

export const SaveJWTToLocalStorage = (jwtToken: string) => {
  localStorage.setItem("JWTToken", jwtToken);
};
