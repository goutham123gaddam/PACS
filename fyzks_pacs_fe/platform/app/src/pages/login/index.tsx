import React, { useEffect, useState } from "react";
import { Button, Card, Form, Input, Typography, Alert, Spin } from "antd";
import { UserOutlined, LockOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_API } from "../../axios";
import { setAccessToken, setUserDetails } from "../../utils/helper";
import backgroundImage from "./radiology.jpg"; // Import the background image
import "./login.css";

const { Title, Text } = Typography;

const Login = () => {
  const [loginForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("user_details")) {
      window.location.href = "/";
    }
  }, []);

  const onFinish = () => {
    setLoading(true);
    setError(null);

    const { username, password } = loginForm.getFieldsValue();

    axios.post(BASE_API + "/login", {
      username,
      password: password.toUpperCase(),
    })
      .then(res => {
        const resp_data = res?.data?.data;
        if (resp_data) {
          setUserDetails(resp_data.user_details);
          setAccessToken(resp_data.access_token);
          window.location.href = "/";
        }
      })
      .catch(e => {
        console.log("error", e);
        setError("Invalid username or password. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="login-container">
        <Card
          className="login-card"
          bordered={false}
          bodyStyle={{ padding: "40px" }}
        >
          <div className="login-logo">
            <MedicineBoxOutlined className="logo-icon" />
          </div>

          <Title level={2} className="login-title">
            PACS System Login
          </Title>

          <Text type="secondary" className="login-subtitle">
            Enter your credentials to access the system
          </Text>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="login-alert"
            />
          )}

          <Form
            form={loginForm}
            onFinish={onFinish}
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please input your username",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your password",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                size="large"
              />
            </Form.Item>

            <Form.Item className="login-actions">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className="login-button"
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </Form.Item>

            <div className="login-footer">
              <Text type="secondary">
                Trouble logging in? Contact IT support.
              </Text>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
