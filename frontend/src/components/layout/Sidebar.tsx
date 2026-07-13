'use client';

import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  ProjectOutlined, 
  CheckSquareOutlined, 
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';

const { Sider } = Layout;

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/projects', icon: <ProjectOutlined />, label: 'Projects' },
    { key: '/tasks', icon: <CheckSquareOutlined />, label: 'Tasks' },
    { key: '/profile', icon: <UserOutlined />, label: 'Profile' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  return (
    <Sider width={250} theme="dark" style={{ height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, borderRight: '1px solid #27272A' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5E6AD2', fontSize: 20, fontWeight: 'bold', borderBottom: '1px solid #27272A' }}>
        Kybern TaskHub
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
        onClick={({ key }) => router.push(key)}
        style={{ marginTop: 16 }}
      />
    </Sider>
  );
}
