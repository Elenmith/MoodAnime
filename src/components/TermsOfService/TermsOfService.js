import React from "react";
import "./TermsOfService.css";

const TermsOfService = () => {
  return (
    <div className="terms-container">
      <h1>Terms of Service</h1>

      <p>
        By using MoodForAnime, you agree to the following terms. If you do not
        agree with any part of these terms, please do not use the application.
      </p>

      <h2>1. Use of the Service</h2>
      <p>
        MoodForAnime is a free platform for discovering anime based on mood and
        category tags. It is intended for personal, non-commercial use only.
      </p>

      <h2>2. Content Accuracy</h2>
      <p>
        We strive to provide accurate anime data by using publicly available
        APIs. However, we do not guarantee the accuracy, completeness, or
        timeliness of any content.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        All anime titles, images, and related data belong to their respective
        copyright holders. MoodForAnime does not claim ownership of any such
        content.
      </p>

      <h2>4. Liability</h2>
      <p>
        We are not liable for any damages or issues that may arise from using
        this application. You use MoodForAnime at your own risk.
      </p>

      <h2>5. Changes to the Terms</h2>
      <p>
        We reserve the right to update these terms at any time. The latest
        version will always be available on this page.
      </p>

      <h2>6. Contact</h2>
      <p>
        If you have any questions regarding these terms, please use the contact
        form provided in the application.
      </p>
    </div>
  );
};

export default TermsOfService;
