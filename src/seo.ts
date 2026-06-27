import { products, categoryLabels } from './data';
import type { Page } from './types';

const siteName = 'DigiCraft Store';
const siteUrl = 'https://digicraft.store';
const defaultImage = `${siteUrl}/og-image.svg`;

type SeoPayload = {
  title: string;
  description: string;
  type?: string;
  keywords?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function upsertMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function buildSchema(page: Page, productId: string | null) {
  if (page === 'product-detail' && productId) {
    const product = products.find((item) => item.id === productId);
    if (!product) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: siteName,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: product.price,
        availability: 'https://schema.org/InStock',
        url: `${siteUrl}/products/${product.slug}`,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    };
  }

  if (page === 'products') {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${siteName} Products`,
      url: `${siteUrl}/products`,
      mainEntity: products.slice(0, 8).map((product) => ({
        '@type': 'Product',
        name: product.name,
        image: product.images[0],
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: product.price,
        },
      })),
    };
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      email: 'support@digicraft.store',
      sameAs: ['https://instagram.com/digicraft', 'https://twitter.com/digicraft'],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/products?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}

export function getSeoForPage(page: Page, productId: string | null): SeoPayload {
  if (page === 'product-detail' && productId) {
    const product = products.find((item) => item.id === productId);
    if (product) {
      return {
        title: `${product.name} — ${siteName}`,
        description: `${product.shortDescription} Instant download for ${product.currency}${product.price}. ${categoryLabels[product.category]}.`,
        type: 'product',
        keywords: `${product.tags.join(', ')}, digital products, templates, instant download`,
        schema: buildSchema(page, productId) ?? undefined,
      };
    }
  }

  const map: Record<Page, SeoPayload> = {
    home: {
      title: `${siteName} — Premium Notion, Canva & AI Digital Products`,
      description: 'Transform your workflow in 24 hours with ready-to-use Notion templates, Canva assets, AI prompt libraries, and course bundles.',
      type: 'website',
      keywords: 'notion templates, canva templates, ai prompts, digital products, instant download',
      schema: buildSchema(page, productId) ?? undefined,
    },
    products: {
      title: `Browse Digital Products — ${siteName}`,
      description: 'Shop premium Notion templates, Canva kits, AI prompt libraries, design systems, and course bundles for creators and entrepreneurs.',
      type: 'website',
      keywords: 'digital product store, notion templates, canva kits, prompt library',
      schema: buildSchema(page, productId) ?? undefined,
    },
    'product-detail': {
      title: `${siteName}`,
      description: 'Premium digital product with instant delivery.',
      type: 'product',
      schema: buildSchema(page, productId) ?? undefined,
    },
    checkout: {
      title: `Secure Checkout — ${siteName}`,
      description: 'Complete your secure purchase with instant digital delivery and encrypted checkout.',
      type: 'website',
    },
    'thank-you': {
      title: `Order Confirmed — ${siteName}`,
      description: 'Your order is confirmed and your digital downloads are ready.',
      type: 'website',
    },
    dashboard: {
      title: `My Dashboard — ${siteName}`,
      description: 'Access your purchases, downloads, and order history.',
      type: 'profile',
    },
    about: {
      title: `About Us — ${siteName}`,
      description: 'Learn why DigiCraft creates premium digital templates and systems for modern creators.',
      type: 'website',
    },
    contact: {
      title: `Contact Support — ${siteName}`,
      description: 'Reach DigiCraft support for product questions, licensing help, and customer care.',
      type: 'website',
    },
    terms: {
      title: `Terms & Conditions — ${siteName}`,
      description: 'Read the terms and conditions for purchasing and using DigiCraft digital products.',
      type: 'website',
    },
    privacy: {
      title: `Privacy Policy — ${siteName}`,
      description: 'Understand how DigiCraft collects, stores, and processes your data responsibly.',
      type: 'website',
    },
    refund: {
      title: `Refund Policy — ${siteName}`,
      description: 'Review DigiCraft refund terms for digital products and technical issue cases.',
      type: 'website',
    },
    admin: {
      title: `Admin Panel — ${siteName}`,
      description: 'Manage your DigiCraft store settings, chatbot, payments, and integrations.',
      type: 'website',
    },
  };

  return map[page];
}

export function applySeo(page: Page, productId: string | null) {
  const seo = getSeoForPage(page, productId);
  document.title = seo.title;

  upsertMeta('meta[name="description"]', 'name', 'description', seo.description);
  upsertMeta('meta[name="keywords"]', 'name', 'keywords', seo.keywords ?? 'digital products');
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
  upsertMeta('meta[property="og:type"]', 'property', 'og:type', seo.type ?? 'website');
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', defaultImage);
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
  upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', defaultImage);
  upsertMeta('meta[name="theme-color"]', 'name', 'theme-color', '#6d28d9');

  let schemaScript = document.getElementById('app-schema');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.setAttribute('type', 'application/ld+json');
    schemaScript.id = 'app-schema';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(seo.schema ?? buildSchema(page, productId) ?? {});
}
