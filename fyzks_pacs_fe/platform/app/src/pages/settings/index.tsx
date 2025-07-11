import { Button, Menu, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { AddNewNode, NodeList } from '../ManageNodes';
import AddUser from '../AddUser';
import UserList from '../UserList';
import AddTemplate from '../AddTemplate';
import { NavigationItems } from './constants';
import './settings.css';

const Settings = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('users_list');

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onNavChange = (item) => {
    console.log('onNavChange', item);
    setSelectedMenu(item.key);
  };

  const menuToPage = {
    nodes_list: <NodeList />,
    add_node: <AddNewNode />,
    users_list: <UserList />,
    add_user: <AddUser />,
    add_template: <AddTemplate />,
  };

  return (
    <div className="settings-container h-100">
      <div className="d-flex h-100">
        <div className="side-menu">
          <Tooltip title={collapsed ? 'Expand' : 'Collapse'}>
            <Button
              type="primary"
              className="toggle-btn"
              onClick={toggleCollapsed}
              style={{ marginBottom: 16 }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button>
          </Tooltip>
          <Menu
            defaultSelectedKeys={[selectedMenu]}
            defaultOpenKeys={['users']}
            mode="inline"
            inlineCollapsed={collapsed}
            items={NavigationItems(onNavChange)}
            onClick={onNavChange}
          />
        </div>
        <div className="flex-1 content-area">
          {menuToPage[selectedMenu]}
        </div>
      </div>
    </div>
  );
};

export default Settings;
