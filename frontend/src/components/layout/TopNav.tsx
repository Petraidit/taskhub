'use client';

import { Layout, Dropdown, Avatar, Input, Badge, Space } from 'antd';
import { UserOutlined, BellOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const { Header } = Layout;

export function TopNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const items = [
    { key: 'profile', label: 'Profile', icon: <UserOutlined />, onClick: () => router.push('/profile') },
    { type: 'divider' as const },
    { key: 'logout', label: 'Logout', icon: <LogoutOutlined />, onClick: logout },
  ];

  return (
    <Header style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #27272A' }}>
      <div style={{ width: 300 }}>
        <Input placeholder="Search projects, tasks..." prefix={<SearchOutlined />} style={{ borderRadius: 4 }} />
      </div>
      <Space size="large">
        <Badge count={5} size="small" onClick={() => router.push('/notifications')} style={{ cursor: 'pointer' }}>
          <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
        </Badge>
        <Dropdown menu={{ items }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
            <span>{user?.firstName} {user?.lastName}</span>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
}
