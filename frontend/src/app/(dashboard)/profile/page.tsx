'use client';

import { Card, Typography, Avatar, Descriptions, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { useAuth } from '../../../context/AuthContext';

const { Title } = Typography;

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>Profile</Title>
      
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginRight: 16 }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>{user?.firstName} {user?.lastName}</Title>
            <Typography.Text type="secondary">{user?.role}</Typography.Text>
          </div>
          <Button icon={<EditOutlined />} style={{ marginLeft: 'auto' }}>Edit Profile</Button>
        </div>
        
        <Descriptions title="User Info" bordered column={1}>
          <Descriptions.Item label="First Name">{user?.firstName}</Descriptions.Item>
          <Descriptions.Item label="Last Name">{user?.lastName}</Descriptions.Item>
          <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
          <Descriptions.Item label="Role">{user?.role}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
