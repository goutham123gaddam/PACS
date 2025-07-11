import { Tag, Button, Upload, Tooltip } from "antd";
import React from "react";
import { FileOutlined, FileTextOutlined, PrinterOutlined, UploadOutlined } from '@ant-design/icons';
import { calculateExactAge, ConvertStringToDate, getUserDetails } from "../../utils/helper";
import moment from 'moment';

const statusColors = {
  'PENDING': 'red',
  'DRAFTED': 'orange',
  'REPORT_SUBMITTED': 'yellow',
  'SIGNEDOFF': 'green',
  'REVIEWED': 'blue',
};

export const orderColumns = ({ openReportEditor, role, addFile, viewNotes, printReport, captureReceiver }) => {
  const userDetails = getUserDetails();

  return ([
    {
      dataIndex: "po_pat_name",
      title: "Patient Name",
      render: (text, record) => {
        return (
          <div>
            <Button
              color="blue"
              className="ms-1auto d-flex align-items-center ph-0"
              type="link"
            >
              <Tooltip title={record.pacs_order?.patient?.pat_name}>
                <span className="whitespace-normal">
                  {record.pacs_order?.patient?.pat_name}
                </span>
              </Tooltip>
            </Button>
          </div>
        )
      },
      width: 200
    },
    {
      dataIndex: "po_diag_desc",
      title: "Study Desc.",
      width: 200,
      render: (txt, rec) => {
        return (
          <Tooltip
            title={rec.pacs_order?.po_priority}
          >
            <span>
              {rec?.pacs_order?.po_diag_desc}
            </span>
          </Tooltip>
        )
      },
    },
    {
      dataIndex: "po_pin",
      title: "Pat. ID",
      width: 130,
      render: (text, rec) => rec?.pacs_order?.patient?.pat_pin
    },
    {
      dataIndex: "po_ord_no",
      title: "Order No",
      width: 100,
      render: (text, rec) => rec?.pacs_order?.po_his_ord_no
    },
    {
      dataIndex: "po_acc_no",
      title: "Acc. No",
      width: 100,
      render: (text, rec) => rec?.pacs_order?.po_acc_no
    },
    {
      dataIndex: "po_pat_age",
      title: "Pat. Age",
      width: 80,
      render: (val, record) => {
        return calculateExactAge(record.pacs_order?.patient?.pat_dob) //record.po_pat_dob ? moment(record.po_pat_dob, 'YYYYMMDD').fromNow(true) : '';
      }
    },
    {
      dataIndex: "po_pat_sex",
      title: "Pat. Sex",
      width: 80,
      render: (text, rec) => rec?.pacs_order?.patient?.pat_sex
    },
    {
      dataIndex: "po_site",
      title: "Site",
      width: 150,
      render: (text, rec) => rec?.pacs_order?.po_site || 'SOMAJIGUDA'
    },
    {
      dataIndex: "po_ref_doc",
      title: "Ref Doc",
      width: 120,
      render: (text, rec) => rec?.pacs_order?.po_ref_doc
    },
    {
      dataIndex: "po_scan_date",
      title: "Scan Dt.",
      render: (val, record) => {
        return (
          <span>{moment(val).format("DD-MM-YYYY HH:mm:ss")}</span>
        )
      },
      width: 150
    },
    {
      dataIndex: "po_status",
      title: "Status",
      fixed: 'right',
      render: (text, record) => {
        const pacs_status = record?.order_workflow?.ow_pacs_status;
        return (
          <>
            <Tag color={statusColors[pacs_status]}>{pacs_status?.replaceAll('_', ' ')}</Tag>
            <span className="pointer md-icon ms-3" onClick={() => printReport(record)}>
              <PrinterOutlined />
            </span>
          </>
        )
      },
      width: 150
    }
  ].filter(itm => !itm.hidden))
};
