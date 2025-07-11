import React, { useEffect, useMemo, useState } from "react";
import RichTextEditor from "./rich-text-editor";
import "./editor.css";
import { ConvertStringToDate, getUserDetails, makeGetCall, makePostCall, RADIOLOGY_URL, removeContentById } from "../../utils/helper";
import moment from "moment";
import { Button, Card, Checkbox, message, Modal, Radio, Select, Table } from "antd";
import { TemplateHeader } from "./constants";
import { RightSquareOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import CriticalFinding from "./critical-finding";
import PdfViewer from "../../components/PdfViewer";


const ReportEditor = ({ cancel, onSave, patientDetails, selected_report, handlePostSaving }) => {
  const [content, setContent] = React.useState(null);
  const [reportsData, setReportsData] = React.useState([]);
  const [priorReports, setPriorReports] = React.useState([]);
  const [currentReport, setCurrentReport] = React.useState(null);
  const [templates, setTemplates] = React.useState([]);
  const [nodes, setNodes] = React.useState([]);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [proxyUser, setProxyUser] = React.useState(null);
  const [cosigningDoctor, setCosigningDoctor] = React.useState(null);
  const [moreAction, setMoreAction] = React.useState(null);
  const [radUsers, setRadUsers] = React.useState([]);
  const [allUsers, setAllUsers] = React.useState([]);
  const userType = getUserDetails().user_type;
  const [correlated, setCorrelated] = useState(null);
  const [diagnosed, setDiagnosed] = useState(null);
  const [submitTriggered, setSubmitTrigged] = useState(false);
  const [correlatedMandatory, setCorrelatedMandatory] = useState(false);
  const [criticalFindingModal, setCriticalFindingModal] = useState({ visible: false, data: {} });
  const [viewerModal, setViewerModal] = useState({ visible: false, data: {} });
  const [loadModalVisible, setLoadModalVisible] = useState(false);
  const [pendingHtml, setPendingHtml] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const { pacs_order } = patientDetails;
  const { patient } = pacs_order;

  const handleContentChange = (newContent) => {
    console.log("newContent", newContent);
    setContent(newContent);
  }

  useEffect(() => {
    // getTemplates();
    getNodes();
    fetchRadUsers();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    fetchPrevReports();
    fetchPriorReports();

    setSelectedNode(null);
    setSelectedTemplate(null);
    setTemplates([]);
  }, [patientDetails]);

  const fetchPriorReports = () => {
    makePostCall('/get-prior-reports', {
      yh_no: patient?.pat_pin,
      his_ord_no: pacs_order?.po_his_ord_no,
      acc_no: pacs_order?.po_acc_no,
      order_id: pacs_order.pacs_ord_id,
    }).then(res => {
      setPriorReports(res.data?.data || []);
    }).catch(e => {
      console.log(e);
      setPriorReports([]);
    })
  }

  useEffect(() => {
    // Handler for browser close/refresh
    const handleBeforeUnload = async (e) => {
      // e.preventDefault();
      // e.returnValue = ''; // Required for Chrome

      try {
        await updateStudyStatus('');
      } catch (error) {
        console.error('Failed to reset status on exit:', error);
      }
    };

    const updateStudyStatus = async (status) => {
      makePostCall("/close-report", { order_id: pacs_order.pacs_ord_id, status: status })
    }

    // Set up keep-alive ping
    const pingInterval = setInterval(async () => {
      try {
        await makePostCall("/study-ping", { order_id: pacs_order.pacs_ord_id, status: 'R' });
      } catch (error) {
        console.error('Keep-alive ping failed:', error);
      }
    }, 15000); // Every 15 seconds

    // Add event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(pingInterval);
    };
  }, [patientDetails]);

  useEffect(() => {
    if (patientDetails) {
      setCorrelated(pacs_order?.po_correlated);
      setDiagnosed(pacs_order?.po_diagnosed);
    }
  }, [patientDetails]);

  const refreshAfterUpdate = (status) => {
    fetchPrevReports();
    handlePostSaving && handlePostSaving(status, patientDetails);
  }

  const handleSave = (newContent, status, curReport, moreInfo = {}) => {
    if (onSave) {
      onSave(content, status, curReport, { ...moreInfo, proxy_user: proxyUser, co_signing_doctor: cosigningDoctor, correlated, diagnosed }, refreshAfterUpdate)
    } else {
      saveReport(content, status, curReport, { ...moreInfo, proxy_user: proxyUser, co_signing_doctor: cosigningDoctor }, refreshAfterUpdate)
    };
  }

  const saveReport = (newContent, status, currentReport, moreInfo, callback) => {
    const { patient } = pacs_order;
    const { proxy_user, co_signing_doctor } = moreInfo;

    makePostCall('/submit-report', {
      html: newContent,
      yh_no: patient?.pat_pin,
      order_no: pacs_order?.po_his_ord_no,
      acc_no: pacs_order?.po_acc_no,
      order_id: pacs_order.pacs_ord_id,
      user_id: getUserDetails()?.username,
      ...moreInfo,
      proxy_user: proxy_user,
      co_signing_doctor: co_signing_doctor,
      status,
      report_id: currentReport?.pr_id,
      // correlated: correlated,
      // diagnosed: diagnosed,
    })
      .then(res => {
        callback && callback(status);
      })
      .catch(e => {
        console.log(e);
      });
  }

  const fetchRadUsers = () => {
    makeGetCall('/get-rad-users')
      .then(res => {
        setRadUsers(res.data?.data || []);
      })
      .catch(e => {
        console.log(e);
        setRadUsers([]);
      })
  }

  const fetchAllUsers = () => {
    makeGetCall('/user-list')
      .then(res => {
        setAllUsers(res.data?.data || []);
      })
      .catch(e => {
        console.log(e);
        setAllUsers([]);
      })
  }

  const fetchPrevReports = () => {
    makePostCall('/get-reports', {
      yh_no: patient?.pat_pin,
      his_ord_no: pacs_order?.po_his_ord_no,
      acc_no: pacs_order?.po_acc_no,
      order_id: pacs_order.pacs_ord_id,
    })
      .then(res => {
        const resp_data = res.data?.data || [];
        setReportsData(resp_data);
        if (resp_data.length > 0) {
          const updated = resp_data.find(r => r.pr_id === currentReport?.pr_id) || resp_data[0];
          setCurrentReport(updated);
        } else {
          setCurrentReport({pr_report_html: "<div></div>"});
        }
      })
      .catch(e => {
        console.log(e);
      })
  }

  const getTemplates = () => {
    makeGetCall(`/get-templates?modality=${pacs_order?.po_modality}&node=${selectedNode}`)
      .then(res => {
        setTemplates(res?.data?.data || []);
      })
      .catch(e => {
        console.log(e);
      })
  }

  const getNodes = () => {
    makeGetCall(`/get-nodes?modality=${pacs_order?.po_modality}`)
      .then(res => {
        setNodes(res?.data?.data || []);
      })
      .catch(e => {
        console.log(e);
      })
  }

  useEffect(() => {
    if (selectedNode) {
      getTemplates()
    }
  }, [selectedNode]);

  useEffect(() => {
    if (currentReport) {
      // setContent(`${TemplateHeader(patientDetails)}${currentReport?.pr_html}`);
      setContent(`${currentReport?.pr_report_html}`);
    }
  }, [currentReport]);

  const reportColumns = [
    {
      title: 'Created By',
      dataIndex: 'pr_reported_by',
      key: 'pr_reported_by',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Status',
      dataIndex: 'pr_status',
      key: 'pr_status',
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => {
        return (
          <span>
            <DeleteOutlined style={{ fontSize: '16px', color: 'red' }} className="mr-2" onClick={() => handleDelete(record)} />
            <RightSquareOutlined style={{ fontSize: '16px', color: 'blue' }} onClick={() => loadTemplate(record)} />
          </span>
        )
      }
    }
  ];

  const priorReportColumns = [
    {
      title: 'Created By',
      dataIndex: 'pr_reported_by',
      key: 'pr_reported_by',
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Status',
      dataIndex: 'pr_status',
      key: 'pr_status',
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => {
        return (
          <span>
            <RightSquareOutlined style={{ fontSize: '16px', color: 'blue' }} onClick={() => viewPriorReport(record)} />
          </span>
        )
      }
    }
  ];

  const loadTemplate = (rec) => {
    setCurrentReport(rec);
  };

  const viewPriorReport = (rec) => {
    /* 
    // Commented out modal viewer on 2025-07-04
    // as per new feature to reuse prior report as template

    makePostCall('/print-acc-report', {
      order_id: rec.pr_pacs_ord_id,
    }, {
      responseType: "arraybuffer",
    })
      .then(res => {
        setViewerModal({ visible: true, data: res.data });
      }).catch(e => {
        console.log(e);
        setViewerModal({ visible: false, data: null });
      })
    */

    showLoadConfirmation(rec?.pr_report_html || "<div></div>");
  }

  const handleDelete = (rec) => {
    makePostCall('/delete-report', {
      report_id: rec?.pr_id,
      yh_no: patient?.pat_pin,
      order_id: rec?.pr_pacs_ord_id,
    })
      .then(res => {
        fetchPrevReports();
      })
      .catch(e => {
        console.log(e);
      });
  }

  const handleTemplateChange = (val) => {
    showLoadConfirmation(val);
    // fetch(`/templates/${val}.html`)
    //   .then(response => response.text())
    //   .then(html => {
    //     // Do something with the HTML content
    //     // setContent(html)
    //     setCurrentReport({ pr_html: html });
    //   })
    //   .catch(error => console.error('Error:', error));
  }

  const radUserOptions = useMemo(() => {
    return radUsers.map(user => ({
      label: user.user_fullname,
      value: user.username,
      data: user
    }));

  }, [radUsers]);

  const allUserOptions = useMemo(() => {
    return allUsers.map(user => ({
      label: user.user_fullname,
      value: user.username
    }));
  }, [allUsers]);

  const handleSaveForm = (status) => {
    setSubmitTrigged(true);
    // if (!correlated || !diagnosed) {
    //   message.error("Please select the Correlated & Diagnosed options");
    //   return;
    // }
    const cleanedHtml = removeContentById(content, 'cosign');
    handleSave(cleanedHtml, status, currentReport);
  }

  const handlePrint = () => {
    console.log("currentReport", currentReport);

    makePostCall('/print-report', {
      report: currentReport,
      patDetails: patientDetails,
      html: content, //.replaceAll(' ', '&nbsp'),
      order_id: pacs_order.pacs_ord_id
    }, {
      responseType: "arraybuffer",
    })
      .then(res => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdf_url = URL.createObjectURL(pdfBlob);
        // setPdfUrl(url);
        const printWindow = window.open(pdf_url, "_blank");
        printWindow.print();
      })
      .catch(err => {
        console.log("Error", err);
      })
  }

  const statusOrder = ['DRAFTED', 'REVIEWED', 'SIGNEDOFF'];

  const handleNotification = () => {
    setCriticalFindingModal({ visible: true, data: patientDetails })
  }

  const goToRadiologyDesk = (patDetails) => {
    const { pacs_order } = patDetails
    const { patient, po_site } = pacs_order;
    const { pat_pin } = patient;
    window.open(`${RADIOLOGY_URL(pat_pin, po_site || '')}`, '_blank')
  }

  const handleCosigning = (val, opt) => {
    const { data } = opt;
    const { user_signature } = data;
    setCosigningDoctor(val);
    setCurrentReport({ ...currentReport, pr_report_html: `${currentReport?.pr_report_html} \n\n <div id="cosign">${user_signature}</div>` })
  }

  const showLoadConfirmation = (newHtml) => {
    setPendingHtml(newHtml);
    setLoadModalVisible(true); 
  };

  return (
    <div className="editor-container">
      <div className="left-section">
        <Card className="mb-3">
          <div className="!patient-details">
            <div className="d-flex">
              <div className="pat-name">
                {`${patient?.pat_name}, ${patient?.pat_pin}`}
              </div>
              {/* <Link to={}>Go to Viewer</Link> */}
              <Button danger className="ms-auto" type="default" onClick={() => { window.open(`/viewer?StudyInstanceUIDs=${patientDetails?.ps_study_uid}`, '_blank') }}> Launch Viewer</Button>
              <Button danger className="ms-auto" type="default" onClick={() => { goToRadiologyDesk(patientDetails) }}> Radiology Desk</Button>
            </div>
            <div>
              {`${patient?.pat_sex} / ${patient?.pat_dob ? moment(patient?.pat_dob).fromNow(true) : 'NA'}`}
            </div>
            <div>{`${pacs_order?.po_modality} / ${pacs_order?.po_ref_doc} ,
            ${moment(patientDetails?.ps_study_dt_tm).format("DD-MM-YYYY HH:mm:ss")}`}
            </div>
          </div>
        </Card>
        <Card className="mb-3">
          <div className="!previous-reports">
            <Table
              pagination={false}
              columns={reportColumns}
              dataSource={reportsData || []}
            />
          </div>
        </Card>
        {
          priorReports?.length > 0 && (
            <Card className="mb-3">
              <div className="bold-font">Prior Reports</div>
              <div className="!prior-reports">
                <Table
                  pagination={false}
                  columns={priorReportColumns}
                  dataSource={priorReports || []}
                />
              </div>
            </Card>
          )
        }
        <Card className="mb-3">
          <div className="!templates-section">
            <div className="bold-font">Load Template</div>
            <div>
              <span>Node</span>
              <Select
                allowClear
                style={{ width: 180 }}
                placeholder="Select Node"
                value={selectedNode}
                onChange={(val) => {
                  setSelectedNode(val);
                  setTemplates([]);
                  setSelectedTemplate(null);
                }}
                onClear={() => {
                  setSelectedNode(null);
                  setTemplates([]);
                  setSelectedTemplate(null);
                }}
                options={nodes?.map((itm) => ({
                  label: itm?.label,
                  value: itm?.code
                }))}
              />
              <span className="ms-3">Template</span>
              <Select
                allowClear
                style={{ width: 200 }}
                placeholder="Select Template"
                value={selectedTemplate}
                onChange={(val) => {
                  if (val) {
                    setSelectedTemplate(val);
                    handleTemplateChange(val);
                  } else {
                    setSelectedTemplate(null);
                  }
                }}
                onClear={() => {
                  setSelectedTemplate(null);
                }}
                options={templates?.map((itm) => ({
                  label: itm.rt_display_name,
                  value: itm.template_html,
                  key: itm.rt_template_name
                }))}
              />
            </div>
          </div>
        </Card>
        <Card className="mb-3">
          <div className="!more-options">
            <div className="bold-font">More Options</div>
            <div><Button onClick={handleNotification}> Notify Physician</Button></div>
            {/* <div className="mt-2"><Checkbox /> Need peer opinion from</div>
            <div className="mt-2"><Checkbox /> Requires Sub-Speciality Opinion</div> */}
            <div className="mt-2"><Checkbox onChange={(e) => {
              setMoreAction(e.target.checked ? 'co_signing' : null)
            }} /> Report Co-Signing
              {moreAction === 'co_signing' && (
                <Select style={{ width: 180 }} onChange={(val, opt) => { handleCosigning(val, opt) }} options={radUserOptions} />
              )}
            </div>

            <div className="mt-2"><Checkbox onChange={(e) => {
              setMoreAction(e.target.checked ? 'proxy-draft' : null)
            }} /> Proxy Draft
              {moreAction === 'proxy-draft' && (
                <Select style={{ width: 180 }} onChange={(val) => { setProxyUser(val) }} options={allUserOptions} />
              )}
            </div>

            <div className="mt-2"><Checkbox onChange={(e) => {
              setMoreAction(e.target.checked ? 'proxy-signoff' : null)
            }} /> Proxy Signoff
              {moreAction === 'proxy-signoff' && (
                <Select style={{ width: 180 }} onChange={(val) => { setProxyUser(val) }} options={radUserOptions} />
              )}
            </div>

            <div className="mt-2">Clinically diagnosed
              <Radio.Group value={diagnosed} className={submitTriggered ? (!!diagnosed ? '' : 'error') : ''} onChange={(e) => { setDiagnosed(e.target.value) }}>
                <Radio value={'diagnosed'}>Yes</Radio>
                <Radio value={'notdiagnosed'}>No</Radio>
              </Radio.Group>
              {submitTriggered && correlatedMandatory && !diagnosed && <div style={{ color: 'red', marginBottom: '8px' }}>This field is required</div>}
            </div>
            <div className="mt-2">Clinically correlated
              <Radio.Group value={correlated} className={submitTriggered ? (!!correlated ? '' : 'error') : ''} onChange={(e) => { setCorrelated(e.target.value) }}>
                <Radio value={'correlated'}>Yes</Radio>
                <Radio value={'notcorrelated'}>No</Radio>
              </Radio.Group>
              {submitTriggered && correlatedMandatory && !correlated && <div style={{ color: 'red', marginBottom: '8px' }}>This field is required</div>}
            </div>
          </div>
          <div className='d-flex' >
            <Button className='mt-3' type='default' onClick={cancel}>Cancel</Button>
            <Button className='mt-3' type='default' onClick={handlePrint}>PRINT REPORT</Button>
            <Button
              disabled={statusOrder.indexOf(currentReport?.pr_status) > 0}
              danger className='mt-3 ms-auto' type='default'
              color='primary' onClick={() => handleSaveForm('draft')}
            >DRAFT</Button>
            <Button
              disabled={currentReport?.pr_status === 'SIGNEDOFF'}
              danger className='mt-3 ms-3' type='default' color='primary'
              onClick={() => handleSaveForm('reviewed')}
            >REVIEWED</Button>
            <Button
              // disabled={statusOrder.indexOf(currentReport?.pr_status) < 1}
              className='mt-3 ms-3' type='primary' color='primary'
              onClick={() => handleSaveForm('signoff')}
              disabled={['hod', 'radiologist'].indexOf(userType) < 0}
            >
              SIGN OFF
            </Button>
          </div>
        </Card>
      </div>
      <div className="right-section">
        <RichTextEditor fromReporting={true} patDetails={patientDetails} currentReport={currentReport} cancel={cancel} content={content || "<div></div>"}
          onSave={handleSave} onChange={handleContentChange} />
      </div>
      {
        criticalFindingModal && (
          <Modal
            width={800}
            open={criticalFindingModal?.visible}
            onCancel={() => { setCriticalFindingModal({ visible: false, data: null }) }}
            okButtonProps={{ style: { display: 'none' } }}
          >
            <CriticalFinding closeNotificationModal={() => { setCriticalFindingModal({}) }} patDetails={criticalFindingModal?.data} />
          </Modal>
        )
      }
      {/* 
        // Uncomment this if you wanna show prior reports in a pdfviewer dialog
        viewerModal && (
          <Modal
            width={1000}
            open={viewerModal?.visible}
            onCancel={() => { setViewerModal({ visible: false }) }}
            okButtonProps={{ style: { display: 'none' } }}
          >
            <PdfViewer pdfArrayBuffer={viewerModal?.data} />
          </Modal>
        )
          */
      }
      <Modal
        open={loadModalVisible}
        onCancel={() => setLoadModalVisible(false)}
        footer={[
          <Button
            key="append"
            type="primary"
            onClick={() => {
              setCurrentReport((prev) => ({
                ...prev,
                pr_id: undefined,
                pr_report_html: (prev?.pr_report_html || "") + pendingHtml,
                pr_status: 'DRAFTED',
              }));
              setLoadModalVisible(false);
            }}
          >
            Append
          </Button>,
          <Button
            key="replace"
            danger
            onClick={() => {
              setCurrentReport((prev) => ({
                ...prev,
                pr_id: undefined,
                pr_report_html: pendingHtml,
                pr_status: 'DRAFTED',
              }));
              setLoadModalVisible(false);
            }}
          >
            Replace
          </Button>,
          <Button
            key="cancel"
            onClick={() => setLoadModalVisible(false)}
          >
            Cancel
          </Button>
        ]}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <ExclamationCircleOutlined
            style={{ color: "#faad14", marginRight: 8, fontSize: "20px" }}
          />
          <b>Load Template / Prior Report</b>
        </div>
        <div style={{ marginTop: 12 }}>
          Do you want to replace the current content or append this template?
        </div>
      </Modal>
    </div>
  );
};

export default ReportEditor;
