'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, Tag, Typography, Spin, Button, Space, Popconfirm, App } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

const { Title, Text } = Typography;

const COLUMNS = [
  { id: 'Todo', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Review', title: 'Review' },
  { id: 'Done', title: 'Done' },
];

export function KanbanBoard({ onEditTask }: { onEditTask: (task: any) => void }) {
  const [mounted, setMounted] = useState(false);
  const queryClient = useQueryClient();
  const { message } = App.useApp();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      api.patch(`/tasks/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      message.success('Task deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to delete task');
    }
  });

  const [boardData, setBoardData] = useState<Record<string, any[]>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (tasks) {
      const newBoard: Record<string, any[]> = {
        Todo: [],
        'In Progress': [],
        Review: [],
        Done: [],
      };
      
      tasks.forEach((task: any) => {
        if (newBoard[task.status]) {
          newBoard[task.status].push(task);
        }
      });
      setBoardData(newBoard);
    }
  }, [tasks]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = boardData[source.droppableId];
    const destColumn = boardData[destination.droppableId];
    
    const task = sourceColumn[source.index];
    
    // Optimistic UI update
    const newSourceColumn = Array.from(sourceColumn);
    newSourceColumn.splice(source.index, 1);
    
    const newDestColumn = Array.from(destColumn);
    newDestColumn.splice(destination.index, 0, { ...task, status: destination.droppableId });

    setBoardData({
      ...boardData,
      [source.droppableId]: newSourceColumn,
      [destination.droppableId]: newDestColumn,
    });

    // API call
    if (source.droppableId !== destination.droppableId) {
      updateStatusMutation.mutate({ id: draggableId, status: destination.droppableId });
    }
  };

  if (!mounted || isLoading) return <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 16 }}>
        {COLUMNS.map(col => (
          <div key={col.id} style={{ flex: '0 0 300px', background: '#212124', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0 }}>{col.title}</Title>
              <Tag>{boardData[col.id]?.length || 0}</Tag>
            </div>
            
            <Droppable droppableId={col.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ minHeight: 200 }}
                >
                  {boardData[col.id]?.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            marginBottom: 16,
                            cursor: 'grab',
                            boxShadow: snapshot.isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
                            ...provided.draggableProps.style
                          }}
                          size="small"
                          actions={[
                            <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => onEditTask(task)} />,
                            <Popconfirm
                              key="delete"
                              title="Delete task?"
                              onConfirm={() => deleteMutation.mutate(task.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button type="text" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                          ]}
                        >
                          <div style={{ marginBottom: 8 }}>
                            <Text strong>{task.title}</Text>
                          </div>
                          <div>
                            <Tag color={
                              task.priority === 'High' || task.priority === 'Critical' ? 'red' : 
                              task.priority === 'Medium' ? 'orange' : 'green'
                            }>{task.priority}</Tag>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
