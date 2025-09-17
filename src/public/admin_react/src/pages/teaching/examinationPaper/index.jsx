import { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { examinationPaperApi } from '@/api/examinationPaper';
import { gradeApi } from '@/api/grade';
import { examinationPaperClassApi } from '@/api/examinationPaperClass';
import { useMount } from 'ahooks';
import { authCheck } from '@/common/function';
import { Button, Popconfirm, InputNumber, App, Space, Switch, Typography } from 'antd';
import {
    OrderedListOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { NavLink } from "react-router-dom";

export default () => {
    const tableRef = useRef();
    const { message } = App.useApp();

    useMount(() => {
        // 加载列表数据
    })

    /////////////////////////刷新表格数据/////////////////////////
    const tableReload = (clearSelected = false) => {
        // 是否清空选中项
        if (clearSelected) {
            tableRef.current.clearSelected();
        }
        tableRef.current.reload();
    }

    /////////////////////////保存排序/////////////////////////
    const [sortArr, setSortArr] = useState([]);
    const updateSort = () => {
        examinationPaperApi.updateSort({ list: sortArr }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableRef.current.reload();
                setSortArr([]);
            } else {
                message.error(res.message)
            }
        })
    }
    // 排序改变的时候
    const sortArrChange = (id, sort) => {
        let _sortArr = [...sortArr];
        let whether = _sortArr.some(_item => {
            if (_item.id === id) {
                _item.sort = sort;
                return true;
            }
        })
        if (!whether) {
            _sortArr.push({
                id,
                sort
            })
        }
        setSortArr(_sortArr);
    }

    /////////////////////////修改状态/////////////////////////
    const updateStatus = (id, status) => {
        examinationPaperApi.updateStatus({
            id,
            status
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableRef.current.reload();
            } else {
                message.error(res.message)
            }
        })
    }

    /////////////////////////删除//////////////////////////
    const del = (id) => {
        examinationPaperApi.delete({
            id
        }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableReload(true);
            } else {
                message.error(res.message)
            }
        })
    }

    // 表格列
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            ellipsis: true,
        },
        {
            title: '题目数量',
            dataIndex: 'examination_paper_question_count',
            search: false,
            render: (_, record) => <Typography.Text type="success">{record.examination_paper_question_count}</Typography.Text>
        },
        {
            title: '所属年级',
            dataIndex: 'grade_id',
            // 定义搜索框类型
            valueType: 'select',
            request: async () => {
                const result = await gradeApi.getList();
                return result.data;
            },
            // 搜索框中的参数
            fieldProps: {
                fieldNames: {
                    label: 'title',
                    value: 'id'
                }
            },
            render: (_, record) => record.Grade?.title || '--',
        },
        {
            title: '试卷分类',
            dataIndex: 'examination_paper_class_id',
            // 定义搜索框类型
            valueType: 'select',
            request: async () => {
                const result = await examinationPaperClassApi.getList();
                return result.data;
            },
            // 搜索框中的参数
            fieldProps: {
                fieldNames: {
                    label: 'title',
                    value: 'id'
                }
            },
            render: (_, record) => record.ExaminationPaperClass?.title || '--',
        },
        {
            title: '状态',
            dataIndex: 'status',
            // 列增加提示
            tooltip: '点击可切换状态',
            // 列增加提示的同时搜索也会增加，所以要干掉搜索的提示
            formItemProps: {
                tooltip: ''
            },
            render: (_, record) => <Switch
                checkedChildren="显示"
                unCheckedChildren="隐藏"
                value={record.status == 1}
                disabled={authCheck('examinationPaperUpdateStatus')}
                onClick={() => {
                    updateStatus(record.id, record.status == 1 ? 2 : 1);
                }}
            />,
            // 定义搜索框类型
            valueType: 'select',
            // 订单搜索框的选择项
            fieldProps: {
                options: [
                    {
                        value: 1,
                        label: '显示',
                    },
                    {
                        value: 2,
                        label: '隐藏',
                    }
                ]
            }
        },
        {
            title: '排序',
            dataIndex: 'sort',
            render: (text, record) => {
                return <InputNumber
                    defaultValue={text}
                    style={{ width: '100px' }}
                    min={0}
                    disabled={authCheck('examinationPaperUpdateSort')}
                    onChange={(value) => {
                        sortArrChange(record.id, value);
                    }}
                />
            },
            search: false,
        },
        {
            title: '添加时间',
            dataIndex: 'create_time',
            // 定义搜索框为日期区间
            valueType: 'dateRange',
            render: (_, render) => render.create_time
        },
        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (_, render) => {
                return <>
                    <NavLink to={authCheck('examinationPaperUpdate') ? '' : `/teaching/examinationPaper/update?id=${render.id}`}>
                        <Button
                            type="link"
                            size="small"
                            disabled={authCheck('examinationPaperUpdate')}
                        >修改</Button>
                    </NavLink>

                    <Popconfirm
                        title="确认要删除吗？"
                        onConfirm={() => { del(render.id) }}
                        disabled={authCheck('examinationPaperDelete')}
                    >
                        <Button
                            type="link"
                            size="small"
                            danger
                            disabled={authCheck('examinationPaperDelete')}
                        >删除</Button>
                    </Popconfirm>
                </>
            },
        },
    ];
    return (
        <>
            <PageContainer
                className="rx-page-container"
                ghost
                header={{
                    title: '试卷管理',
                    style: { padding: '0 24px 12px' },
                }}
            >
                <ProTable
                    actionRef={tableRef}
                    rowKey="id"
                    // 列名
                    columns={columns}
                    // 滚动条
                    scroll={{
                        x: 1000
                    }}
                    options={{
                        fullScreen: true
                    }}
                    columnsState={{
                        // 此table列设置后存储本地的唯一key
                        persistenceKey: 'table_column_' + 'examinationPaper',
                        persistenceType: 'localStorage'
                    }}
                    // 左上角操作
                    headerTitle={
                        <Space>
                            <NavLink to={authCheck('examinationPaperCreate') ? '' : `/teaching/examinationPaper/create`}>
                                <Button
                                    type="primary"
                                    disabled={authCheck('examinationPaperCreate')}
                                    icon={<PlusOutlined />}
                                >添加</Button>
                            </NavLink>
                            <Button
                                type="primary"
                                onClick={updateSort}
                                disabled={authCheck('examinationPaperUpdateSort')}
                                icon={<OrderedListOutlined />}
                            >保存排序</Button>
                        </Space>
                    }
                    // 翻页
                    pagination={{
                        defaultPageSize: 10,
                        size: 'default',
                        // 支持跳到多少页
                        showQuickJumper: true,
                        showSizeChanger: true,
                        responsive: true,
                    }}
                    // 请求数据
                    request={async (params = {}, sort, filter) => {
                        // 排序的时候
                        let orderBy = '';
                        for (let key in sort) {
                            orderBy = key + ' ' + (sort[key] === 'descend' ? 'desc' : 'asc');
                        }
                        const res = await examinationPaperApi.getList({
                            ...params,// 包含了翻页参数跟搜索参数
                            orderBy, // 排序
                            page: params.current,
                        });
                        return {
                            data: res.data.data,
                            success: true,
                            total: res.data.total,
                        };
                    }}
                    // 开启批量选择
                    rowSelection={{
                        preserveSelectedRowKeys: true,
                    }}
                    // 批量选择后左边操作
                    tableAlertRender={({ selectedRowKeys, }) => {
                        return (
                            <Space>
                                <span>已选 {selectedRowKeys.length} 项</span>
                                <Popconfirm
                                    title={`确定批量删除这${selectedRowKeys.length}条数据吗？`}
                                    onConfirm={() => { del(selectedRowKeys) }}
                                    disabled={authCheck('examinationPaperDelete')}
                                >
                                    <Button type="link" size='small' danger icon={<DeleteOutlined />} disabled={authCheck('examinationPaperDelete')}>批量删除</Button>
                                </Popconfirm>
                            </Space>
                        );
                    }}
                />
            </PageContainer>
        </>
    )
}
