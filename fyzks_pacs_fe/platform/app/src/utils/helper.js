import { debounce } from "lodash";
import axiosInstance, { BASE_API } from "../axios";
const moment = require("moment");

export const RADIOLOGY_URL = (pin, location) => `https://smj-pacs-int.yashodahospital.com/RadiologyDesk/PatientDetails_Tab.aspx?Pin=${pin}&LOC=${location}`
export const ConvertStringToDate = (dateString, timeString) => {
  if (!dateString || !timeString) return "";
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6) - 1; // Month is zero-based in JavaScript Date objects
  const day = dateString.substring(6, 8);

  // Extract hour, minute, and second from the time string
  const hour = timeString.substring(0, 2);
  const minute = timeString.substring(2, 4);
  const second = timeString.substring(4, 6);

  // Create a Date object
  const combinedDate = new Date(year, month, day, hour, minute, second);
  return combinedDate;
}

export const setUserDetails = (userDetails) => {
  localStorage.setItem("user_details", JSON.stringify(userDetails));
}

export const getUserDetails = () => {
  return JSON.parse(localStorage.getItem("user_details"));
}

export const setAccessToken = (accessToken) => {
  localStorage.setItem("access_token", accessToken);
}

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
}

export const makePostCall = (url, payload, headers) => {
  return axiosInstance.post(BASE_API + url, payload, headers);
}

export const makeGetCall = (url) => {
  return axiosInstance.get(BASE_API + url);
}

const debouncedApiCall = debounce((payload) => {
  makePostCall("/save-viewer-interactions", payload)
    .then((res) => {
      console.log("saved interaction resp", res);
    })
    .catch(e => {
      console.log("Error", e);
    });
}, 300); // 300ms delay

export const saveViewerInteractions = (props) => {
  const { study_id, series_id, tool_name, tool_action, viewport_index, additional_data } = props;
  const StudyInstanceUID = window.currentStudy;
  const SeriesInstanceUID = window.currentSeries;

  try {
    const user_id = getUserDetails()?.username;
    const payload = {
      user_id,
      study_id: StudyInstanceUID,
      series_id: SeriesInstanceUID,
      tool_name,
      tool_action,
      viewport_index,
      additional_data
    };

    // Use debounced function
    debouncedApiCall(payload);

  } catch (e) {
    console.error("Something went wrong while saving interactions", e);
  }
}


export const hisStatusOptions = [
  { label: 'UNCONFIRMED', value: 'UNCONFIRMED' },
  { label: 'CONFIRMATION_IN_PROGRESS', value: 'CONFIRMATION_IN_PROGRESS' },
  { label: 'WAIT_FOR_MANUAL_CONFIRMATION', value: 'WAIT_FOR_MANUAL_CONFIRMATION' },
  { label: 'CONFIRMED', value: 'CONFIRMED' },
  { label: 'DUPLICATE_ACCESSION_NO', value: 'DUPLICATE_ACCESSION_NO' },
  { label: 'CONFIRMATION_NOT_REQUIRED', value: 'CONFIRMATION_NOT_REQUIRED' },
]

export function calculateExactAge(dobString) {
  // Parse the DOB in YYYYMMDD format
  const dob = moment(dobString, "YYYYMMDD");

  // If the DOB is invalid, return an error message
  if (!dob.isValid()) {
    return "Invalid DOB format";
  }

  // Check if the date is in the future
  if (dob.isAfter(moment())) {
    return "Invalid DOB: Future date provided.";
  }

  // Calculate difference in years, months, and days
  const now = moment();
  const years = Math.floor(moment.duration(now.diff(dob)).asYears());
  const months = Math.floor(moment.duration(now.diff(dob)).asMonths() % 12);
  const days = Math.floor(moment.duration(now.diff(dob)).asDays() % 30.44);

  // Determine the most appropriate unit to display
  if (years > 0) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  } else if (months > 0) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  } else {
    return `${days} ${days === 1 ? "day" : "days"}`;
  }
}

export const removeContentById = (html, idToRemove) => {
  // Create a temporary DOM element
  const temp = document.createElement('div');
  temp.innerHTML = html;
  // Find and remove the element with the specified ID
  const elementToRemove = temp.querySelector(`#${idToRemove}`);
  if (elementToRemove) {
    elementToRemove.remove();
  }

  // Return the modified HTML string
  return temp.innerHTML;
};


export const hasReportingPermission = (userDetails) => {
  const userType = userDetails?.user_type;
  if (userType === 'radiologist' || userType === 'typist' || userType === 'hod') {
    // additionally check explicitly if the user has the particular permission
    return true;
  }
  return false;
}

export const hasStudyViewingPermission = (userDetails) => {
  const userType = userDetails?.user_type;
  if (userType === 'radiologist' || userType === 'hod' || userType === 'technician') {
    // additionally check explicitly if the user has the particular permission
    return true;
  }
  return false;
}

export const hasUploadNotesPermission = (userDetails) => {
  const userType = userDetails?.user_type;
  if (userType === 'technician') {
    // additionally check explicitly if the user has the particular permission
    return true;
  }
  return false;
}

export const createTabChannel = (channelName = 'tab_communication') => {
  const channel = new BroadcastChannel(channelName);

  return {
    // Send URL update to other tabs
    sendUrlUpdate: (newUrl) => {
      channel.postMessage({ type: 'URL_UPDATE', url: newUrl });
    },

    // Listen for URL updates in the other tab
    listenForUpdates: (callback) => {
      channel.onmessage = (event) => {
        if (event.data.type === 'URL_UPDATE') {
          callback(event.data.url);
        }
      };
    },

    // Clean up when no longer needed
    cleanup: () => {
      channel.close();
    }
  };
};

// Convert base64 image to RTF hex format
const base64ToHex = (base64String) => {
  try {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');

    // Convert base64 to binary
    const binaryString = atob(base64Data);

    // Convert binary to hex
    let hex = '';
    for (let i = 0; i < binaryString.length; i++) {
      const hexChar = binaryString.charCodeAt(i).toString(16).padStart(2, '0');
      hex += hexChar;
    }

    return hex.toUpperCase();
  } catch (error) {
    console.error('Error converting base64 to hex:', error);
    return '';
  }
};

// Convert image to RTF format
const convertImageToRTF = (imgElement) => {
  try {
    const src = imgElement.getAttribute('src');
    if (!src || !src.startsWith('data:image/')) {
      return '[IMAGE: External image not supported in RTF]';
    }

    // Get image format
    const formatMatch = src.match(/^data:image\/([a-z]+);base64,/);
    const format = formatMatch ? formatMatch[1].toLowerCase() : 'png';

    // RTF image format mapping
    const rtfFormat = format === 'jpeg' || format === 'jpg' ? 'jpegblip' : 'pngblip';

    // Get image dimensions (default if not specified)
    const width = imgElement.getAttribute('width') || '200';
    const height = imgElement.getAttribute('height') || '100';

    // Convert to twips (RTF units: 1 inch = 1440 twips, assuming 96 DPI)
    const widthTwips = Math.round(parseInt(width) * 15); // Rough conversion
    const heightTwips = Math.round(parseInt(height) * 15);

    // Convert base64 to hex
    const hexData = base64ToHex(src);

    if (!hexData) {
      return '[IMAGE: Conversion failed]';
    }

    // Create RTF image structure
    const rtfImage = `{\\pict\\${rtfFormat}\\picw${widthTwips}\\pich${heightTwips}\\picwgoal${widthTwips}\\pichgoal${heightTwips} ${hexData}}`;

    return rtfImage;
  } catch (error) {
    console.error('Error converting image to RTF:', error);
    return '[IMAGE: Conversion error]';
  }
};

export const htmlToRtf = (htmlContent, patientData) => {
  // Start with proper RTF header
  let rtf = '{\\rtf1\\ansi\\ansicpg1252\\deff0 {\\fonttbl {\\f0\\fnil\\fcharset0 Times New Roman;}}\\f0\\fs24';

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

  // Apply alignment replacements
  alignmentReplacements.forEach((replacement, index) => {
    const before = processedContent;
    processedContent = processedContent.replace(replacement.pattern, replacement.replacement);
    if (before !== processedContent) {
      console.log(`Alignment replacement ${index} applied:`, replacement.pattern.toString());
    }
  });

  // Handle images before removing other tags
  processedContent = processedContent.replace(/<img[^>]*>/gi, (imgTag) => {
    // Create a temporary img element to parse attributes
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = imgTag;
    const imgElement = tempDiv.querySelector('img');

    if (imgElement) {
      return convertImageToRTF(imgElement);
    }
    return '[IMAGE: Parse error]';
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

  // Add content if exists
  if (processedContent && processedContent.trim() && processedContent !== ' ') {
    rtf += processedContent;
  } else {
    rtf += '\\i No report content entered.\\i0';
  }

  rtf += '\\par}';
  return rtf;
};
