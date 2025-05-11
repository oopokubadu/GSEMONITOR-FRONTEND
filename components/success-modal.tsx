import { Check } from "lucide-react"
import { Button } from "./ui/button"
import LoginModal from "./login-modal"
import { useState } from "react"

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
    const [openLogin, setOpenLogin] = useState(false)
    if (!isOpen) return null
  
    return (
    <>
      {
        !openLogin && 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-center space-y-4">
              <Check className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold">Account Created Successfully!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Your account has been created. You can now log in to start trading.
              </p>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => {
                  setOpenLogin(true) // Open login modal
                }}
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      }
    <LoginModal isOpen={openLogin} onClose={() => onClose()} />
    </>
    )
  }

export default SuccessModal