import React, { useCallback, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/router';
import { PlaidLinkOnSuccess, usePlaidLink } from 'react-plaid-link';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';

interface PlaidLinkProps {
  user: any;
  variant: string;
}

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    setIsClient(true);
    const getLinkToken = async () => {
       const data = await createLinkToken(user);
       setToken(data?.linkToken);
    };
    getLinkToken();
  }, [user]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
     await exchangePublicToken({
       publicToken: public_token,
       user,
     });
    if (isClient) {
      const router = useRouter();
      router.push('/');
    }
  }, [user, isClient]);

  const config = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  if (!isClient) {
    return null; // or a loading spinner, or some fallback UI
  }

  return (
    <>
      {variant === 'primary' ? (
        <Button onClick={() => open()} disabled={!ready} className="plaidlink-primary">
          Connect bank
        </Button>
      ) : (
        <Button>Connect bank</Button>
      )}
    </>
  );
};

export default PlaidLink;
