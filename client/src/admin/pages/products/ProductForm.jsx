import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAdminProduct, useCreateProduct, useUpdateProduct } from '../../../features/products/hooks';
import { useCategories } from '../../../features/categories/hooks';
import { Button, Card, Input, Skeleton } from '../../../components/ui';
import ImageUploader from '../../components/ImageUploader';

const variantSchema = z.object({
  size: z.string().trim().optional(),
  color: z.string().trim().optional(),
  sku: z.string().trim().min(1, 'SKU required'),
  stock: z.number().min(0),
  priceOverride: z.number().min(0).optional().nullable(),
});

const bulkTierSchema = z.object({
  minQty: z.number().min(1),
  maxQty: z.number().min(1).optional().nullable(),
  pricePerUnit: z.number().min(0),
});

const schema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  shortDescription: z.string().trim().max(240).optional(),
  category: z.string().min(1, 'Select a category'),
  tags: z.string().optional(),
  basePrice: z.number().min(0),
  compareAtPrice: z.number().min(0).optional().nullable(),
  saleType: z.enum(['single', 'bulk', 'both']),
  minOrderQuantity: z.number().min(1),
  status: z.enum(['draft', 'published']),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isFlashSale: z.boolean().optional(),
  flashDiscountPercent: z.number().min(0).max(90).optional().nullable(),
  sizeGuide: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  variants: z.array(variantSchema).optional(),
  bulkTiers: z.array(bulkTierSchema).optional(),
  stock: z.number().min(0).optional(),
});

const emptyDefaults = {
  name: '',
  description: '',
  shortDescription: '',
  category: '',
  tags: '',
  basePrice: 0,
  compareAtPrice: null,
  saleType: 'single',
  minOrderQuantity: 1,
  status: 'draft',
  isFeatured: false,
  isNewArrival: false,
  isFlashSale: false,
  flashDiscountPercent: null,
  sizeGuide: '',
  metaTitle: '',
  metaDescription: '',
  variants: [],
  bulkTiers: [],
};

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { data: product, isLoading } = useAdminProduct(isEdit ? id : null);
  const { data: categories = [] } = useCategories(true);
  const { mutate: create, isPending: creating } = useCreateProduct();
  const { mutate: update, isPending: updating } = useUpdateProduct();
  const [images, setImages] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues: emptyDefaults });

  const variants = useFieldArray({ control, name: 'variants' });
  const bulkTiers = useFieldArray({ control, name: 'bulkTiers' });
  const saleType = watch('saleType');
  const isFlashSale = watch('isFlashSale');

  useEffect(() => {
    if (!product) return;
    reset({
      ...emptyDefaults,
      ...product,
      category: product.category?._id || product.category,
      tags: (product.tags || []).join(', '),
      compareAtPrice: product.compareAtPrice ?? null,
      flashDiscountPercent: product.flashSale?.discountPercent ?? null,
      metaTitle: product.seo?.metaTitle || '',
      metaDescription: product.seo?.metaDescription || '',
      variants: product.variants || [],
      bulkTiers: product.bulkTiers || [],
    });
    setImages(product.images || []);
  }, [product, reset]);

  function onSubmit(values) {
    if (images.length === 0) {
      toast.error('Add at least one product image.');
      return;
    }
    if ((values.saleType === 'bulk' || values.saleType === 'both') && (!values.bulkTiers || values.bulkTiers.length === 0)) {
      toast.error('Add at least one bulk pricing tier.');
      return;
    }

    const payload = {
      name: values.name,
      description: values.description,
      shortDescription: values.shortDescription || undefined,
      category: values.category,
      tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      images,
      basePrice: values.basePrice,
      compareAtPrice: values.compareAtPrice || undefined,
      saleType: values.saleType,
      minOrderQuantity: values.minOrderQuantity,
      status: values.status,
      isFeatured: !!values.isFeatured,
      isNewArrival: !!values.isNewArrival,
      isFlashSale: !!values.isFlashSale,
      flashSale: values.isFlashSale
        ? {
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            discountPercent: values.flashDiscountPercent || 0,
          }
        : undefined,
      sizeGuide: values.sizeGuide || undefined,
      seo: { metaTitle: values.metaTitle || undefined, metaDescription: values.metaDescription || undefined },
      variants: (values.variants || []).map((v) => ({ ...v, priceOverride: v.priceOverride || undefined })),
      bulkTiers: values.saleType === 'single' ? [] : (values.bulkTiers || []).map((t) => ({ ...t, maxQty: t.maxQty || undefined })),
      stock: (!values.variants || values.variants.length === 0) ? values.stock || 0 : undefined,
    };

    const onSuccess = () => {
      toast.success(isEdit ? 'Product updated.' : 'Product created.');
      navigate('/admin/products');
    };
    const onError = (err) => toast.error(err.response?.data?.message || 'Could not save product.');

    if (isEdit) update({ id, payload }, { onSuccess, onError });
    else create(payload, { onSuccess, onError });
  }

  if (isEdit && isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div>
      <Link to="/admin/products" className="link-underline flex items-center gap-1.5 text-xs uppercase tracking-wide text-grey">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
      </Link>
      <h1 className="mt-3 font-serif text-2xl">{isEdit ? 'Edit Product' : 'New Product'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="p-6">
            <p className="section-label mb-4">Basic Information</p>
            <div className="space-y-4">
              <Input label="Product Name" {...register('name')} error={errors.name?.message} />
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Description</label>
                <textarea {...register('description')} rows={4} className="w-full border border-grey-light px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" />
                {errors.description && <p className="mt-1.5 text-xs text-status-error">{errors.description.message}</p>}
              </div>
              <Input label="Short Description" {...register('shortDescription')} hint="Shown on shop cards, max 240 characters" />
              <Input label="Tags (comma-separated)" {...register('tags')} placeholder="silk, evening, bestseller" />
            </div>
          </Card>

          <Card className="p-6">
            <p className="section-label mb-4">Images</p>
            <ImageUploader images={images} onChange={setImages} />
          </Card>

          <Card className="p-6">
            <p className="section-label mb-4">Pricing & Sale Type</p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Base Price (₦)" type="number" step="1" {...register('basePrice', { valueAsNumber: true })} error={errors.basePrice?.message} />
              <Input label="Compare-at Price (₦, optional)" type="number" step="1" {...register('compareAtPrice', { valueAsNumber: true })} />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Sale Type</label>
              <div className="grid grid-cols-3 gap-2">
                {['single', 'bulk', 'both'].map((type) => (
                  <label key={type} className={`cursor-pointer border px-3 py-2.5 text-center text-xs uppercase tracking-wide ${saleType === type ? 'border-black bg-black text-white' : 'border-grey-light'}`}>
                    <input type="radio" value={type} {...register('saleType')} className="hidden" />
                    {type === 'single' ? 'Single Only' : type === 'bulk' ? 'Bulk Only' : 'Both'}
                  </label>
                ))}
              </div>
            </div>

            {saleType !== 'single' && (
              <div className="mt-5 space-y-4 border-t border-grey-light pt-5">
                <Input label="Minimum Order Quantity" type="number" {...register('minOrderQuantity', { valueAsNumber: true })} />
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium uppercase tracking-wide text-grey">Bulk Pricing Tiers</label>
                    <button type="button" onClick={() => bulkTiers.append({ minQty: 10, maxQty: null, pricePerUnit: 0 })} className="link-underline flex items-center gap-1 text-xs text-grey">
                      <Plus className="h-3.5 w-3.5" /> Add Tier
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {bulkTiers.fields.map((field, i) => (
                      <div key={field.id} className="flex items-center gap-2">
                        <input type="number" placeholder="Min qty" {...register(`bulkTiers.${i}.minQty`, { valueAsNumber: true })} className="h-10 w-24 border border-grey-light px-2 text-sm focus:border-gold focus:outline-none" />
                        <span className="text-grey">to</span>
                        <input type="number" placeholder="Max (blank = +)" {...register(`bulkTiers.${i}.maxQty`, { valueAsNumber: true })} className="h-10 w-28 border border-grey-light px-2 text-sm focus:border-gold focus:outline-none" />
                        <span className="text-grey">@ ₦</span>
                        <input type="number" placeholder="Price/unit" {...register(`bulkTiers.${i}.pricePerUnit`, { valueAsNumber: true })} className="h-10 flex-1 border border-grey-light px-2 text-sm focus:border-gold focus:outline-none" />
                        <button type="button" onClick={() => bulkTiers.remove(i)}><Trash2 className="h-4 w-4 text-grey hover:text-status-error" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <p className="section-label">Variants (Size / Color / SKU / Stock)</p>
              <button type="button" onClick={() => variants.append({ size: '', color: '', sku: '', stock: 0, priceOverride: null })} className="link-underline flex items-center gap-1 text-xs text-grey">
                <Plus className="h-3.5 w-3.5" /> Add Variant
              </button>
            </div>
            <p className="mt-1 text-xs text-grey">Leave empty for products without size/color options (uses base stock below instead).</p>
            <div className="mt-4 space-y-2">
              {variants.fields.map((field, i) => (
                <div key={field.id} className="flex flex-wrap items-center gap-2">
                  <input placeholder="Size" {...register(`variants.${i}.size`)} className="h-10 w-20 border border-grey-light px-2 text-sm focus:border-gold focus:outline-none" />
                  <input placeholder="Color" {...register(`variants.${i}.color`)} className="h-10 w-28 border border-grey-light px-2 text-sm focus:border-gold focus:outline-none" />
                  <input placeholder="SKU" {...register(`variants.${i}.sku`)} className="h-10 w-32 border border-grey-light px-2 text-sm focus:border-gold focus:outline-none" />
                  <input type="number" placeholder="Stock" {...register(`variants.${i}.stock`, { valueAsNumber: true })} className="h-10 w-20 border border-grey-light px-2 text-sm focus:border-gold focus:outline-none" />
                  <button type="button" onClick={() => variants.remove(i)}><Trash2 className="h-4 w-4 text-grey hover:text-status-error" /></button>
                </div>
              ))}
            </div>
            {variants.fields.length === 0 && (
              <div className="mt-4">
                <Input label="Base Stock (no variants)" type="number" {...register('stock', { valueAsNumber: true })} />
              </div>
            )}
          </Card>

          <Card className="p-6">
            <p className="section-label mb-4">SEO</p>
            <div className="space-y-4">
              <Input label="Meta Title" {...register('metaTitle')} />
              <Input label="Meta Description" {...register('metaDescription')} />
              <Input label="Size Guide (text or image URL)" {...register('sizeGuide')} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <p className="section-label mb-4">Organize</p>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Category</label>
              <select {...register('category')} className="h-11 w-full border border-grey-light bg-white px-3.5 text-sm focus:border-gold focus:outline-none">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              {errors.category && <p className="mt-1.5 text-xs text-status-error">{errors.category.message}</p>}
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Status</label>
              <select {...register('status')} className="h-11 w-full border border-grey-light bg-white px-3.5 text-sm focus:border-gold focus:outline-none">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="mt-5 space-y-2.5 border-t border-grey-light pt-5">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('isFeatured')} className="h-4 w-4 accent-gold" /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('isNewArrival')} className="h-4 w-4 accent-gold" /> New Arrival</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('isFlashSale')} className="h-4 w-4 accent-gold" /> Flash Sale</label>
              {isFlashSale && (
                <Input label="Flash Discount %" type="number" {...register('flashDiscountPercent', { valueAsNumber: true })} containerClassName="pt-2" />
              )}
            </div>
          </Card>

          <Button type="submit" fullWidth size="lg" loading={creating || updating}>
            {isEdit ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
