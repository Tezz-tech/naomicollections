import { motion } from 'framer-motion';
import Seo from '../Seo';
import { Divider } from '../ui';

export default function LegalPage({ title, updatedAt, children }) {
  return (
    <div className="container-luxury py-16">
      <Seo title={title} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <Divider label="Naomi's Collections" />
        <h1 className="mt-4 text-center font-serif text-3xl sm:text-4xl">{title}</h1>
        {updatedAt && <p className="mt-2 text-center text-xs text-grey">Last updated {updatedAt}</p>}

        <div className="prose-sm mt-12 space-y-6 text-sm leading-relaxed text-grey [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:text-black [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
