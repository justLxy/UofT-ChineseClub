import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * SEO component to inject head meta tags for each page.
 * @param {string} title - Page title.
 * @param {string} description - Page description.
 * @param {string} keywords - Comma-separated keywords.
 * @param {string} url - Canonical URL for the page.
 * @param {string} image - URL of the social share image.
 */
const SEO = ({
  title,
  description,
  keywords = 'UTChinese, 多大中文, University of Toronto Chinese Network, UofT Chinese Club',
  url = 'https://www.utchinese.org/',
  image = `${process.env.PUBLIC_URL}/logo.png`,
}) => (
  <Helmet>
    {title && <title>{title}</title>}
    {description && <meta name="description" content={description} />}
    {keywords && <meta name="keywords" content={keywords} />}
    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={url} />
    <meta property="og:image" content={image} />
    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    {/* Canonical */}
    <link rel="canonical" href={url} />
  </Helmet>
);

export default SEO; 