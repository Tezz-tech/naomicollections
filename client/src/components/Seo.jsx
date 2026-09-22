import { Helmet } from 'react-helmet-async';

const SITE_NAME = "Naomi's Collections";
const SITE_URL = import.meta.env.VITE_SITE_URL || '';
const DEFAULT_DESCRIPTION =
  "Naomi's Collections — premium menswear, dresses, shoes and accessories. Curated for the way you want to be seen.";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export default function Seo({ title, description = DEFAULT_DESCRIPTION, image = DEFAULT_IMAGE, url, type = 'website' }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Curated for the way you want to be seen`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
