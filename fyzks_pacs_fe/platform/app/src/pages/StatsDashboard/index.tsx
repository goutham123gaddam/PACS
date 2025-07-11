import React, { useState, useEffect } from "react";
import { Card, Row, Col, Select, DatePicker, Table, Statistic, Spin, message } from "antd";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from "recharts";
import { ClockCircleOutlined, UserOutlined, DatabaseOutlined, BugOutlined } from "@ant-design/icons";
import { makeGetCall } from "../../utils/helper";

const { Option } = Select;

const StatsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [anomalyCount, setAnomalyCount] = useState(0);
    const [selectedModality, setSelectedModality] = useState(null);
    const [createdAfter, setCreatedAfter] = useState(null);

    // Fetch data from API with filters
    const fetchData = () => {
        setLoading(true);
        
        const params = new URLSearchParams();
        if (selectedModality) params.append('modality', selectedModality);
        if (createdAfter) params.append('created_after', createdAfter.toISOString());

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
    }, [selectedModality, createdAfter]);

    // Get unique modalities for filter options
    const [allModalities, setAllModalities] = useState([]);
    
    useEffect(() => {
        // Fetch all available modalities for filter dropdown
        makeGetCall('/no-auth/get-loading-times')
            .then(res => {
                // Filter out null/empty modalities, anomalies > 150s, and get unique values
                const modalities = [...new Set(
                    (res.data?.data || [])
                        .filter(item => 
                            item.vs_modality && 
                            item.vs_modality.trim() !== '' &&
                            item.vs_time_taken <= 40000  // 40 seconds = 40,000 ms
                        )
                        .map(item => item.vs_modality)
                )];
                setAllModalities(modalities);
            })
            .catch(e => {
                console.log(e);
                setAllModalities([]);
            });
    }, []);

    // Calculate statistics
    const calculateStats = () => {
        if (data.length === 0) return { avgLoadTime: 0, maxLoadTime: 0, minLoadTime: 0, totalRecords: 0 };
        
        const times = data.map(item => item.vs_time_taken);
        return {
            avgLoadTime: Math.round(times.reduce((sum, time) => sum + time, 0) / times.length),
            maxLoadTime: Math.max(...times),
            minLoadTime: Math.min(...times),
            totalRecords: data.length
        };
    };

    const { avgLoadTime, maxLoadTime, minLoadTime, totalRecords } = calculateStats();

    // Prepare count vs time bar chart data for each modality
    const prepareCountVsTimeData = () => {
        const modalities = [...new Set(data.map(item => item.vs_modality).filter(Boolean))];
        const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
        
        if (data.length === 0) {
            return { buckets: [], modalities, colors, maxCount: 1 };
        }
        
        // Calculate dynamic bucket size based on data range (max 40s)
        const maxTime = Math.max(...data.map(item => item.vs_time_taken));
        const maxTimeInSeconds = Math.min(maxTime / 1000, 40); // Cap at 40 seconds
        
        let bucketSize, bucketCount;
        
        // Dynamic bucket sizing logic for 0-40s range
        if (maxTimeInSeconds <= 5) {
            bucketSize = 0.5;  // 0.5s buckets for 0-5s
        } else if (maxTimeInSeconds <= 10) {
            bucketSize = 1;    // 1s buckets for 5-10s
        } else if (maxTimeInSeconds <= 20) {
            bucketSize = 2;    // 2s buckets for 10-20s
        } else {
            bucketSize = 5;    // 5s buckets for 20-40s
        }
        
        // Ensure we have a reasonable number of buckets (max 25)
        bucketCount = Math.ceil(maxTimeInSeconds / bucketSize);
        if (bucketCount > 25) {
            bucketSize = Math.ceil(maxTimeInSeconds / 25);
            bucketCount = Math.ceil(maxTimeInSeconds / bucketSize);
        }
        
        const buckets = [];
        let maxCount = 0;
        
        // Create dynamic buckets
        for (let i = 0; i < bucketCount; i++) {
            const bucketStart = i * bucketSize;
            const bucketEnd = (i + 1) * bucketSize;
            
            // Format label based on bucket size
            let bucketLabel;
            if (bucketSize < 1) {
                bucketLabel = `${bucketStart}s - ${bucketEnd}s`;
            } else if (bucketSize < 60) {
                bucketLabel = `${Math.round(bucketStart)}s - ${Math.round(bucketEnd)}s`;
            } else {
                const startMin = Math.floor(bucketStart / 60);
                const startSec = Math.round(bucketStart % 60);
                const endMin = Math.floor(bucketEnd / 60);
                const endSec = Math.round(bucketEnd % 60);
                bucketLabel = `${startMin}:${startSec.toString().padStart(2, '0')} - ${endMin}:${endSec.toString().padStart(2, '0')}`;
            }
            
            const bucketData = { 
                timeRange: bucketLabel, 
                bucketStart, 
                bucketEnd,
                bucketSize,
                isAfter2Seconds: bucketStart >= 2.0
            };
            
            let bucketTotal = 0;
            // Count records for each modality in this time bucket
            modalities.forEach(modality => {
                const count = data.filter(item => {
                    const timeInSeconds = item.vs_time_taken / 1000;
                    return item.vs_modality === modality && 
                           timeInSeconds >= bucketStart && 
                           timeInSeconds < bucketEnd;
                }).length;
                
                bucketData[modality] = count;
                bucketTotal += count;
            });
            
            maxCount = Math.max(maxCount, bucketTotal);
            buckets.push(bucketData);
        }
        
        return { buckets, modalities, colors, maxCount: maxCount + 1, bucketSize };
    };

    // Prepare chart data for modality analysis
    const prepareModalityChartData = () => {
        const modalities = [...new Set(data.map(item => item.vs_modality).filter(Boolean))];
        
        const modalityData = modalities.map(modality => {
            const modalityRecords = data.filter(item => item.vs_modality === modality);
            const times = modalityRecords.map(item => item.vs_time_taken);
            
            return {
                modality,
                avgTime: times.length > 0 ? Math.round(times.reduce((sum, time) => sum + time, 0) / times.length) : 0,
                maxTime: times.length > 0 ? Math.max(...times) : 0,
                minTime: times.length > 0 ? Math.min(...times) : 0,
                count: modalityRecords.length
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
                    <Col span={8}>
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
                    <Col span={8}>
                        <DatePicker
                            placeholder="Created After"
                            style={{ width: '100%' }}
                            value={createdAfter}
                            onChange={setCreatedAfter}
                            showTime
                        />
                    </Col>
                    <Col span={8}>
                        <span>
                            Total Records: {totalRecords}
                            {anomalyCount > 0 && (
                                <span style={{ color: '#ff4d4f', fontSize: '12px', marginLeft: '8px' }}>
                                    ({anomalyCount} anomalies >40s excluded)
                                </span>
                            )}
                        </span>
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
                                    fontSize={12}
                                />
                                <YAxis 
                                    label={{ value: 'Count of Records', angle: -90, position: 'insideLeft' }}
                                    domain={[0, countVsTimeData.maxCount]}
                                />
                                <Tooltip 
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div style={{ 
                                                    backgroundColor: '#fff', 
                                                    padding: '10px', 
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px'
                                                }}>
                                                    <p><strong>Time Range:</strong> {label}</p>
                                                    {payload.map((entry, index) => (
                                                        <p key={index} style={{ color: entry.color }}>
                                                            <strong>{entry.dataKey}:</strong> {entry.value} records
                                                        </p>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                
                                {/* Dynamic reference line at 2 seconds */}
                                {countVsTimeData.bucketSize <= 5 && (
                                    <ReferenceLine 
                                        x={countVsTimeData.buckets.find(b => b.bucketStart >= 2.0)?.timeRange || "2s - 4s"} 
                                        stroke="#ff4d4f" 
                                        strokeWidth={3}
                                        strokeDasharray="6 6"
                                    />
                                )}
                                
                                {countVsTimeData.modalities.map((modality, index) => (
                                    <Bar
                                        key={modality}
                                        dataKey={modality}
                                        stackId="modality"
                                        fill={countVsTimeData.colors[index % countVsTimeData.colors.length]}
                                        name={modality}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            {/* Charts */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={16}>
                    <Card title="Average Load Time by Modality">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={modalityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="modality" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value}ms`, 'Time']} />
                                <Legend />
                                <Bar dataKey="avgTime" fill="#0088FE" name="Average Time (ms)" />
                                <Bar dataKey="maxTime" fill="#FF8042" name="Max Time (ms)" />
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