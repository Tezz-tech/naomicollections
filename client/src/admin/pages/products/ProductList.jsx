import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useProducts, useDeleteProduct } from '../../../features/products/hooks';
import { useCategories } from '../../../features/categories/hooks';
import { Badge, Button, Input, Skeleton } from '../../../components/ui';
import Pagination from '../../../components/shop/Pagination';
import { formatNaira } from '../../../lib/format';
import { getTotalStock } from '../../../lib/pricing';

export default function ProductList() {
  const [filters, setFilters] = useState({ page: 1, search: '', category: '', status: '' });
  const { data, isLoading } = useProducts({ ...filters, limit: 15 });
  const { data: categories = [] } = useCategories(true);
  const { mutate: deleteProduct } = useDeleteProduct();

  function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    deleteProduct(id, {
      onSuccess: () => toast.success('Product deleted.'),
      onError: (err) => toast.error(err.response?.data?.message || 'Could not delete product.'),
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl">Products</h1>
          <p className="mt-1 text-sm text-grey">{data?.pagination?.total ?? 0} total</p>
        </div>
        <Button as={Link} to="/admin/products/new">
          <Plus className="h-4 w-4" /> New Product
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey" />
          <Input
            placeholder="Search products..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
          />
        </div>
        <select
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, page: 1 }))}
          className="h-11 border border-grey-light bg-white px-3 text-sm focus:border-gold focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))}
          className="h-11 border border-grey-light bg-white px-3 text-sm focus:border-gold focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto border border-grey-light">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-offwhite text-left text-xs uppercase tracking-wide text-grey">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Sale Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-grey-light">
                    <td className="px-4 py-3" colSpan={7}><Skeleton className="h-6 w-full" /></td>
                  </tr>
                ))
              : data?.products?.map((p) => (
                  <tr key={p._id} className="border-t border-grey-light">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]?.url} alt="" className="h-10 w-10 object-cover" />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-grey">{p.category?.name}</td>
                    <td className="px-4 py-3">{formatNaira(p.basePrice)}</td>
                    <td className="px-4 py-3">{getTotalStock(p)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.saleType === 'single' ? 'outline' : 'gold'}>{p.saleType}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === 'published' ? 'success' : 'outline'}>{p.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link to={`/admin/products/${p._id}`} aria-label="Edit"><Pencil className="h-4 w-4 text-grey hover:text-black" /></Link>
                        <button onClick={() => handleDelete(p._id, p.name)} aria-label="Delete"><Trash2 className="h-4 w-4 text-grey hover:text-status-error" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={data?.pagination?.page || 1}
        pages={data?.pagination?.pages || 1}
        onChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  );
}
