import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Radio } from 'antd'

type EditNodeModalProps = {
  visible: boolean;
  onCancel: () => void;
  onSubmit?: (values: any) => void;
  nodeData: any;
  unitsList?: Array<any>;
}

const EditNode: React.FC<EditNodeModalProps> = ({ visible, onCancel, onSubmit, nodeData, unitsList }) => {
  const [form] = Form.useForm();
  const [formChanges, setFormChanges] = useState({});

  useEffect(() => {
    if (nodeData) {
      form.setFieldsValue({
        name: nodeData.en_node_name,
        ip: nodeData.en_ip_address,
        port: nodeData.en_port,
        aet: nodeData.en_ae_title,
        location: nodeData.en_location,
        operations: nodeData.en_operations,
        comments: nodeData.en_comments,
      });
    }
  }, [nodeData, form]);

  const onFieldsChange = (changedFields, allFields) => {
    const changes = {};
    changedFields.forEach(field => {
      const fieldName = field.name[0];
      const fieldValue = field.value;
      if (fieldValue !== nodeData[fieldName]) {
        changes[fieldName] = fieldValue;
      }
    });
    setFormChanges(prev => ({ ...prev, ...changes }));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const changedValues = {
        ...formChanges,
        en_id: nodeData.en_id,
      };
      onSubmit?.(changedValues);
    });
  };

  return (
    <Modal
      open={visible}
      title="Edit Node"
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
      width={700}
      className="edit-node-modal"
    >
      <Form
        layout="vertical"
        form={form}
        onFieldsChange={onFieldsChange}
      >
        <div className='edit-node-modal__form-row'>
          <Form.Item
            className="edit-node-modal__form-item"
            label="Node Name"
            name="name"
            rules={[{ required: true, message: 'Please enter node name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="IP Address"
            className="edit-node-modal__form-item"
            name="ip"
            rules={[{ required: true, message: 'Please enter IP address' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Port"
            name="port"
            className="edit-node-modal__form-item"
            rules={[{ required: true, message: 'Please enter port' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="AE Title"
            name="aet"
            className="edit-node-modal__form-item"
            rules={[{ required: true, message: 'Please enter AE title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            className="edit-node-modal__form-item"
          >
            <Select options={unitsList?.map(itm => ({
              label: itm.unit_label,
              value: itm.unit_code
            }))} />
          </Form.Item>

          <Form.Item
            label="Operations"
            name="operations"
            className="edit-node-modal__form-item"
          >
            <Radio.Group >
              <Radio value={"push"}>push</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Comments"
            name="comments"
            className="edit-node-modal__form-item"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EditNode
