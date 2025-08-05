import React, { useEffect, useState } from 'react';
import './AmazonBanner.css';

const AmazonBanner = ({ 
  position = 'banner',
  category = 'anime',
  country = 'US',
  className = '',
  enabled = true 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Amazon Associates configuration
  const AMAZON_CONFIG = {
    trackingId: process.env.REACT_APP_AMAZON_TRACKING_ID || 'mood4ani-20',
    country: country,
    categories: {
      anime: {
        searchTerms: ['anime', 'manga', 'japanese animation'],
        category: 'Books'
      },
      figures: {
        searchTerms: ['anime figures', 'collectible figures'],
        category: 'Toys & Games'
      },
      merchandise: {
        searchTerms: ['anime merchandise', 'otaku'],
        category: 'Clothing'
      }
    }
  };

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    // Simulate Amazon product search
    // In production, you would use Amazon Product Advertising API
    const fetchAmazonProducts = async () => {
      try {
        setLoading(true);
        
        // Mock data for demonstration
        const mockProducts = [
          {
            id: 1,
            title: "Attack on Titan Complete Series",
            price: "$29.99",
            image: "https://via.placeholder.com/200x300/667eea/ffffff?text=Anime+Product",
            url: `https://www.amazon.com/dp/B08N5WRWNW?tag=${AMAZON_CONFIG.trackingId}`,
            rating: 4.5
          },
          {
            id: 2,
            title: "One Piece Manga Collection",
            price: "$24.99",
            image: "https://via.placeholder.com/200x300/764ba2/ffffff?text=Manga+Product",
            url: `https://www.amazon.com/dp/B08N5WRWNW?tag=${AMAZON_CONFIG.trackingId}`,
            rating: 4.8
          },
          {
            id: 3,
            title: "Anime Figure Collection",
            price: "$39.99",
            image: "https://via.placeholder.com/200x300/dc3545/ffffff?text=Figure+Product",
            url: `https://www.amazon.com/dp/B08N5WRWNW?tag=${AMAZON_CONFIG.trackingId}`,
            rating: 4.6
          }
        ];

        setProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching Amazon products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmazonProducts();
  }, [enabled, category, country]);

  if (!enabled) {
    return null;
  }

  if (loading) {
    return (
      <div className={`amazon-banner amazon-${position} ${className} loading`}>
        <div className="loading-spinner"></div>
        <p>Loading Amazon products...</p>
      </div>
    );
  }

  return (
    <div className={`amazon-banner amazon-${position} ${className}`}>
      <div className="amazon-header">
        <h4>🛒 Recommended Anime Products</h4>
        <p>Support Mood4Anime by shopping through our links</p>
      </div>
      
      <div className="amazon-products">
        {products.map((product) => (
          <a 
            key={product.id}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="amazon-product"
          >
            <div className="product-image">
              <img src={product.image} alt={product.title} />
            </div>
            <div className="product-info">
              <h5 className="product-title">{product.title}</h5>
              <div className="product-price">{product.price}</div>
              <div className="product-rating">
                {'⭐'.repeat(Math.floor(product.rating))}
                <span className="rating-text">({product.rating})</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      <div className="amazon-footer">
        <small>As an Amazon Associate, we earn from qualifying purchases</small>
      </div>
    </div>
  );
};

export default AmazonBanner; 