import React, { ReactNode, ComponentType } from 'react';

import ErrorMessage from './error-message';
import Spinner from './spinner';

interface Props {
  loading: boolean;
  error: Error | null;
  children?: ReactNode | ReactNode[];
  loader?: ComponentType<any>;
}

export default function Loading({ loading, error, children, loader = Spinner }: Props) {
  if (loading) {
    const Loader = loader;
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return <>{children}</>;
}
