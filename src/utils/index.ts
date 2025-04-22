export function formatNumberWithUnit(num: number, decimals = 2): string {
    const absNum = Math.abs(num);
    if (absNum >= 1e9) {
      return (num / 1e9).toFixed(decimals) + 'B';
    } else if (absNum >= 1e6) {
      return (num / 1e6).toFixed(decimals) + 'M';
    } else if (absNum >= 1e3) {
      return (num / 1e3).toFixed(decimals) + 'K';
    }
    return num.toString();
  }

  export function getRelativeTime(pastDate: number): string {
    const now = Date.now();
    const past = new Date(pastDate).getTime();
    const diffMs = now - past;
  
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
  
    return `${days}d ${hours}h ago`;
  }