import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>

      <p>
        Your privacy is important to us. MoodForAnime{" "}
        <strong>MoodForAnime</strong> does not collect any personal information
        from users.
      </p>

      <h2>1. Stored Data</h2>
      <p>
        MoodForAnime does not store personal data such as names, email
        addresses, phone numbers, or login credentials. The only locally stored
        data is the user's selected mood or category to improve the browsing
        experience.
      </p>

      <h2>2. Tracking Technologies</h2>
      <p>
        We do not use cookies, tracking pixels, or any similar technologies.
        MoodForAnime does not track your activity inside or outside the
        application.
      </p>

      <h2>3. External APIs</h2>
      <p>
        This application uses the Jikan API (an unofficial MyAnimeList API) to
        fetch anime data. MoodForAnime does not send any user-related data to
        third-party services.
      </p>

      <h2>4. Changes to this Policy</h2>
      <p>
        We may update this privacy policy occasionally. The latest version will
        always be available on this page.
      </p>

      <h2>5. Contact</h2>
      <p>
        If you have any questions regarding your privacy, please use the contact
        form available in the application.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
