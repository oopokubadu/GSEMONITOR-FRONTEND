import { useState } from "react"
import { useSignUp } from "@/hooks/use-sign-up"

export default function SignUp() {
  const { mutate: signUp } = useSignUp()
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
    trading_experience: "beginner",
    investment_goals: [],
  })

  const handleSignUp = () => {
    signUp(formData)
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {/* Add other fields */}
      {/* <button onClick={handleSignUp} disabled={isLoading}>
        {isLoading ? "Signing up..." : "Sign Up"}
      </button> */}
    </div>
  )
}