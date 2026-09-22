import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useVerifyEmail } from '../../features/auth/hooks';
import { Button } from '../../components/ui';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { mutate, isPending, isSuccess, isError } = useVerifyEmail();
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if (token && !attempted) {
      setAttempted(true);
      mutate(token);
    }
  }, [token, attempted, mutate]);

  if (!token) {
    return <p className="text-center text-sm text-grey">No verification token provided.</p>;
  }

  return (
    <div className="text-center">
      {isPending && <Loader2 className="mx-auto h-10 w-10 animate-spin text-gold" />}
      {isSuccess && (
        <>
          <CheckCircle2 className="mx-auto h-10 w-10 text-status-success" />
          <h1 className="mt-4 font-serif text-2xl">Email Verified</h1>
          <p className="mt-2 text-sm text-grey">Your account is now fully active.</p>
        </>
      )}
      {isError && (
        <>
          <XCircle className="mx-auto h-10 w-10 text-status-error" />
          <h1 className="mt-4 font-serif text-2xl">Verification Failed</h1>
          <p className="mt-2 text-sm text-grey">This link is invalid or has expired.</p>
        </>
      )}
      <Button as={Link} to="/account" className="mt-6">
        Go to My Account
      </Button>
    </div>
  );
}
