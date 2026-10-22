import React from "react";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

const OfflineBanner = () => {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div className="offline-banner" role="status">
      <WifiOff aria-hidden="true" />
      You're offline. Some actions won't work until your connection is back.
    </div>
  );
};

export default OfflineBanner;
