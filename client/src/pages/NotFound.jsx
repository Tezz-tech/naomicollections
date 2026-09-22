import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Divider } from '../components/ui';

export default function NotFound() {
  return (
    <div className="container-luxury flex flex-col items-center justify-center py-32 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="font-serif text-8xl text-gold">404</p>
        <Divider label="Page Not Found" className="mt-6" />
        <h1 className="mt-4 font-serif text-2xl">This page doesn't exist — or isn't ready yet.</h1>
        <p className="mt-2 text-sm text-grey">Let's get you back to something curated.</p>
        <Button as={Link} to="/" className="mt-8">
          Back to Home
        </Button>
      </motion.div>
    </div>
  );
}
