import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Divider } from '../ui';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md border border-grey-light bg-white p-8 sm:p-10"
      >
        <Link to="/" className="mx-auto flex w-fit items-center gap-2.5">
          <img src="/logo-mark.png" alt="" className="h-10 w-auto" />
          <span className="leading-none">
            <span className="block font-serif text-lg tracking-wide">NAOMI'S</span>
            <span className="block text-[9px] font-medium tracking-widest2 text-gold">COLLECTIONS</span>
          </span>
        </Link>
        <div className="mt-6">
          <Divider />
        </div>
        <div className="mt-8">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}
