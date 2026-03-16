import { useLocation } from 'react-router-dom';

interface ShareButtonProps {
  onCopySuccess?: () => void;
  onCopyError?: () => void;
}

export function ShareButton({ onCopySuccess, onCopyError }: ShareButtonProps) {
  const location = useLocation();

  const handleShare = async () => {
    const url = window.location.origin + location.pathname + location.search;
    try {
      await navigator.clipboard.writeText(url);
      onCopySuccess?.();
    } catch {
      onCopyError?.();
    }
  };

  return <button type="button" onClick={handleShare}>Share</button>;
}
