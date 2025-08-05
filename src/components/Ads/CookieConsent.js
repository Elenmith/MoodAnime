import React, { useState, useEffect } from 'react';
import { useAds } from '../../context/AdContext';
import './CookieConsent.css';

const CookieConsent = () => {
  const { adState, setUserConsent } = useAds();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show consent banner if user hasn't made a choice yet
    if (adState.userConsent === false && adState.enabled) {
      setIsVisible(true);
    }
  }, [adState.userConsent, adState.enabled]);

  const handleAccept = () => {
    setUserConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    setUserConsent(false);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-content">
        <div className="cookie-consent-text">
          <h4>🍪 Używamy plików cookie</h4>
          <p>
            Używamy plików cookie i podobnych technologii, aby zapewnić najlepsze doświadczenie 
            na naszej stronie. Pliki cookie pomagają nam również wyświetlać reklamy, które 
            wspierają rozwój Mood4Anime.
          </p>
        </div>
        <div className="cookie-consent-buttons">
          <button 
            className="cookie-consent-decline"
            onClick={handleDecline}
          >
            Odrzuć
          </button>
          <button 
            className="cookie-consent-accept"
            onClick={handleAccept}
          >
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent; 