import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor.vercel.app"

// Sign In
export const signIn = async (credentials: { email: string; password: string }) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/signin`, credentials)
        return response.data // Return user data or token
    } 
    catch (error) {
        console.error("Error during sign-in:", error);
        throw error; // Re-throw the error to propagate it
    }
}

// Sign Up
export const signUp = async (userData: {
  full_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
  trading_experience: string
  investment_goals: string[]
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users`, userData)
    return response.data // Return success message or user data
    } 
    catch (error) {
      console.error("Error during sign-in:", error);
      throw error; // Re-throw the error to propagate it
  }

}

// Check Auth State
export const getAuthState = async () => {
  // Replace with your logic to check if the user is signed in (e.g., token validation)
  const token = localStorage.getItem("authToken")
  if (!token) throw new Error("User not signed in")
  return { token } // Return token or user data
}