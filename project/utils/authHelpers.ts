export type UserType = "customer" | "restaurant" | "delivery";

export const loginUser = async (
  email: string,
  password: string,
  UserType: UserType
) => {
  const response = await fetch("http://localhost:3009/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, passwordHash: password, userType: UserType }),
  });

  if (!response) {
    throw new Error("Login failed. Please check your credentials.");
  }

  const data = await response.json();
  return data; // Assuming the response contains user data or a token
};

export const logoutUser = () => {
  // Clear any stored user data or tokens
  localStorage.removeItem("user");
};
