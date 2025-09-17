import { useRef, lazy } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { questionApi } from '@/api/question';
import { gradeApi } from '@/api/grade';
import { questionClassApi } from '@/api/questionClass';
import { useMount } from 'ahooks';
import { App, Typography, Space, Button, Popconfirm } from 'antd';
import { authCheck } from '@/common/function';
import {
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { NavLink } from "react-router-dom";
import Lazyload from '@/component/lazyLoad/index';

const ImportQuestion = lazy(() => import('./component/importQuestion'));
const UpdateQuestionClass = lazy(() => import('./component/updateQuestionClass'));
const UpdateGrade = lazy(() => import('./component/updateGrade'));

export default () => {
    const { message } = App.useApp();
    const tableRef = useRef();
    const formRef = useRef();

    useMount(() => {
        //加载列表数据
    })
    ///////////////////////////刷新表格数据///////////////////////
    const tableReload = () => {
        tableRef.current.reload();
        tableRef.current.clearSelected();
    }

    //////////////////////////删除////////////////////////
    const del = (id) => {
        questionApi.delete({
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

    //表格列
    const columns = [
        {
            title: '题目',
            dataIndex: 'title',
            ellipsis: true,
        },
        {
            title: '分数',
            dataIndex: 'points',
            search: false,
            render: (_, record) => <Typography.Text type="danger">{record.points}</Typography.Text>,
        },
        {
            title: '类型',
            dataIndex: 'type',
            //定义搜索框类型
            valueType: 'select',
            //订单搜索框的选择项
            fieldProps: {
                options: [
                    {
                        value: 1,
                        label: '单选',
                    },
                    {
                        value: 2,
                        label: '多选',
                    },
                ]
            },
            render: (_, record) => <>
                {record.type == 1 ? <Typography.Text type="success">单选</Typography.Text> : <Typography.Text type="warning">多选</Typography.Text>}
            </>
        },
        {
            title: '题库分类',
            dataIndex: 'question_class_id',
            //定义搜索框类型
            valueType: 'select',
            request: async () => {
                const result = await questionClassApi.getList();
                return result.data;
            },
            //搜索框中的参数
            fieldProps: {
                fieldNames: {
                    label: 'title',
                    value: 'id'
                }
            },
            render: (_, record) => record.QuestionClass?.title || '--',
        },
        {
            title: '所属年级',
            dataIndex: 'grade_id',
            //定义搜索框类型
            valueType: 'select',
            request: async () => {
                const result = await gradeApi.getList();
                return result.data;
            },
            //搜索框中的参数
            fieldProps: {
                fieldNames: {
                    label: 'title',
                    value: 'id'
                }
            },
            render: (_, record) => record.Grade?.title || '--',
        },
        {
            title: '添加时间',
            dataIndex: 'create_time',
            //定义搜索框为日期区间
            valueType: 'dateRange',
            render: (_, record) => record.create_time
        },
        {
            title: '操作',
            dataIndex: 'action',
            search: false,
            render: (_, record) => {
                return <>
                    <NavLink to={authCheck('questionUpdate') ? '' : `/teaching/question/update?id=${record.id}`}>
                        <Button
                            type="link"
                            size="small"
                            disabled={authCheck('questionUpdate')}
                        >修改</Button>
                    </NavLink>

                    <Popconfirm
                        title="确认要删除吗？"
                        onConfirm={() => { del(record.id) }}
                        disabled={authCheck('questionDelete')}
                    >
                        <Button
                            type="link"
                            size="small"
                            danger
                            disabled={authCheck('questionDelete')}
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
                    title: '题库',
                    style: { padding: '0 24px 12px' },
                }}
            >
                <ProTable
                    actionRef={tableRef}
                    formRef={formRef}
                    rowKey="id"
                    //列名
                    columns={columns}
                    //滚动条
                    scroll={{
                        x: 1000
                    }}
                    options={{
                        fullScreen: true
                    }}
                    columnsState={{
                        //此table列设置后存储本地的唯一key
                        persistenceKey: 'table_column_' + 'question',
                        persistenceType: 'localStorage'
                    }}
                    //左上角操作
                    headerTitle={
                        <Space>
                            <NavLink to={authCheck('questionCreate') ? '' : `/teaching/question/create`}>
                                <Button
                                    type="primary"
                                    disabled={authCheck('questionCreate')}
                                    icon={<PlusOutlined />}
                                >添加</Button>
                            </NavLink>
                            <Lazyload block={false}>
                                <ImportQuestion
                                    tableReload={tableReload}
                                />
                            </Lazyload>
                        </Space>
                    }
                    //翻页
                    pagination={{
                        defaultPageSize: 10,
                        size: 'default',
                        //支持跳到多少页
                        showQuickJumper: true,
                        showSizeChanger: true,
                        responsive: true,
                    }}
                    //请求数据
                    request={async (params = {}, sort, filter) => {
                        //排序的时候
                        let orderBy = '';
                        for (let key in sort) {
                            orderBy = key + ' ' + (sort[key] === 'descend' ? 'desc' : 'asc');
                        }
                        const res = await questionApi.getList({
                            ...params,//包含了翻页参数跟搜索参数
                            orderBy, //排序
                            page: params.current,
                        });
                        return {
                            data: res.data.data,
                            success: true,
                            total: res.data.total,
                        };
                    }}
                    expandable={{
                        rowExpandable: () => true,
                        expandedRowRender: (record) => {
                            let success = '';
                            record.QuestionOptions.map((item, index) => {
                                let alphabet = String.fromCharCode(index + 65);
                                if (item.is_answer == 2) {
                                    success += alphabet;
                                }
                            })
                            return <>
                                <div>正确选项：<Typography.Text type="success">{success}</Typography.Text></div>
                                {record.QuestionOptions.map((item, index) => {
                                    let alphabet = String.fromCharCode(index + 65);
                                    return <div><b>{alphabet}、</b>{item.title}</div>
                                })}
                            </>
                        }
                    }}
                    //开启批量选择
                    rowSelection={{
                        preserveSelectedRowKeys: true,
                    }}
                    //批量选择后左边操作
                    tableAlertRender={({ selectedRowKeys, }) => {
                        return (
                            <Space>
                                <span>已选 {selectedRowKeys.length} 项</span>
                                <Popconfirm
                                    title={`确定批量删除这${selectedRowKeys.length}条数据吗？`}
                                    onConfirm={() => { del(selectedRowKeys) }}
                                    disabled={authCheck('questionDelete')}
                                >
                                    <Button
                                        type="link"
                                        size='small'
                                        danger
                                        icon={<DeleteOutlined />}
                                        disabled={authCheck('questionDelete')}
                                    >批量删除</Button>
                                </Popconfirm>

                                <Lazyload block={false}>
                                    <UpdateQuestionClass
                                        tableReload={tableReload}
                                        ids={selectedRowKeys}
                                    />
                                    <UpdateGrade
                                        tableReload={tableReload}
                                        ids={selectedRowKeys}
                                    />
                                </Lazyload>
                            </Space>
                        );
                    }}
                />
            </PageContainer>
        </>
    )
}
