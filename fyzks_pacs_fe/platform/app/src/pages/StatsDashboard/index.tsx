import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select, DatePicker, Table, Statistic, Spin, message } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from "recharts";
import { ClockCircleOutlined, UserOutlined, DatabaseOutlined, BugOutlined } from "@ant-design/icons";
import { makeGetCall } from "../../utils/helper";

const { Option } = Select;
const { RangePicker } = DatePicker;

const StatsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [anomalyCount, setAnomalyCount] = useState(0);
    const [selectedModality, setSelectedModality] = useState('DX'); // Default to DX (X-Ray)
    const [dateRange, setDateRange] = useState(null);
    const [allModalities, setAllModalities] = useState([]);

    // Fetch data from API with filters
    const fetchData = () => {
        setLoading(true);
        
        const params = new URLSearchParams();
        if (selectedModality) params.append('modality', selectedModality);
        if (dateRange && dateRange.length === 2) {
            params.append('created_after', dateRange[0].toISOString());
            params.append('created_before', dateRange[1].toISOString());
        }

        const endpoint = params.toString() ? `/no-auth/get-loading-times?${params.toString()}` : '/no-auth/get-loading-times';

        makeGetCall(endpoint)
            .then(res => {
                const allData = res.data?.data || [];
                
                // Count anomalies before filtering
                const anomalies = allData.filter(item => 
                    item.vs_modality && 
                    item.vs_modality.trim() !== '' &&
                    item.vs_time_taken > 40000  // > 40 seconds
                );
                setAnomalyCount(anomalies.length);
                
                // Filter out records without modality and anomalies > 40 seconds
                const filteredData = allData.filter(item => 
                    item.vs_modality && 
                    item.vs_modality.trim() !== '' &&
                    item.vs_time_taken <= 40000  // 40 seconds = 40,000 ms
                );
                setData(filteredData);
                setLoading(false);
            })
            .catch(e => {
                console.log(e);
                setData([]);
                setLoading(false);
                message.error('Error fetching data');
            });
    };

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, []);

    // Refetch when filters change
    useEffect(() => {
        fetchData();
    }, [selectedModality, dateRange]);

    // Get unique modalities for filter options
    useEffect(() => {
        // Fetch all available modalities for filter dropdown
        makeGetCall('/no-auth/get-loading-times')
            .then(res => {
                // Filter out null/empty modalities, anomalies > 150s, and get unique values
                const uniqueModalities = [...new Set(
                    res.data?.data
                        ?.filter(item => item.vs_modality && item.vs_modality.trim() !== '' && item.vs_time_taken <= 150000)
                        ?.map(item => item.vs_modality?.trim())
                        ?.sort()
                )] || [];
                setAllModalities(uniqueModalities);
                
                // Ensure DX is set as default if it exists in the data
                if (uniqueModalities.includes('DX') && !selectedModality) {
                    setSelectedModality('DX');
                }
            })
            .catch(e => {
                console.log(e);
                setAllModalities([]);
            });
    }, []);

    // Calculate statistics
    const times = data.map(item => item.vs_time_taken);
    const totalRecords = data.length;
    const avgLoadTime = times.length > 0 ? Math.round(times.reduce((sum, time) => sum + time, 0) / times.length) : 0;
    const maxLoadTime = times.length > 0 ? Math.max(...times) : 0;
    const minLoadTime = times.length > 0 ? Math.min(...times) : 0;

    // Calculate performance badge
    const getPerformanceBadge = () => {
        if (totalRecords === 0) return null;
        
        // Determine threshold based on exact modality values
        const threshold = selectedModality === 'DX' ? 2000 : 10000; // 2s for DX (X-Ray), 10s for CT/MRI
        
        const recordsAboveThreshold = data.filter(item => item.vs_time_taken > threshold).length;
        const percentageAboveThreshold = (recordsAboveThreshold / totalRecords) * 100;
        
        if (percentageAboveThreshold < 10) {
            return (
                <span 
                    style={{ 
                        backgroundColor: '#52c41a', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        marginLeft: '8px',
                        fontWeight: '500'
                    }}
                >
                    Good Performance ({percentageAboveThreshold.toFixed(1)}% above threshold)
                </span>
            );
        } else {
            return (
                <span 
                    style={{ 
                        backgroundColor: '#fa8c16', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        marginLeft: '8px',
                        fontWeight: '500'
                    }}
                >
                    Poor Performance ({percentageAboveThreshold.toFixed(1)}% above threshold)
                </span>
            );
        }
    };

    // Prepare data for count vs time chart
    const prepareCountVsTimeData = () => {
        const bucketSize = 1; // 1 second buckets
        const maxTime = Math.min(Math.max(...times, 0), 40); // Cap at 40 seconds
        const buckets = [];

        for (let i = 0; i <= maxTime; i += bucketSize) {
            const startTime = i * 1000; // Convert to milliseconds
            const endTime = (i + bucketSize) * 1000;
            const count = data.filter(item => 
                item.vs_time_taken >= startTime && 
                item.vs_time_taken < endTime
            ).length;

            buckets.push({
                timeRange: `${i}s`,
                count,
                startTime,
                endTime
            });
        }

        return { buckets, bucketSize };
    };

    // Prepare data for modality chart
    const prepareModalityChartData = () => {
        const modalityMap = {};
        
        data.forEach(item => {
            const modality = item.vs_modality?.trim();
            if (!modalityMap[modality]) {
                modalityMap[modality] = [];
            }
            modalityMap[modality].push(item.vs_time_taken);
        });

        const modalityData = Object.keys(modalityMap).map(modality => {
            const times = modalityMap[modality];
            return {
                modality,
                avgTime: times.length > 0 ? 
                    Math.round(times.reduce((sum, time) => sum + time, 0) / times.length) : 0,
                maxTime: times.length > 0 ? Math.max(...times) : 0,
                minTime: times.length > 0 ? Math.min(...times) : 0,
                count: modalityMap[modality].length
            };
        });

        const pieData = modalityData.map(item => ({
            name: item.modality,
            value: item.count
        }));

        return { modalityData, pieData };
    };

    const countVsTimeData = prepareCountVsTimeData();
    const { modalityData, pieData } = prepareModalityChartData();
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    // Determine red line position based on modality
    const getRedLinePosition = () => {
        return selectedModality === 'DX' ? 2 : 10; // 2s for DX (X-Ray), 10s for CT/MRI
    };

    // Table columns
    const columns = [
        {
            title: 'ID',
            dataIndex: 'vs_id',
            key: 'vs_id',
            width: 60,
        },
        {
            title: 'User',
            dataIndex: 'vs_user_id',
            key: 'vs_user_id',
            width: 120,
        },
        {
            title: 'Modality',
            dataIndex: 'vs_modality',
            key: 'vs_modality',
            width: 80,
        },
        {
            title: 'Time Taken (ms)',
            dataIndex: 'vs_time_taken',
            key: 'vs_time_taken',
            width: 120,
            render: (time) => `${time}ms`,
            sorter: (a, b) => a.vs_time_taken - b.vs_time_taken,
        },
        {
            title: 'Instances',
            dataIndex: 'vs_total_instances',
            key: 'vs_total_instances',
            width: 90,
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160,
            render: (date) => new Date(date).toLocaleString(),
        },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>PACS Loading Time Statistics Dashboard</h2>
            
            {/* Filters */}
            <Card style={{ marginBottom: '20px' }}>
                <Row gutter={16}>
                    <Col span={6}>
                        <Select
                            placeholder="Select Modality"
                            style={{ width: '100%' }}
                            value={selectedModality}
                            onChange={setSelectedModality}
                            allowClear
                        >
                            {allModalities.map(modality => (
                                <Option key={modality} value={modality}>{modality}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={6}>
                        <RangePicker
                            placeholder={['Start Date', 'End Date']}
                            style={{ width: '100%' }}
                            value={dateRange}
                            onChange={setDateRange}
                            showTime
                        />
                    </Col>
                    <Col span={12}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <span>Total Records: {totalRecords}</span>
                            {getPerformanceBadge()}
                            {anomalyCount > 0 && (
                                <span style={{ color: '#ff4d4f', fontSize: '12px' }}>
                                    ({anomalyCount} anomalies >40s excluded)
                                </span>
                            )}
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Average Load Time"
                            value={avgLoadTime}
                            suffix="ms"
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Maximum Load Time"
                            value={maxLoadTime}
                            suffix="ms"
                            prefix={<BugOutlined />}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Minimum Load Time"
                            value={minLoadTime}
                            suffix="ms"
                            prefix={<DatabaseOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Records"
                            value={totalRecords}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Count vs Time Bar Chart - HIGHEST PRIORITY */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={24}>
                    <Card title={`Loading Time Distribution by Modality (${countVsTimeData.bucketSize}s buckets)`}>
                        <ResponsiveContainer width="100%" height={450}>
                            <BarChart data={countVsTimeData.buckets} margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="timeRange" 
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                    interval={0}
                                />
                                <YAxis />
                                <Tooltip 
                                    formatter={(value, name) => [value, 'Count']}
                                    labelFormatter={(label) => `Time: ${label}`}
                                />
                                <Bar dataKey="count" fill="#8884d8" />
                                <ReferenceLine 
                                    x={`${getRedLinePosition()}s`} 
                                    stroke="red" 
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    label={{ 
                                        value: `${getRedLinePosition()}s threshold`, 
                                        position: 'top',
                                        offset: 10
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Modality Charts */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={16}>
                    <Card title="Average Load Time by Modality">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={modalityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="modality" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="avgTime" fill="#8884d8" name="Avg Time (ms)" />
                                <Bar dataKey="maxTime" fill="#82ca9d" name="Max Time (ms)" />
                                <Bar dataKey="minTime" fill="#00C49F" name="Min Time (ms)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Records by Modality">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Data Table */}
            <Card title="Detailed Records">
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="vs_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    scroll={{ x: 800 }}
                    size="small"
                />
            </Card>
        </div>
    );
};

export default StatsDashboard;