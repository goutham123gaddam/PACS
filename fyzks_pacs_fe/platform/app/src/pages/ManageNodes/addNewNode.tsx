import { Button, Card, Form, Input, message, Radio, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUserDetails, makePostCall } from '../../utils/helper';
import './manage-nodes.css';
import { useForm } from 'antd/es/form/Form';

const AddNewNode = () => {
  const [nodeForm] = useForm();
  const [unitsList, setUnitsList] = useState([]);

  useEffect(() => {
    getUnitsList();
  }, []);

  const getUnitsList = () => {
    makePostCall('/units-list')
      .then(res => {
        const units = res.data?.data || [];
        setUnitsList(units);
      })
      .catch(e => {
        message.error('Error while getting units', e.message);
      });
  };

  const onSubmit = () => {
    const { ip, port, aet, name, operations, location, comments } = nodeForm.getFieldsValue();

    const payload = {
      ip,
      port,
      aet,
      name,
      operations,
      location,
      comments,
      user_id: getUserDetails().username,
    };

    makePostCall('/add-modality', payload)
      .then(res => {
        message.success('Added successfully');
        nodeForm.resetFields();
      })
      .catch(e => {
        console.error('Error while adding', e);
        message.error(e.message || 'Something went wrong');
      });
  };

  return (
    <div className="add-node-container">
      <Card title="Add New Node" style={{ width: '600px', margin: '2rem auto' }}>
        <Form form={nodeForm} onFinish={onSubmit}>
          <Form.Item
            name="name"
            label="Node Name"
            rules={[{ required: true, message: 'Please input node name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please select location!' }]}
          >
            <Select
              options={unitsList.map(unit => ({
                label: unit.unit_label,
                value: unit.unit_code,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="ip"
            label="IP Address"
            rules={[{ required: true, message: 'Please input IP address!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="port"
            label="Port"
            rules={[{ required: true, message: 'Please input port!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="aet"
            label="AE Title"
            rules={[{ required: true, message: 'Please input AE title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="operations"
            label="Allowed Operations"
            rules={[{ required: true, message: 'Please select allowed operation!' }]}
          >
            <Radio.Group>
              <Radio value="push">Push</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="comments" label="Comments">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              SUBMIT
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddNewNode;
