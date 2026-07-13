'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ConfigProvider, App, theme } from 'antd';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: '#5E6AD2',
            colorBgBase: '#0F0F10',
            colorBgContainer: '#18181A',
            colorBgElevated: '#212124',
            colorBorder: '#27272A',
            colorTextBase: '#F2F2F2',
            borderRadius: 6,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          },
          components: {
            Layout: {
              headerBg: '#0F0F10',
              siderBg: '#0F0F10',
              bodyBg: '#0F0F10',
            },
            Menu: {
              darkItemBg: '#0F0F10',
            }
          }
        }}
      >
        <App>
          <AuthProvider>
            {children}
          </AuthProvider>
        </App>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
