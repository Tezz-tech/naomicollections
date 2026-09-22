import { useRef } from 'react';
import toast from 'react-hot-toast';
import { X, Upload, Loader2 } from 'lucide-react';
import { useUploadImages } from '../../features/admin/hooks';

export default function ImageUploader({ images = [], onChange, folder = 'products' }) {
  const inputRef = useRef(null);
  const { mutate: upload, isPending } = useUploadImages();

  function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    upload(
      { files, folder },
      {
        onSuccess: (uploaded) => onChange([...images, ...uploaded]),
        onError: (err) => toast.error(err.response?.data?.message || 'Upload failed. Check Cloudinary credentials.'),
      }
    );
    e.target.value = '';
  }

  function removeImage(idx) {
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img, i) => (
          <div key={img.publicId || img.url || i} className="group relative aspect-square overflow-hidden bg-offwhite">
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 border border-dashed border-grey-light text-grey transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span className="text-[10px] uppercase tracking-wide">{isPending ? 'Uploading' : 'Add Image'}</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
    </div>
  );
}
