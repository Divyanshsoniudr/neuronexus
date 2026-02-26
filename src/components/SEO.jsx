import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, image, url }) => {
  const siteTitle = "NeuroQuiz Oracle";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const siteDescription =
    description ||
    "The elite AI engine for synaptic mastery. Turn any content into neural roadmaps instantly.";
  const siteImage = image || "/og-image-neural.png";
  const siteUrl = url || "https://neuroquiz.ai";
  const keywords =
    "ai edutech, neuroscience learning, smart study, adaptive roadmap, gpt-4 learning";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={siteDescription} />

      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />
      <meta property="og:site_name" content="NeuroQuiz" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@neuroquiz" />
      <meta name="twitter:url" content={siteUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
    </Helmet>
  );
};

export default SEO;
