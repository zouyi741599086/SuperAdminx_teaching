import { useRef, useState, lazy } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { examinationResultApi } from '@/api/examinationResult';
import { examinationPaperClassApi } from '@/api/examinationPaperClass';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Typography, Tooltip, Space, Progress, Avatar } from 'antd';
import { fileApi } from '@/api/file';
import { authCheck } from '@/common/function';
import {
    CloudDownloadOutlined,
} from '@ant-design/icons';
import { green } from '@ant-design/colors';
import Lazyload from '@/component/lazyLoad/index';

const SelectUser = lazy(() => import('@/components/selectUser'));
const Info = lazy(() => import('./info/index'));

export default () => {
    const { message } = App.useApp();
    const tableRef = useRef();
    const formRef = useRef();

    // 删除
    const del = (id) => {
        examinationResultApi.delete({
            id
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableReload();
            } else {
                message.error(res.message)
            }
        })
    }

    /////////////////////////导出////////////////////////
    const exportData = () => {
        message.open({
            type: 'loading',
            content: '数据生成中...',
            duration: 0,
            key: 'excel'
        });
        let params = formRef.current.getFieldsValue();
        examinationResultApi.exportData(params).then(res => {
            message.destroy('excel')
            if (res.code === 1 && res.data.filePath && res.data.fileName) {
                message.success('数据已生成');
                setTimeout(() => {
                    if (res.data.filePath.indexOf("http") !== -1) {
                        window.open(`${res.data.filePath}`);
                    } else {
                        window.open(`${fileApi.download}?filePath=${res.data.filePath}&fileName=${res.data.fileName}`);
                    }
                }, 1000)
            } else {
                message.error('数据导出失败');
            }
        })
    }

    //刷新表格数据
    const tableReload = () => {
        tableRef.current.reload();
    }

    // 查看订单详情的id
    const [infoId, setInfoId] = useState(null);

    //表格列
    const columns = [
        {
            title: '用户',
            dataIndex: 'user_id',
            search: true,
            valueType: 'selectTable',
            renderFormItem: () => <SelectUser />,
            render: (_, record) => {
                if (record.User) {
                    return <div style={{ display: 'flex' }}>
                        <Avatar
                            src={record.User?.img}
                            style={{
                                flexShrink: 0
                            }}
                        >{record.User?.name?.substr(0, 1)}</Avatar>
                        <div style={{ paddingLeft: '5px' }}>
                            {record.User?.name}<br />
                            <Typography.Paragraph>{record.User?.tel}</Typography.Paragraph>
                        </div>
                    </div>
                }
                return '--';
            },
        },
        {
            title: '试卷分类',
            dataIndex: 'examination_paper_class_id',
            //定义搜索框类型
            valueType: 'select',
            request: async () => {
                const result = await examinationPaperClassApi.getList();
                return result.data;
            },
            //搜索框中的参数
            fieldProps: {
                fieldNames: {
                    label: 'title',
                    value: 'id'
                }
            },
            render: (_, record) => record.ExaminationPaperClass?.title || '--',
        },
        {
            title: '测评试卷',
            dataIndex: 'title',
            ellipsis: true,
        },
        {
            title: '得分情况',
            dataIndex: 'points',
            search: false,
            sorter: true,
            render: (_, record) => <>
                <Typography.Text type="danger">{record.points}</Typography.Text>/
                <Typography.Text type="success">{record.points_sum}</Typography.Text>
            </>
        },
        {
            title: '正确率',
            dataIndex: 'percent',
            search: false,
            sorter: true,
            render: (_, record) => <Progress
                percent={record.percent}
                strokeColor={green[5]}
                size="small"
                format={(percent) => {
                    return `${percent}%`
                }}
                percentPosition={{
                    align: 'end',
                    type: 'outer',
                }}
            />
        },
        {
            title: '作答用时',
            dataIndex: 'examination_minutes',
            search: false,
            sorter: true,
            render: (_, record) => `${record.examination_minutes}分钟`
        },
        {
            title: '测评时间',
            dataIndex: 'create_time',
            valueType: 'dateRange',
            render: (_, record) => record.create_time
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (_, record) => {
                return <>
                    <Button
                        type="link"
                        size="small"
                        disabled={authCheck('examinationResultInfo')}
                        onClick={() => {
                            setInfoId(record.id);
                        }}
                    >详情</Button>
                    <Popconfirm
                        title="确认要删除吗？"
                        onConfirm={() => { del(record.id) }}
                        disabled={authCheck('examinationResultDelete')}
                    >
                        <Button
                            type="link"
                            size="small"
                            danger
                            disabled={authCheck('examinationResultDelete')}
                        >删除</Button>
                    </Popconfirm>
                </>
            },
            search: false,
        },
    ];
    return (
        <>
            <PageContainer
                className="rx-page-container"
                ghost
                header={{
                    title: '考试结果',
                    style: { padding: '0 24px 12px' },
                }}
            >
                <ProTable
                    actionRef={tableRef}
                    formRef={formRef}
                    rowKey="id"
                    columns={columns}
                    scroll={{
                        x: 1000
                    }}
                    options={{
                        fullScreen: true
                    }}
                    columnsState={{
                        //此table列设置后存储本地的唯一key
                        persistenceKey: 'table_column_' + 'examination',
                        persistenceType: 'localStorage'
                    }}
                    headerTitle={
                        <Space>
                            <Tooltip title="根据当前搜索条件导出数据">
                                <Button
                                    type="primary"
                                    danger
                                    ghost
                                    icon={<CloudDownloadOutlined />}
                                    onClick={exportData}
                                    disabled={authCheck('examinationResultExportData')}
                                >导出</Button>
                            </Tooltip>
                            <Lazyload
                                block={false}
                            >
                                <Info
                                    infoId={infoId}
                                    setInfoId={setInfoId}
                                    tableReload={tableReload}
                                />
                            </Lazyload>
                        </Space>
                    }
                    pagination={{
                        defaultPageSize: 10,
                        size: 'default',
                        //支持跳到多少页
                        showQuickJumper: true,
                        showSizeChanger: true,
                        responsive: true,
                    }}
                    request={async (params = {}, sort, filter) => {
                        //排序的时候
                        let orderBy = '';
                        for (let key in sort) {
                            orderBy = key + ' ' + (sort[key] === 'descend' ? 'desc' : 'asc');
                        }
                        const result = await examinationResultApi.getList({
                            ...params,//包含了翻页参数跟搜索参数
                            orderBy, //排序
                            page: params.current,
                        });
                        if (result.code !== 1) {
                            message.error(result.message);
                        }
                        return {
                            data: result.data.data,
                            success: true,
                            total: result.data.total,
                        };
                    }}
                />
            </PageContainer>
        </>
    )
}
