import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "@/hooks/use-toast"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(/,/g, '');
}

export function timeAgo(dateString: string) {
    const pastDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (let key in intervals) {
        const interval = Math.floor(diffInSeconds / intervals[key as keyof typeof intervals]);
        if (interval >= 1) {
            return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return "Just now";
}

// Example usage
console.log(timeAgo("Fri May 09 2025 00:00:00"));


export const handleShare = (page: string, query: string, platform?: string) => {
    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/${page}?${query}`
  
    if (platform === "clipboard") {
      navigator.clipboard.writeText(shareUrl).then(() => {
        //TODO: Show toast
      toast({
        title: "Info",
        description: "This is a toast from outside a component.",
      })
      }).catch((err) => {
        console.error("Failed to copy URL: ", err)
      })
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check this out!`, "_blank")
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")
    }
  }