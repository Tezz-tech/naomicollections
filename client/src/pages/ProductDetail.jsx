import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Ruler, Share2, Star, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProduct, useRelatedProducts } from '../features/products/hooks';
import ImageGallery from '../components/product/ImageGallery';
import VariantSelector from '../components/product/VariantSelector';
import BulkPriceTable from '../components/product/BulkPriceTable';
import SizeGuideModal from '../components/product/SizeGuideModal';
import DescriptionTabs from '../components/product/DescriptionTabs';
import RelatedProducts from '../components/product/RelatedProducts';
import RecentlyViewed from '../components/product/RecentlyViewed';
import NotifyMeForm from '../components/product/NotifyMeForm';
import Seo from '../components/Seo';
import { Badge, Button, Skeleton } from '../components/ui';
import { formatNaira } from '../lib/format';
import { getUnitPrice, getTotalStock } from '../lib/pricing';
import { useCartStore } from '../store/cartStore';
import { useRecentlyViewedStore } from '../store/recentlyViewedStore';

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug);
  const { data: related, isLoading: loadingRelated } = useRelatedProducts(slug);
  const addItem = useCartStore((s) => s.addItem);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addItem);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    if (!product) return;
    setQuantity(product.saleType === 'bulk' ? product.minOrderQuantity : 1);
    if (product.variants?.length) {
      setSelectedSize(product.variants[0].size || null);
      setSelectedColor(product.variants[0].color || null);
    }
    addRecentlyViewed(product);
  }, [product, addRecentlyViewed]);

  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    return product.variants.find(
      (v) => (v.size || null) === selectedSize && (v.color || null) === selectedColor
    );
  }, [product, selectedSize, selectedColor]);

  if (isLoading) {
    return (
      <div className="container-luxury grid grid-cols-1 gap-10 py-12 lg:grid-cols-2">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-luxury py-24 text-center">
        <p className="font-serif text-2xl">Product not found</p>
        <Link to="/shop" className="link-underline mt-4 inline-block text-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  const stock = product.variants?.length
    ? (selectedVariant?.stock ?? 0)
    : getTotalStock(product);
  const outOfStock = stock <= 0;
  const unitPrice = getUnitPrice(product, quantity, selectedVariant?.sku);
  const isBulkOnly = product.saleType === 'bulk';
  const minQty = isBulkOnly ? product.minOrderQuantity : 1;
  const onSale = product.compareAtPrice && product.compareAtPrice > product.basePrice;

  function handleAddToCart() {
    if (product.variants?.length && !selectedVariant) {
      toast.error('Please select a size/color.');
      return;
    }
    if (quantity < minQty) {
      toast.error(`Minimum order quantity is ${minQty} units.`);
      return;
    }
    addItem(product, {
      variantSku: selectedVariant?.sku,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    toast.success('Added to your bag.');
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard.');
    }
  }

  return (
    <div className="container-luxury py-12">
      <Seo
        title={product.name}
        description={product.shortDescription || product.description?.slice(0, 160)}
        image={product.images?.[0]?.url}
        type="product"
      />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ImageGallery images={product.images} />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex gap-2">
            {product.isNewArrival && <Badge variant="black">New</Badge>}
            {product.isFlashSale && <Badge variant="error">Flash Sale</Badge>}
            {(product.saleType === 'bulk' || product.saleType === 'both') && (
              <Badge variant="gold">Bulk Available</Badge>
            )}
          </div>

          <h1 className="mt-4 font-serif text-3xl sm:text-4xl">{product.name}</h1>

          {product.ratingsCount > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.ratingsAverage) ? 'fill-gold' : ''}`} />
                ))}
              </div>
              <span className="text-xs text-grey">({product.ratingsCount})</span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="font-serif text-2xl text-gold">{formatNaira(unitPrice)}</span>
            {onSale && quantity < 2 && (
              <span className="text-sm text-grey line-through">{formatNaira(product.compareAtPrice)}</span>
            )}
            {quantity > 1 && <span className="text-xs text-grey">/ unit &times; {quantity}</span>}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-grey">{product.shortDescription}</p>

          {!isBulkOnly && product.variants?.length > 0 && (
            <div className="mt-8">
              <VariantSelector
                variants={product.variants}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                onChange={({ size, color }) => {
                  setSelectedSize(size);
                  setSelectedColor(color);
                }}
              />
            </div>
          )}

          {product.sizeGuide !== undefined && product.variants?.some((v) => v.size) && (
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="link-underline mt-4 flex items-center gap-1.5 text-xs uppercase tracking-wide text-grey"
            >
              <Ruler className="h-3.5 w-3.5" /> Size Guide
            </button>
          )}

          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide text-grey">
              {outOfStock ? (
                <span className="text-status-error">Out of Stock</span>
              ) : stock <= 5 ? (
                <span className="text-status-warning">Only {stock} left in stock</span>
              ) : (
                <span className="text-status-success">In Stock</span>
              )}
            </p>
            {outOfStock && <NotifyMeForm productId={product._id} variantSku={selectedVariant?.sku} />}
          </div>

          {(product.saleType === 'bulk' || product.saleType === 'both') && (
            <div className="mt-6">
              <BulkPriceTable
                minOrderQuantity={product.minOrderQuantity}
                bulkTiers={product.bulkTiers}
                quantity={quantity}
              />
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-grey-light">
              <button
                className="p-3 hover:bg-offwhite"
                onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm">{quantity}</span>
              <button
                className="p-3 hover:bg-offwhite"
                onClick={() => setQuantity((q) => Math.min(stock || q + 1, q + 1))}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button size="lg" disabled={outOfStock} onClick={handleAddToCart} className="flex-1">
              {outOfStock ? 'Out of Stock' : 'Add to Bag'}
            </Button>

            <button onClick={handleShare} aria-label="Share product" className="p-3 hover:text-gold">
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-grey">
            <Truck className="h-4 w-4 text-gold" />
            Free delivery in Lagos on qualifying orders. Delivery fee calculated at checkout.
          </div>
        </motion.div>
      </div>

      <DescriptionTabs product={product} />
      <RelatedProducts products={related} isLoading={loadingRelated} />
      <RecentlyViewed excludeId={product._id} />

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} sizeGuide={product.sizeGuide} />
    </div>
  );
}
