'use client';

import { List, Typography, Button, Badge } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api';

const { Title, Text } = Typography;

export default function Notifications() {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications'),
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Notifications</Title>
        <Button onClick={() => markAllAsReadMutation.mutate()}>Mark all as read</Button>
      </div>

      <List
        loading={isLoading}
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item: any) => (
          <List.Item
            actions={[
              !item.read && (
                <Button type="link" onClick={() => markAsReadMutation.mutate(item.id)}>
                  Mark as read
                </Button>
              ),
            ]}
          >
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {!item.read && <Badge status="processing" style={{ marginRight: 8 }} />}
                  <Text strong={!item.read}>{item.message}</Text>
                </div>
              }
              description={new Date(item.createdAt).toLocaleString()}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
