import {
  Button,
  Card,
  message,
  Popconfirm,
  Spin,
  Table,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getUserDetails,
  makeGetCall,
  makePostCall,
} from '../../utils/helper';
import './manage-nodes.css';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import EditNode from './EditNode'; // Modal for editing modality

const ModalityList = () => {
  const [modalityList, setModalityList] = useState({ loading: true, data: [] });
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedModality, setSelectedModality] = useState(null);
  const [unitsList, setUnitsList] = useState([]);
  const [unitsMapping, setUnitsMapping] = useState({});

  useEffect(() => {
    fetchModalities();
    fetchUnits();
  }, []);

  const fetchModalities = () => {
    makeGetCall('/get-modality-list')
      .then(res => {
        setModalityList({ data: res.data?.data || [], loading: false });
      })
      .catch(e => {
        message.error('Error fetching modalities');
        setModalityList({ loading: false, data: [] });
      });
  };

  const fetchUnits = () => {
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
        message.error('Error while getting units');
      });
  };

  const deleteModality = (node) => {
    setDeleteInProgress(true);
    makePostCall('/delete-modality', { en_id: node.en_id })
      .then(res => {
        if (res.data?.success) {
          message.success('Modality deleted successfully');
          fetchModalities();
        } else {
          message.error(res.data?.message || 'Failed to delete modality');
        }
        setDeleteInProgress(false);
      })
      .catch(e => {
        message.error('Error deleting modality');
        setDeleteInProgress(false);
      });
  };

  const openEditModal = (record) => {
    setSelectedModality(record);
    setEditModalVisible(true);
  };

  const handleEditSubmit = (updatedData) => {
    makePostCall('/add-modality', {
      ...updatedData,
      user_id: getUserDetails().username,
    })
      .then(res => {
        if (res.data?.success) {
          message.success('Modality updated successfully');
          setEditModalVisible(false);
          fetchModalities();
        } else {
          message.error(res.data?.message || 'Failed to update');
        }
      })
      .catch(err => {
        message.error('Error updating modality');
      });
  };

  const COLUMNS = [
    { title: 'Name', dataIndex: 'en_node_name' },
    { title: 'IP', dataIndex: 'en_ip_address' },
    { title: 'Port', dataIndex: 'en_port' },
    { title: 'AE Title', dataIndex: 'en_ae_title' },
    {
      title: 'Location',
      dataIndex: 'en_location',
      render: (val) => unitsMapping[val] || 'NA',
    },
    { title: 'Operations', dataIndex: 'en_operations' },
    { title: 'Comments', dataIndex: 'en_comments' },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="d-flex gap-2">
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Delete modality?"
            onConfirm={() => deleteModality(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="nodes-list">
      <Spin spinning={modalityList.loading || deleteInProgress}>
        <Card
          bordered={false}
          title={<div className="page-title">MODALITIES</div>}
          style={{ width: '100%', margin: '2rem auto' }}
        >
          <Table
            className="nodes-list-table"
            columns={COLUMNS}
            dataSource={modalityList.data}
            rowKey="en_id"
          />
        </Card>
      </Spin>

      <EditNode
        visible={editModalVisible}
        nodeData={selectedModality}
        onCancel={() => setEditModalVisible(false)}
        onSubmit={handleEditSubmit}
        unitsList={unitsList}
      />
    </div>
  );
};

export default ModalityList;
