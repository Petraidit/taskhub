'use client';

import { Typography, Card, Switch, Form, Select, Button } from 'antd';

const { Title } = Typography;

export default function Settings() {
  return (
    <div>
      <Title level={2} style={{ marginBottom: 24 }}>Settings</Title>
      <Card title="Preferences" style={{ maxWidth: 600 }}>
        <Form layout="vertical">
          <Form.Item label="Email Notifications" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
          <Form.Item label="Theme">
            <Select defaultValue="light">
              <Select.Option value="light">Light</Select.Option>
              <Select.Option value="dark">Dark</Select.Option>
              <Select.Option value="system">System</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary">Save Changes</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
