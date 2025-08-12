// Affiliate Configuration
export const AFFILIATE_CONFIG = {
  // Amazon Associates
  amazon: {
    enabled: true,
    tag: 'mood4anime-21', // Twój rzeczywisty tag z Amazon Associates
    baseUrl: 'https://www.amazon.com',
    tracking: {
      source: 'mood4anime',
      medium: 'affiliate',
      campaign: 'anime-recommendations'
    }
  },
  
  // Direct Links (bez komisji, ale dla UX)
  direct: {
    netflix: {
      baseUrl: 'https://www.netflix.com/search?q=',
      tracking: false
    },
    crunchyroll: {
      baseUrl: 'https://www.crunchyroll.com/search?q=',
      tracking: false
    },
    disney: {
      baseUrl: 'https://www.disneyplus.com/search?q=',
      tracking: false
    }
  },
  
  // Ad Networks
  ads: {
    googleAdsense: {
      enabled: false,
      clientId: 'ca-pub-YOUR_ID',
      slots: {
        header: 'YOUR_HEADER_SLOT',
        sidebar: 'YOUR_SIDEBAR_SLOT',
        footer: 'YOUR_FOOTER_SLOT'
      }
    }
  }
};

// Helper functions
export const generateAffiliateLink = (platform, animeTitle, type = 'search') => {
  const config = AFFILIATE_CONFIG[platform];
  
  if (!config || !config.enabled) {
    return null;
  }
  
  const encodedTitle = encodeURIComponent(animeTitle);
  
  switch (platform) {
    case 'amazon':
      return `${config.baseUrl}/s?k=${encodedTitle}&tag=${config.tag}`;
    
    case 'direct':
      return `${config.baseUrl}${encodedTitle}`;
    
    default:
      return null;
  }
};

export const trackAffiliateClick = (platform, animeTitle, linkType) => {
  // Google Tag Manager tracking
  if (typeof dataLayer !== 'undefined') {
    dataLayer.push({
      event: 'affiliate_click',
      platform: platform,
      anime_title: animeTitle,
      link_type: linkType,
      value: 1,
      timestamp: new Date().toISOString()
    });
  }
  
  // Custom tracking
  console.log(`Affiliate click: ${platform} - ${animeTitle} - ${linkType}`);
};
