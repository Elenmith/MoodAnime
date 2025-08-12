import React from 'react';
import { generateAffiliateLink, trackAffiliateClick } from '../../config/affiliate';
import './TestAffiliate.css';

const TestAffiliate = () => {
  const testAnime = [
    { title: "Attack on Titan", genre: "Action" },
    { title: "Death Note", genre: "Thriller" },
    { title: "My Hero Academia", genre: "Superhero" },
    { title: "Demon Slayer", genre: "Action" },
    { title: "One Piece", genre: "Adventure" }
  ];

  const handleTestClick = (animeTitle) => {
    const affiliateUrl = generateAffiliateLink('amazon', animeTitle, 'test');
    console.log('Generated affiliate URL:', affiliateUrl);
    
    if (affiliateUrl) {
      trackAffiliateClick('amazon', animeTitle, 'test');
      window.open(affiliateUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('Affiliate link generation failed');
    }
  };

  return (
    <div className="test-affiliate">
      <h2>🧪 Test Affiliate Links</h2>
      <p>Kliknij na anime, aby przetestować linki affiliate:</p>
      
      <div className="test-grid">
        {testAnime.map((anime, index) => (
          <button
            key={index}
            className="test-anime-card"
            onClick={() => handleTestClick(anime.title)}
          >
            <h3>{anime.title}</h3>
            <p>{anime.genre}</p>
            <span className="test-label">Test Amazon Link</span>
          </button>
        ))}
      </div>
      
      <div className="test-info">
        <h3>ℹ️ Informacje o teście:</h3>
        <ul>
          <li>Linki otworzą się w nowej karcie</li>
          <li>Sprawdź konsolę przeglądarki (F12) dla logów</li>
          <li>Tag: <code>mood4anime-21</code></li>
          <li>Status: {generateAffiliateLink('amazon', 'test') ? '✅ Aktywny' : '❌ Nieaktywny'}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestAffiliate;
