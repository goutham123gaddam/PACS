import React, { useState, useRef, useEffect } from 'react';
// import { Download, FileText, Save, User, Upload, AlertCircle } from 'lucide-react';

const RadiologyEditorWithJodit = () => {
  const [reportContent, setReportContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    id: '',
    dob: '',
    studyDate: new Date().toISOString().split('T')[0],
    studyType: ''
  });

  const editorRef = useRef(null);
  const joditRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize Jodit Editor
  useEffect(() => {
    const loadJodit = async () => {
      try {
        // Load Jodit from CDN
        if (!window.Jodit) {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jodit/3.24.5/jodit.min.js';
          script.onload = initializeEditor;
          document.head.appendChild(script);

          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/jodit/3.24.5/jodit.min.css';
          document.head.appendChild(link);
        } else {
          initializeEditor();
        }
      } catch (error) {
        console.error('Failed to load Jodit:', error);
      }
    };

    const initializeEditor = () => {
      if (window.Jodit && editorRef.current && !joditRef.current) {
        joditRef.current = window.Jodit.make(editorRef.current, {
          height: 400,
          toolbar: true,
          spellcheck: true,
          language: 'en',
          toolbarButtonSize: 'middle',
          buttons: [
            'source', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'link', 'table', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'eraser', 'copyformat', '|',
            'symbol', 'fullsize', 'print'
          ],
          uploader: {
            insertImageAsBase64URI: true
          },
          removeButtons: ['video'],
          showCharsCounter: true,
          showWordsCounter: true,
          showXPathInStatusbar: false
        });

        joditRef.current.events.on('change', (newValue) => {
          setReportContent(newValue);
        });
      }
    };

    loadJodit();

    return () => {
      if (joditRef.current) {
        joditRef.current.destruct();
        joditRef.current = null;
      }
    };
  }, []);

  // HTML templates that work well with Jodit
  const htmlTemplates = {
    'chest-xray': {
      name: 'Chest X-Ray',
      content: `
        <p><strong>CLINICAL HISTORY:</strong><br>
        <span style="color: #666; font-style: italic;">[Clinical indication]</span></p>

        <p><strong>TECHNIQUE:</strong><br>
        Frontal and lateral chest radiographs were obtained.</p>

        <p><strong>COMPARISON:</strong><br>
        <span style="color: #666; font-style: italic;">[Prior studies if available]</span></p>

        <p><strong>FINDINGS:</strong><br>
        The lungs are clear bilaterally without focal consolidation, pleural effusion, or pneumothorax. The cardiac silhouette is normal in size and configuration. The mediastinal contours are unremarkable. The bony thorax appears intact.</p>

        <p><strong>IMPRESSION:</strong><br>
        Normal chest radiograph.</p>
      `
    },
    'ct-head': {
      name: 'CT Head',
      content: `
        <p><strong>CLINICAL HISTORY:</strong><br>
        <span style="color: #666; font-style: italic;">[Clinical indication]</span></p>

        <p><strong>TECHNIQUE:</strong><br>
        Non-contrast CT scan of the head was performed.</p>

        <p><strong>COMPARISON:</strong><br>
        <span style="color: #666; font-style: italic;">[Prior studies if available]</span></p>

        <p><strong>FINDINGS:</strong><br>
        No acute intracranial hemorrhage or mass effect is identified. The ventricular system is normal in size and configuration. The gray-white matter differentiation is preserved. No midline shift is present. The visualized paranasal sinuses and mastoid air cells are clear.</p>

        <p><strong>IMPRESSION:</strong><br>
        No acute intracranial abnormality.</p>
      `
    },
    'ct-abdomen': {
      name: 'CT Abdomen/Pelvis',
      content: `
        <p><strong>CLINICAL HISTORY:</strong><br>
        <span style="color: #666; font-style: italic;">[Clinical indication]</span></p>

        <p><strong>TECHNIQUE:</strong><br>
        CT scan of the abdomen and pelvis with IV contrast.</p>

        <p><strong>COMPARISON:</strong><br>
        <span style="color: #666; font-style: italic;">[Prior studies if available]</span></p>

        <p><strong>FINDINGS:</strong><br>
        <strong>LIVER:</strong> Normal size, contour, and attenuation. No focal lesions.<br>
        <strong>GALLBLADDER:</strong> Unremarkable.<br>
        <strong>PANCREAS:</strong> Normal size and attenuation.<br>
        <strong>SPLEEN:</strong> Normal size and attenuation.<br>
        <strong>KIDNEYS:</strong> Normal size bilaterally with symmetric enhancement.<br>
        <strong>ADRENALS:</strong> Unremarkable.<br>
        <strong>BOWEL:</strong> No obstruction or wall thickening.<br>
        <strong>PELVIS:</strong> Unremarkable.<br>
        <strong>LYMPH NODES:</strong> No pathologically enlarged lymph nodes.</p>

        <p><strong>IMPRESSION:</strong><br>
        Normal CT abdomen and pelvis.</p>
      `
    }
  };

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    const template = htmlTemplates[templateKey];
    if (joditRef.current && template) {
      joditRef.current.value = template.content;
      setReportContent(template.content);
    }
  };

  const handlePatientInfoChange = (field, value) => {
    setPatientInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // RTF to HTML conversion (basic)
  const rtfToHtml = (rtfContent) => {
    try {
      // Basic RTF to HTML conversion
      let html = rtfContent
        // Remove RTF header and footer
        .replace(/^{\\rtf.*?\\f0\\fs\d+/g, '')
        .replace(/}$/g, '')
        // Convert RTF formatting to HTML
        .replace(/\\b\s*(.*?)\\b0/g, '<strong>$1</strong>')
        .replace(/\\i\s*(.*?)\\i0/g, '<em>$1</em>')
        .replace(/\\ul\s*(.*?)\\ulnone/g, '<u>$1</u>')
        .replace(/\\par/g, '<br>')
        .replace(/\\line/g, '<br>')
        // Clean up remaining RTF codes
        .replace(/\\[a-z]+\d*/g, '')
        .replace(/{/g, '')
        .replace(/}/g, '')
        .trim();

      return html;
    } catch (error) {
      console.error('RTF parsing error:', error);
      return rtfContent; // Return original if parsing fails
    }
  };

  // Enhanced HTML to RTF conversion
  const htmlToRtf = (htmlContent, patientData) => {
    // Start with proper RTF header
    let rtf = '{\\rtf1\\ansi\\ansicpg1252\\deff0 {\\fonttbl {\\f0\\fnil\\fcharset0 Times New Roman;}}\\f0\\fs24';

    // Add patient information header
    rtf += '\\par\\qc\\b\\fs28 RADIOLOGY REPORT\\b0\\ql\\fs24\\par\\par';
    rtf += `\\b Patient Name:\\b0\\tab ${patientData.name || 'Not specified'}\\par`;
    rtf += `\\b Patient ID:\\b0\\tab ${patientData.id || 'Not specified'}\\par`;
    rtf += `\\b Date of Birth:\\b0\\tab ${patientData.dob || 'Not specified'}\\par`;
    rtf += `\\b Study Date:\\b0\\tab ${patientData.studyDate || 'Not specified'}\\par`;
    rtf += `\\b Study Type:\\b0\\tab ${patientData.studyType || 'Not specified'}\\par\\par`;

    // Clean and convert HTML content
    let content = htmlContent || '';

    // Remove "Loading editor..." if present
    if (content.includes('Loading editor...')) {
      content = '';
    }

    console.log('Before conversion:', content);

    // Step by step conversion with logging
    let processedContent = content;

    // First, handle alignment with more comprehensive patterns
    const alignmentReplacements = [
      // CSS style alignment (most common) - Use [\s\S]*? to match across lines
      { pattern: /<p[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\qc $1\\par\\ql\\par' },
      { pattern: /<p[^>]*style="[^"]*text-align:\s*right[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\qr $1\\par\\ql\\par' },
      { pattern: /<p[^>]*style="[^"]*text-align:\s*left[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\ql $1\\par\\par' },

      // Div alignment
      { pattern: /<div[^>]*style="[^"]*text-align:\s*center[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, replacement: '\\qc $1\\par\\ql' },
      { pattern: /<div[^>]*style="[^"]*text-align:\s*right[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, replacement: '\\qr $1\\par\\ql' },
      { pattern: /<div[^>]*style="[^"]*text-align:\s*left[^"]*"[^>]*>([\s\S]*?)<\/div>/gi, replacement: '\\ql $1\\par' },

      // Jodit specific classes
      { pattern: /<p[^>]*class="[^"]*jodit_text_align_center[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\qc $1\\par\\ql\\par' },
      { pattern: /<p[^>]*class="[^"]*jodit_text_align_right[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\qr $1\\par\\ql\\par' },
      { pattern: /<p[^>]*class="[^"]*jodit_text_align_left[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\ql $1\\par\\par' },

      // Alternative class naming
      { pattern: /<p[^>]*class="[^"]*text-center[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\qc $1\\par\\ql\\par' },
      { pattern: /<p[^>]*class="[^"]*text-right[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\qr $1\\par\\ql\\par' },
      { pattern: /<p[^>]*class="[^"]*text-left[^"]*"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\ql $1\\par\\par' },

      // Center tag (legacy)
      { pattern: /<center[^>]*>([\s\S]*?)<\/center>/gi, replacement: '\\qc $1\\par\\ql' },

      // Align attribute (legacy)
      { pattern: /<p[^>]*align="center"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\qc $1\\par\\ql\\par' },
      { pattern: /<p[^>]*align="right"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\qr $1\\par\\ql\\par' },
      { pattern: /<p[^>]*align="left"[^>]*>([\s\S]*?)<\/p>/gi, replacement: '\\ql $1\\par\\par' },
      { pattern: /<div[^>]*align="center"[^>]*>([\s\S]*?)<\/div>/gi, replacement: '\\qc $1\\par\\ql' },
      { pattern: /<div[^>]*align="right"[^>]*>([\s\S]*?)<\/div>/gi, replacement: '\\qr $1\\par\\ql' },
      { pattern: /<div[^>]*align="left"[^>]*>([\s\S]*?)<\/div>/gi, replacement: '\\ql $1\\par' }
    ];

    // Apply alignment replacements with proper <br> handling
    alignmentReplacements.forEach((replacement, index) => {
      const before = processedContent;
      processedContent = processedContent.replace(replacement.pattern, replacement.replacement);
      if (before !== processedContent) {
        console.log(`Alignment replacement ${index} applied:`, replacement.pattern.toString());
      }
    });

    // Now handle <br> tags within aligned content AFTER alignment is applied
    // Convert <br> to \line within aligned blocks to maintain alignment
    processedContent = processedContent
      .replace(/<br\s*\/?>/gi, '\\line'); // Convert all remaining <br> to \line first

    // Then handle other formatting
    processedContent = processedContent
      // Handle standard paragraph and div tags (for non-aligned content)
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\\par\\par')
      .replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1\\par')

      // Handle text formatting
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '\\b $1\\b0')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '\\b $1\\b0')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '\\i $1\\i0')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '\\i $1\\i0')
      .replace(/<u[^>]*>(.*?)<\/u>/gi, '\\ul $1\\ulnone')

      // Handle span elements with styles
      .replace(/<span[^>]*style="[^"]*text-decoration:\s*underline[^"]*"[^>]*>(.*?)<\/span>/gi, '\\ul $1\\ulnone')
      .replace(/<span[^>]*style="[^"]*font-weight:\s*bold[^"]*"[^>]*>(.*?)<\/span>/gi, '\\b $1\\b0')
      .replace(/<span[^>]*style="[^"]*font-style:\s*italic[^"]*"[^>]*>(.*?)<\/span>/gi, '\\i $1\\i0')
      .replace(/<span[^>]*style="[^"]*color:\s*[^;"]*[^"]*"[^>]*>(.*?)<\/span>/gi, '$1') // Remove color spans but keep content

      // Handle headings
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\\b\\fs28 $1\\b0\\fs24\\par')

      // Handle lists
      .replace(/<ul[^>]*>/gi, '')
      .replace(/<\/ul>/gi, '\\par')
      .replace(/<ol[^>]*>/gi, '')
      .replace(/<\/ol>/gi, '\\par')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '\\tab • $1\\par')

      // Remove remaining HTML tags but preserve content
      .replace(/<[^>]*>/g, '')

      // Handle HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

      // Clean up extra spaces and line breaks
      .replace(/\n\s*\n/g, '\\par')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    console.log('After conversion:', processedContent);

    // Remove the global reset since we're now resetting after each aligned paragraph
    // processedContent += '\\ql'; // Reset to left alignment at the end

    // Add content if exists
    if (processedContent && processedContent.trim() && processedContent !== ' ') {
      rtf += processedContent;
    } else {
      rtf += '\\i No report content entered.\\i0';
    }

    rtf += '\\par}';
    return rtf;
  };

  const handleRtfUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.toLowerCase().endsWith('.rtf')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rtfContent = e.target.result;
        const htmlContent = rtfToHtml(rtfContent);

        if (joditRef.current) {
          joditRef.current.value = htmlContent;
          setReportContent(htmlContent);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid RTF file.');
    }
  };

  const downloadRTF = () => {
    // Get current content from Jodit editor
    let currentContent = '';
    if (joditRef.current) {
      currentContent = joditRef.current.value;
    } else {
      currentContent = reportContent;
    }

    console.log('Current content:', currentContent); // Debug log
    console.log('HTML structure:', currentContent.replace(/></g, '>\n<')); // Pretty print HTML

    const rtfContent = htmlToRtf(currentContent, patientInfo);
    console.log('RTF content:', rtfContent); // Debug log

    // Create blob with proper RTF MIME type and encoding
    const blob = new Blob([rtfContent], {
      type: 'application/rtf;charset=utf-8'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${patientInfo.name || 'radiology-report'}_${patientInfo.studyDate}.rtf`;

    // Add the link to document, click it, then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 100);

    console.log('Download initiated for:', link.download);
  };

  const saveReport = () => {
    // Get current content from Jodit editor
    let currentContent = '';
    if (joditRef.current) {
      currentContent = joditRef.current.value;
    } else {
      currentContent = reportContent;
    }

    const reportData = {
      patientInfo,
      htmlContent: currentContent,
      rtfContent: htmlToRtf(currentContent, patientInfo),
      template: selectedTemplate,
      timestamp: new Date().toISOString()
    };

    console.log('Saving report:', reportData);
    alert('Report saved successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Radiology Report Editor with Jodit</h1>
        <p className="text-gray-600">Professional WYSIWYG editor with RTF template support</p>
      </div>

      {/* Patient Information */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          {/* <User className="mr-2 h-5 w-5" /> */}
          Patient Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
            <input
              type="text"
              value={patientInfo.name}
              onChange={(e) => handlePatientInfoChange('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter patient name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient ID</label>
            <input
              type="text"
              value={patientInfo.id}
              onChange={(e) => handlePatientInfoChange('id', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter patient ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={patientInfo.dob}
              onChange={(e) => handlePatientInfoChange('dob', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Study Date</label>
            <input
              type="date"
              value={patientInfo.studyDate}
              onChange={(e) => handlePatientInfoChange('studyDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Study Type</label>
            <input
              type="text"
              value={patientInfo.studyType}
              onChange={(e) => handlePatientInfoChange('studyType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., CT Chest, MRI Brain"
            />
          </div>
        </div>
      </div>

      {/* Template Selection and RTF Upload */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            {/* <FileText className="mr-2 h-5 w-5" /> */}
            Templates & RTF Import
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              {/* <Upload className="mr-2 h-4 w-4" /> */}
              Load RTF Template
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".rtf"
              onChange={handleRtfUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {Object.entries(htmlTemplates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => handleTemplateSelect(key)}
              className={`p-3 text-left border rounded-lg transition-colors ${selectedTemplate === key
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
            >
              <div className="font-medium">{template.name}</div>
              <div className="text-sm text-gray-500 mt-1">Professional template</div>
            </button>
          ))}
        </div>

        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <div className="flex items-start">
            {/* <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" /> */}
            <div className="text-sm text-amber-800">
              <strong>RTF Support Notes:</strong> While Jodit excels at rich text editing, RTF conversion has limitations.
              Complex RTF formatting may not preserve perfectly. For best results, use HTML templates or simple RTF files.
            </div>
          </div>
        </div>
      </div>

      {/* Jodit Editor */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Report Editor</h2>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <div ref={editorRef} className="min-h-96">
            Loading editor...
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={saveReport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {/* <Save className="mr-2 h-4 w-4" /> */}
          Save Report
        </button>
        <button
          onClick={downloadRTF}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {/* <Download className="mr-2 h-4 w-4" /> */}
          Download RTF
        </button>
        <button
          onClick={() => {
            if (joditRef.current) {
              joditRef.current.value = '';
              setReportContent('');
              setSelectedTemplate('');
            }
          }}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Clear Editor
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">RTF Template Usage:</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li><strong>Loading RTF Templates:</strong> Use "Load RTF Template" to import existing RTF files</li>
          <li><strong>Built-in Templates:</strong> Select from predefined HTML templates optimized for Jodit</li>
          <li><strong>Rich Text Editing:</strong> Use Jodit's toolbar for advanced formatting, tables, and images</li>
          <li><strong>RTF Export:</strong> Download reports as RTF files compatible with Word and other processors</li>
          <li><strong>Best Practice:</strong> Start with HTML templates for consistent formatting</li>
        </ul>
      </div>
    </div>
  );
};

export default RadiologyEditorWithJodit;
