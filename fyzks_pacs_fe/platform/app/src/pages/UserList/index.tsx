import { Button, Card, message, Popconfirm, Spin, Table } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getUserDetails, makePostCall } from '../../utils/helper';
import './user-list.css';
import EditUser from './EditUser';
import DateFormatter from '../../components/DateFormatter';

const UserList = () => {
  const [unitsList, setUnitsList] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [usersList, setUsersList] = useState({ data: [], loading: false });
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [unitsMapping, setUnitsMapping] = useState({});

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    getUnitsList();
    getPermissionsList();
    getRolesList();
    getUsersList();
  }, []);

  const getUsersList = () => {
    setUsersList({ loading: true, data: [] });
    makePostCall('/user-list', {})
      .then(res => {
        setUsersList({ data: res.data?.data || [], loading: false });
      })
      .catch(e => {
        setUsersList({ data: [], loading: false });
        message.error('Error while getting users', e.message);
      });
  };

  const getUnitsList = () => {
    makePostCall('/units-list')
      .then(res => {
        const units = res.data?.data || [];
        setUnitsList(units);

        const mapping = units.reduce((acc, unit) => {
          acc[unit.unit_code] = unit.unit_label;
          return acc;
        }, {});
        setUnitsMapping(mapping);
      })
      .catch(e => {
        message.error('Error while getting units', e.message);
      });
  };

  const getPermissionsList = () => {
    makePostCall('/permissions-list')
      .then(res => {
        setPermissionsList(res.data?.data || []);
      })
      .catch(e => {
        message.error('Error while getting permissions', e.message);
      });
  };

  const getRolesList = () => {
    makePostCall('/roles-list')
      .then(res => {
        setRolesList(res.data?.data || []);
      })
      .catch(e => {
        message.error('Error while getting roles', e.message);
      });
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleUserEditSubmit = (updatedData) => {
    makePostCall('/add-user', {
      ...updatedData,
      user_id: getUserDetails().username,
    })
      .then(res => {
        if (res.data?.success) {
          message.success('User updated successfully');
          setEditModalVisible(false);
          getUsersList();
        } else {
          message.error(res.data?.message || 'Failed to update user');
        }
      })
      .catch(err => {
        message.error(err.message || 'Failed to update user');
      });
  };

  const deleteUser = (usr) => {
    setDeleteInProgress(true);
    makePostCall('/deactivate-user', { username: usr.username })
      .then(res => {
        if (res.data?.success) {
          message.success('User deleted successfully');
          getUsersList();
        } else {
          message.error(res.data?.message || 'Failed to delete user');
        }
        setDeleteInProgress(false);
      })
      .catch(e => {
        message.error(e || 'Something went wrong');
        setDeleteInProgress(false);
      });
  };

  const USER_COLUMNS = [
    {
      title: 'Full Name',
      key: 'fullname',
      render: (_, record) => {
        return record.first_name
          ? `${record.first_name} ${record.last_name || ''}`
          : record.user_fullname;
      },
    },
    {
      title: 'Login',
      key: 'login',
      render: (_, record) => `${record.username}`,
    },
    {
      title: 'Profile',
      key: 'profile',
      render: (_, record) => `${record.user_type || 'NA'}`,
    },
    {
      title: 'Site Name',
      key: 'sitename',
      render: (_, record) => unitsMapping[record.user_unit_name] || 'NA',
    },
    {
      title: 'Created Date',
      key: 'created_dt',
      render: (_, record) => <DateFormatter date={record.user_created_dt} />,
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <div>
          <Button
            onClick={() => editUser(record)}
            style={{ marginRight: '3px' }}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title={'Delete user?'}
            onConfirm={() => deleteUser(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={usersList?.loading || deleteInProgress}>
      <div className="users-container">
        <div>
          <Card
            bordered={false}
            title={<div className="page-title">USERS</div>}
            style={{ width: '100%', margin: '2rem auto' }}
          >
            <Table
              className="user-list-table"
              columns={USER_COLUMNS}
              dataSource={usersList?.data}
              rowKey={(record) => record.username}
            />
          </Card>
        </div>
      </div>

      <EditUser
        visible={editModalVisible}
        userData={selectedUser}
        unitsList={unitsList}
        rolesList={rolesList}
        onCancel={() => setEditModalVisible(false)}
        onSubmit={handleUserEditSubmit}
      />
    </Spin>
  );
};

export default UserList;
