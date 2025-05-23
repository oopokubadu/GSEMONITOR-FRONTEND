import { X } from "lucide-react";
import { Button } from "./ui/button";
import ReactPlayer from "react-player";

interface WatchDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WatchDemoModal({ isOpen, onClose }: WatchDemoModalProps) {
  if (!isOpen) return null; // Ensures modal is only rendered when open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6">
        <div className="pb-4">
            <center>
                <Button
                variant="ghost"
                size="icon"
                className="z-10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                onClick={onClose}
            >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
            </Button>
            </center>
        </div>

        <center>
            <ReactPlayer
            url="https://res.cloudinary.com/dfevzgrbu/video/upload/v1748003883/Demo_video_GSE_vwqtiu.mp4"
            width="800px"
            height="500px"
            controls
            playing={true}
            loop={true}
            className="w-full object-cover"
            />
        </center>
      </div>
    </div>
  );
}
