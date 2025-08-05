import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context for ad management
const AdContext = createContext();

// Ad configuration
const AD_CONFIG = {
  // Enable/disable ads globally
  enabled: process.env.REACT_APP_ADS_ENABLED === 'true',
  
  // Ad type (amazon or adsense)
  type: process.env.REACT_APP_AD_TYPE || 'amazon',
  
  // Amazon Associates configuration
  amazon: {
    trackingId: process.env.REACT_APP_AMAZON_TRACKING_ID || 'mood4ani-20',
    country: process.env.REACT_APP_AMAZON_COUNTRY || 'US',
    enabled: true
  },
  
  // AdSense configuration (legacy)
  adsense: {
    enabled: false,
    clientId: process.env.REACT_APP_ADSENSE_CLIENT_ID,
    positions: {
      header: {
        enabled: false,
        adSlot: process.env.REACT_APP_ADSENSE_HEADER_SLOT,
        size: '728x90'
      },
      sidebar: {
        enabled: false,
        adSlot: process.env.REACT_APP_ADSENSE_SIDEBAR_SLOT,
        size: '300x250'
      },
      content: {
        enabled: false,
        adSlot: process.env.REACT_APP_ADSENSE_CONTENT_SLOT,
        size: '728x90'
      },
      footer: {
        enabled: false,
        adSlot: process.env.REACT_APP_ADSENSE_FOOTER_SLOT,
        size: '728x90'
      },
      inline: {
        enabled: false,
        adSlot: process.env.REACT_APP_ADSENSE_INLINE_SLOT,
        size: '728x90'
      }
    }
  },
  
  // Ad positions and their settings
  positions: {
    header: {
      enabled: true,
      type: 'amazon',
      category: 'anime'
    },
    sidebar: {
      enabled: true,
      type: 'amazon',
      category: 'figures'
    },
    content: {
      enabled: true,
      type: 'amazon',
      category: 'anime'
    },
    footer: {
      enabled: true,
      type: 'amazon',
      category: 'merchandise'
    },
    inline: {
      enabled: true,
      type: 'amazon',
      category: 'anime'
    }
  },
  
  // Ad frequency settings
  frequency: {
    maxAdsPerPage: 3,
    minDistanceBetweenAds: 2, // number of content blocks
    showOnMobile: true
  }
};

export const AdProvider = ({ children }) => {
  const [adState, setAdState] = useState({
    enabled: AD_CONFIG.enabled,
    userConsent: false,
    adCount: 0,
    lastAdPosition: null,
    adType: AD_CONFIG.type
  });

  const [adPositions, setAdPositions] = useState(AD_CONFIG.positions);

  // Check if ads should be shown based on various conditions
  const shouldShowAd = (position) => {
    // Check if ads are globally enabled
    if (!adState.enabled) return false;
    
    // Check if user has given consent (GDPR compliance)
    if (!adState.userConsent) return false;
    
    // Check if this specific position is enabled
    if (!adPositions[position]?.enabled) return false;
    
    // Check ad frequency limits
    if (adState.adCount >= AD_CONFIG.frequency.maxAdsPerPage) return false;
    
    // Check distance from last ad
    if (adState.lastAdPosition && 
        Math.abs(adState.lastAdPosition - position) < AD_CONFIG.frequency.minDistanceBetweenAds) {
      return false;
    }
    
    return true;
  };

  // Track when an ad is shown
  const trackAdShown = (position) => {
    setAdState(prev => ({
      ...prev,
      adCount: prev.adCount + 1,
      lastAdPosition: position
    }));
  };

  // Set user consent for ads
  const setUserConsent = (consent) => {
    setAdState(prev => ({
      ...prev,
      userConsent: consent
    }));
    
    // Store consent in localStorage
    localStorage.setItem('adConsent', consent);
  };

  // Toggle ads on/off
  const toggleAds = () => {
    setAdState(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  // Reset ad count (call this when navigating to new page)
  const resetAdCount = () => {
    setAdState(prev => ({
      ...prev,
      adCount: 0,
      lastAdPosition: null
    }));
  };

  // Load user consent from localStorage on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem('adConsent');
    if (savedConsent !== null) {
      setUserConsent(savedConsent === 'true');
    }
  }, []);

  const value = {
    adState,
    adPositions,
    shouldShowAd,
    trackAdShown,
    setUserConsent,
    toggleAds,
    resetAdCount,
    AD_CONFIG
  };

  return (
    <AdContext.Provider value={value}>
      {children}
    </AdContext.Provider>
  );
};

// Custom hook to use ad context
export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};

export default AdContext; 