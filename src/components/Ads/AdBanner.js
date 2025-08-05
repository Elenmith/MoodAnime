import React, { useEffect, useRef } from 'react';
import './AdBanner.css';

const AdBanner = ({ 
  position = 'banner', 
  size = '728x90', 
  className = '',
  enabled = true 
}) => {
  const adRef = useRef(null);

  useEffect(() => {
    // Load Google AdSense only if ads are enabled
    if (!enabled) return;

    // Check if AdSense is already loaded
    if (window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (error) {
        console.warn('AdSense error:', error);
      }
    } else {
      // Load AdSense script if not already loaded
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [enabled]);

  // Don't render anything if ads are disabled
  if (!enabled) {
    return null;
  }

  // Get ad configuration from environment variables
  const adClient = process.env.REACT_APP_ADSENSE_CLIENT_ID;
  const adSlot = process.env[`REACT_APP_ADSENSE_${position.toUpperCase()}_SLOT`];

  // Don't render if configuration is missing
  if (!adClient || !adSlot) {
    console.warn(`Missing AdSense configuration for position: ${position}`);
    return null;
  }

  return (
    <div className={`ad-banner ad-${position} ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner; 