// hooks/useReportStatus.js
import { makeGetCall } from '../utils/helper';
import { useState, useEffect } from 'react';

export const useReportStatus = () => {
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatusList = async () => {
    try {
      setLoading(true);
      const response = await makeGetCall('/get-status-list');
      const activeStatuses = response.data?.data?.filter(status => status.is_active === 'Y') || [];
      
      // Sort by status_order
      const sortedStatuses = activeStatuses.sort((a, b) => a.status_order - b.status_order);
      
      setStatusList(sortedStatuses);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch status list:', err);
      setError(err);
      // Fallback to hardcoded values
      setStatusList([
        { status_id: 1, status_code: 'DRAFTED', status_label: 'Draft', status_order: 1 },
        { status_id: 2, status_code: 'REVIEWED', status_label: 'Reviewed', status_order: 2 },
        { status_id: 3, status_code: 'SIGNEDOFF', status_label: 'Sign Off', status_order: 3 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusList();
  }, []);

  return { statusList, loading, error, refetch: fetchStatusList };
};