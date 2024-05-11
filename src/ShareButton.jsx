import { useLocation } from 'react-router-dom';

export function ShareButton() {
  const location = useLocation();

  const handleShare = async () => {
    const url = window.location.origin + location.pathname + location.search;
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard');
    } catch (err) {
      alert('Failed to copy URL');
    }
  };

  return <button onClick={handleShare}>Share</button>;
}
