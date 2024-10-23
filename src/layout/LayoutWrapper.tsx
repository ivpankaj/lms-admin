import React from 'react';
import { useLocation } from 'react-router-dom';
import DefaultLayout from './DefaultLayout';

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Define paths that should not use the DefaultLayout
  const noLayoutPaths = ['/auth/signin'];

  const useDefaultLayout = !noLayoutPaths.includes(location.pathname);

  return useDefaultLayout ? (
    <DefaultLayout>{children}</DefaultLayout>
  ) : (
    <>{children}</>
  );
};

export default LayoutWrapper;
