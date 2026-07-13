'use client';

import { Layout } from 'antd';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

const { Content } = Layout;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 250 }}>
        <TopNav />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#18181A', border: '1px solid #27272A', borderRadius: 8, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
