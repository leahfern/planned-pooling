import { useLocation } from 'react-router-dom';

export function ShareButton({ onCopySuccess, onCopyError }) {
  const location = useLocation();

  const handleShare = async () => {
    const url = window.location.origin + location.pathname + location.search;
    try {
      await navigator.clipboard.writeText(url);
      onCopySuccess?.();
    } catch (err) {
      onCopyError?.();
    }
  };

  return <button type="button" onClick={handleShare}>Share</button>;
}
