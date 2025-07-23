// RichTextEditor.js
import React, { useRef, useEffect, useMemo } from 'react';
import Quill from 'quill';

import 'quill/dist/quill.snow.css';
import { Button } from 'antd';
import { getUserDetails, makePostCall, PatientHeader } from '../../utils/helper';
import CustomEditor from '../custom-editor';
import TinyEditor from './tinymce-editor';

const RichTextEditor = ({ content, onChange, onSave, cancel, currentReport, patDetails, fromReporting, orderDetails }) => {

  const {pacs_order} = patDetails;
  const {patient} = pacs_order;

  const userDetails = getUserDetails();
  const userType = userDetails?.user_type;

  const handleSave = (status) => {
    onSave && onSave(content, status, currentReport,);
  }

  const handlePrint = () => {
    makePostCall('/print-report', {
      report: currentReport,
      patDetails: patDetails,
      html: content, //.replaceAll(' ', '&nbsp'),
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

  const headerContent = useMemo(() => {
    return PatientHeader(patient, currentReport, pacs_order)
  }, [patDetails, currentReport]);

  return (<div id='editor-container'>
    {/* <div ref={editorRef}></div> */}
    {/* <CustomEditor fromReporting={fromReporting} initialContent={content} placeholder={"placeholder..."} handleChange={onChange} /> */}
    <TinyEditor
      fromReporting={fromReporting}
      initialContent={content}
      placeholder={"placeholder..."}
      handleChange={onChange}
      headerContent={headerContent}
      // headerContent="<strong>Medical Report</strong> | Patient: John Doe | Date: 2025-07-10"
      footerContent="Note: This is a professional opinion only, Each investigation has its limitations. Final diagnosis needs correlation with clinical context and other investigations. Kindly discuss, if necessary."
    />
  </div>);
};

export default RichTextEditor;
