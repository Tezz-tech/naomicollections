import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCategories } from '../../features/categories/hooks';
import { useSettings } from '../../features/settings/hooks';
import { Divider } from '../ui';

const trustBadges = [
  { icon: ShieldCheck, label: 'Secure Payment', desc: 'Paystack verified checkout' },
  { icon: Truck, label: 'Authentic Products', desc: 'Curated & quality-checked' },
  { icon: RotateCcw, label: 'Easy Returns', desc: '7-day return window' },
];

export default function Footer() {
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-offwhite">
      <div className="border-b border-grey-light">
        <div className="container-luxury grid grid-cols-1 gap-8 py-12 sm:grid-cols-3">
          {trustBadges.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 justify-center sm:justify-start">
              <Icon className="h-6 w-6 shrink-0 text-gold" />
              <div>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-grey">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-luxury py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-3">
              <img src="/logo-mark.png" alt="" className="h-12 w-auto" />
              <span className="leading-none">
                <span className="block font-serif text-xl tracking-wide">NAOMI'S</span>
                <span className="block text-[10px] font-medium tracking-widest2 text-gold">COLLECTIONS</span>
              </span>
            </div>
            <p className="mt-4 text-xs text-grey">Curated for the way you want to be seen.</p>
            <div className="mt-5 flex gap-3">
              {settings?.socialLinks?.instagram && (
                <a href={settings.socialLinks.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
                  <Instagram className="h-4 w-4 text-grey transition-colors hover:text-gold" />
                </a>
              )}
              {settings?.socialLinks?.facebook && (
                <a href={settings.socialLinks.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
                  <Facebook className="h-4 w-4 text-grey transition-colors hover:text-gold" />
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a href={settings.socialLinks.twitter} aria-label="Twitter" target="_blank" rel="noreferrer">
                  <Twitter className="h-4 w-4 text-grey transition-colors hover:text-gold" />
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="section-label mb-4">Shop</p>
            <ul className="space-y-2.5 text-sm text-grey">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link to={`/shop?category=${cat._id}`} className="link-underline">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/bulk-orders" className="link-underline">
                  Bulk Orders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="section-label mb-4">Customer Care</p>
            <ul className="space-y-2.5 text-sm text-grey">
              <li>
                <Link to="/account/orders" className="link-underline">
                  Track My Order
                </Link>
              </li>
              <li>
                <Link to="/returns" className="link-underline">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="link-underline">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/contact" className="link-underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="section-label mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm text-grey">
              <li>
                <Link to="/terms" className="link-underline">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="link-underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <Divider />
        </div>

        <p className="mt-6 text-center text-xs text-grey">
          © {year} {settings?.storeName || "Naomi's Collections"}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
