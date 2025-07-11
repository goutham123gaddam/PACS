import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import './user-list.css';

const { Option } = Select;

type EditUserModalProps = {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  userData: any; // You can create a User type for stricter typing
  unitsList?: string[];
  rolesList?: string[];
};

const EditUser: React.FC<EditUserModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  userData,
  unitsList = [],
  rolesList = [],
}) => {
  const [form] = Form.useForm();
  const [formChanges, setFormChanges] = useState({});

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        user_firstname: userData.user_firstname,
        user_lastname: userData.user_lastname,
        username: userData.username,
        user_email: userData.user_email,
        user_mobile: userData.user_mobile,
        user_type: userData.user_type,
        user_unit_name: userData.user_unit_name,
        user_designation: userData.user_designation,
        user_degree: userData.user_degree,
        user_password: '',
        confirmPassword: '',
      });
    }
  }, [userData, form]);

  const onFieldsChange = (changedFields, allFields) => {
    const changes = {};
    changedFields.forEach(field => {
      const fieldName = field.name[0];
      const fieldValue = field.value;
      if (fieldValue !== userData[fieldName]) {
        changes[fieldName] = fieldValue;
      }
    });
    setFormChanges(prev => ({ ...prev, ...changes }));
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const changedValues = {
        ...formChanges,
        existing_user_id: userData.user_id,
      };
      onSubmit(changedValues);
    });
  };

  return (
    <Modal
      open={visible}
      title="Edit User"
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
      width={700}
      // height={600}
      className="edit-user-modal"
    >
      <Form
        layout="vertical"
        form={form}
        onFieldsChange={onFieldsChange}
        className="edit-user-modal__form"
      >
        <div className="edit-user-modal__form-row">
          <Form.Item
            className="edit-user-modal__form-item"
            label="First Name"
            name="user_firstname"
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="edit-user-modal__form-item"
            label="Last Name"
            name="user_lastname"
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="edit-user-modal__form-item"
            label="Username"
            name="username"
          >
            <Input />
          </Form.Item>
        </div>

        <div className="edit-user-modal__form-row">
          <Form.Item
            className="edit-user-modal__form-item"
            label="Create New Password"
            name="user_password"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            className="edit-user-modal__form-item"
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('user_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            className="edit-user-modal__form-item"
            label="Email"
            name="user_email"
          >
            <Input type="email" />
          </Form.Item>
        </div>

        <div className="edit-user-modal__form-row">
          <Form.Item
            className="edit-user-modal__form-item"
            label="user_mobile"
            name="user_mobile"
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="edit-user-modal__form-item"
            label="Profile"
            name="user_type"
          >
            <Select placeholder="Select Role">
              {rolesList?.map(role => (
                <Option
                  key={role.role_code}
                  value={role.role_code}
                >
                  {role.role_label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            className="edit-user-modal__form-item"
            label="Location"
            name="user_unit_name"
          >
            <Select placeholder="Select Unit">
              {unitsList?.map(unit => (
                <Option
                  key={unit.unit_code}
                  value={unit.unit_code}
                >
                  {unit.unit_label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="edit-user-modal__form-row">
          <Form.Item
            className="edit-user-modal__form-item"
            label="Designation"
            name="user_designation"
          >
            <Input />
          </Form.Item>
          <Form.Item
            className="edit-user-modal__form-item"
            label="Degree"
            name="user_degree"
          >
            <Input />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default EditUser;
