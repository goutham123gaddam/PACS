import { Button, Row, Col, Spin, Form, Card, Radio, Table, message } from 'antd';
import { calculateExactAge, getUserDetails, makePostCall } from '../../utils/helper';
import React, { useEffect, useMemo, useState } from 'react';
import TextArea from 'antd/es/input/TextArea';
import { MedicineBoxOutlined, UserOutlined, FileTextOutlined, AlertOutlined } from '@ant-design/icons';
import './order-info.scss';

const OrderInfoPopup = ({ data, closeModal, refreshTable }) => {

  const patInfo = data?.pacs_order?.patient;
  const ordInfo = data?.pacs_order;

  const [scans, setScans] = useState({ data: [], loading: false });
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [physicianNotes, setPhysicianNotes] = useState('');
  const [priority, setPriority] = useState('NORMAL');

  useEffect(() => {
    if (ordInfo?.po_his_ord_no) {
      fetchAllScans(ordInfo.po_his_ord_no);
    }
  
    if (ordInfo?.po_priority) {
      setPriority(ordInfo.po_priority);
    }
  }, [ordInfo]);

  const fetchAllScans = async (ordNo) => {
    // fetch scans from API
    await makePostCall('/get-all-scans', { his_ord_no: ordNo }).then((res) => {
      setScans({ data: res.data.data, loading: false });
    }).catch((err) => {
      setScans({ data: [], loading: false });
    });
  }

  const scanColumns = [
    {
      title: 'Modality',
      dataIndex: 'po_modality',
    },
    {
      title: 'Item Code',
      dataIndex: 'po_diag_no'
    },
    {
      title: 'Description',
      dataIndex: 'po_diag_desc',
    },
    {
      title: 'Acc No',
      dataIndex: 'po_acc_no',
    },
    {
      title: 'Status',
      render: (itm, rec) => (
        <span>
          {rec?.order_workflow?.ow_pacs_status}
        </span>
      )
    }
  ];

  const handlePriorityChange = (e) => {
    setPriority(e.target.value);
  }

  const checkButtonEnable = useMemo(() => {
    const prevPriority = ordInfo.po_priority || 'NORMAL';
    if (!!clinicalNotes && clinicalNotes.length > 0 ||
      !!physicianNotes && physicianNotes.length > 0 ||
      (priority !== prevPriority)
    ) {
      return false
    } else {
      return true
    }
  }, [priority, clinicalNotes, physicianNotes]);

  const handleSubmit = async () => {
    const prevPriority = ordInfo.po_priority || 'NORMAL';
    const priorityChanged = priority !== prevPriority;
  
    let success = false;
  
    try {
      if (priorityChanged) {
        const payload = {
          his_ord_id: ordInfo.po_his_ord_no,
          priority: priority,
        };
        await makePostCall('/update-his-order-priority', payload);
        message.success("Priority updated successfully");
        success = true;
      }
  
      if (!!clinicalNotes || !!physicianNotes) {
        const formData = new FormData();
        const orderIds = scans?.data?.map(itm => itm.pacs_ord_id);
        formData.append('order_ids', orderIds.join(','));
        formData.append('pin', data?.pacs_order?.patient?.pat_pin);
        formData.append('type', 'notes');
        formData.append('notes', clinicalNotes);
        formData.append('user_id', getUserDetails()?.username);
  
        await makePostCall('/upload-notes', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
  
        message.success("Notes added successfully");
        success = true;
      }
  
      if (success) {
        refreshTable?.();
        closeModal?.();
      }
    } catch (e) {
      message.error('Something went wrong');
      console.error("Error during update", e);
    }
  };
  

  return (
    <div className='order-info-container'>
      <Card title={<span><UserOutlined /> Patient Information</span>} style={{ marginBottom: 16 }}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <b>Name:</b> {patInfo?.pat_name}
          </Col>
          <Col span={12}>
            <b>ID:</b> {patInfo?.pat_pin}
          </Col>
          <Col span={12}>
            <b>Age:</b> {calculateExactAge(patInfo?.pat_dob)}
          </Col>
          <Col span={12}>
            <b>Gender:</b> {patInfo?.pat_sex}
          </Col>
        </Row>
      </Card>

      <Card title={<span><MedicineBoxOutlined /> Order Information</span>}>
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <b>Order No:</b> {ordInfo?.po_his_ord_no}
          </Col>
          <Col span={12}>
            <b>Site:</b> {data?.pacs_order?.po_site || 'SOMAJIGUDA'}
          </Col>
          <Col span={24}>
            <b>Priority:</b>
            <Radio.Group onChange={handlePriorityChange} value={priority} style={{ marginLeft: 12 }}>
              <Radio value="NORMAL">Normal</Radio>
              <Radio value="EMERGENCY">Emergency</Radio>
              <Radio value="ASAP">ASAP</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <div className='mt-3'>
          <Table
            columns={scanColumns}
            dataSource={scans?.data}
            pagination={false}
          />
        </div>

        <div className='separator'></div>

        <div className='mt-2'>
          <span>Clinical Notes</span>
          <TextArea onChange={(e) => {
            setClinicalNotes(e.target.value);
          }} />
        </div>

        {/* <div className='mt-2'>
          <span>Physician Notes</span>
          <TextArea onChange={(e) => {
            setPhysicianNotes(e.target.value);
          }} />
        </div> */}

        <div className='text-center mt-2'>
          <Button type='primary' disabled={checkButtonEnable} onClick={handleSubmit} >UPDATE INFO</Button>
        </div>
      </Card>
    </div>
  )
}

export default OrderInfoPopup;
