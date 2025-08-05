import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  anime = null 
}) => {
  const siteTitle = 'Mood4Anime - Discover Perfect Anime for Your Mood';
  const siteDescription = 'Find the perfect anime based on your mood! Browse thousands of anime recommendations filtered by emotions, genres, and ratings.';
  const siteUrl = 'https://mood4anime.com';
  const siteImage = 'https://mood4anime.com/og-image.jpg';

  const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const finalDescription = description || siteDescription;
  const finalKeywords = keywords || 'anime recommendations, anime by mood, anime emotions, anime list, best anime, anime discovery';
  const finalImage = image || siteImage;
  const finalUrl = url || siteUrl;

  // Structured data for anime pages
  const getStructuredData = () => {
    if (anime) {
      return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": anime.title,
        "description": anime.synopsis || anime.description,
        "image": anime.imageUrl,
        "url": `${siteUrl}/anime/${anime._id}`,
        "genre": anime.genres?.join(', '),
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": anime.rating,
          "ratingCount": "1000+",
          "bestRating": "10",
          "worstRating": "0"
        },
        "author": {
          "@type": "Organization",
          "name": "Mood4Anime"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Mood4Anime",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/logo192.png`
          }
        }
      };
    }

    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": finalTitle,
      "description": finalDescription,
      "url": finalUrl,
      "publisher": {
        "@type": "Organization",
        "name": "Mood4Anime",
        "url": siteUrl
      }
    };
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Mood4Anime" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalUrl} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={finalImage} />
      <meta name="twitter:creator" content="@mood4anime" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Mobile Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta name="theme-color" content="#667eea" />
      <meta name="color-scheme" content="light dark" />
    </Helmet>
  );
};

export default SEO; 