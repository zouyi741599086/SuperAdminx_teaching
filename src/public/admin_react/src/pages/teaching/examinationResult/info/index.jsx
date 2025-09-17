import { useRef, useState, useEffect } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { examinationResultApi } from '@/api/examinationResult';
import { examinationResultQuestionApi } from '@/api/examinationResultQuestion';
import { App, Space, Descriptions, Typography, Progress, Drawer } from 'antd';
import { green } from '@ant-design/colors';

export default ({ infoId, setInfoId, ...props }) => {
    const { message } = App.useApp();
    const tableRef = useRef();

    const [id, setId] = useState();
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (infoId) {
            setId(infoId);
            findData(infoId);
            setOpen(true);
        }
    }, [infoId]);

    ////////////////获取详情////////////////////
    const findData = (_id = null) => {
        examinationResultApi.findData({
            id: _id || id
        }).then(res => {
            if (res.code === 1) {
                setData(res.data);
                setItems([
                    {
                        key: 'user_id',
                        label: '用户',
                        children: `${res.data.User.name}/${res.data.User.tel}`
                    },
                    {
                        key: 'ExaminationPaperClass',
                        label: '试卷分类',
                        children: res.data.ExaminationPaperClass?.title || '--',
                    },
                    {
                        key: 'title',
                        label: '测评试卷',
                        children: res.data.title,
                    },
                    {
                        key: 'points',
                        label: '得分',
                        children: <>
                            <Typography.Text type="danger">{res.data?.points}</Typography.Text>/
                            <Typography.Text type="success">{res.data?.points_sum}</Typography.Text>
                        </>
                    },
                    {
                        key: 'percent',
                        label: '正确率',
                        children: <>
                            <Progress
                                percent={res.data.percent}
                                strokeColor={green[5]}
                                size={[120, 6]}
                                format={(percent) => {
                                    return `${percent}%`
                                }}
                                percentPosition={{
                                    align: 'end',
                                    type: 'outer',
                                }}
                            />
                        </>
                    },
                    {
                        key: 'examination_minutes',
                        label: '作答时间',
                        children: `${res.data.examination_minutes}分钟`
                    },
                    {
                        key: 'create_time',
                        label: '考试时间',
                        children: res.data.create_time
                    }
                ])
            } else {
                message.error(res.message);
                onBack();
            }
        })
    }
    return (
        <>
            <Drawer
                width={1000}
                title="考试详情"
                open={open}
                onClose={() => {
                    setOpen(false);
                    setInfoId(null);
                    setData({});
                }}
                loading={data?.id ? false : true}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">

                    <Descriptions
                        size="small"
                        column={2}
                        items={items}
                    />

                    <ProTable
                        actionRef={tableRef}
                        className="pro-table-info"
                        rowKey="id"
                        size="small"
                        bordered={true}
                        options={false}
                        columns={[
                            {
                                title: '题目',
                                dataIndex: 'title',
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
                                title: '做题结果',
                                dataIndex: 'is_correct',
                                //定义搜索框类型
                                valueType: 'select',
                                //订单搜索框的选择项
                                fieldProps: {
                                    options: [
                                        {
                                            value: 1,
                                            label: '错误',
                                        },
                                        {
                                            value: 2,
                                            label: '正确',
                                        },
                                    ]
                                },
                                render: (_, record) => <>
                                    {record.is_correct == 1 ? <Typography.Text type="danger">错误</Typography.Text> : <Typography.Text type="success">正确</Typography.Text>}
                                </>
                            },
                        ]}
                        scroll={{
                            x: 800
                        }}
                        pagination={{
                            defaultPageSize: 10,
                            size: 'small',
                            //支持跳到多少页
                            showQuickJumper: true,
                            showSizeChanger: true,
                            responsive: true,
                        }}
                        expandable={{
                            rowExpandable: () => true,
                            expandedRowRender: (record) => {
                                let success = '';
                                let error = '';
                                record.ExaminationResultQuestionOptions.map((item, index) => {
                                    let alphabet = String.fromCharCode(index + 65);
                                    if (item.is_answer == 2) {
                                        success += alphabet;
                                    }
                                    if (item.user_is_answer == 2) {
                                        error += alphabet;
                                    }
                                })
                                return <>
                                    <div>正确选项：<Typography.Text type="success">{success}</Typography.Text>，用户选择：<Typography.Text type="danger">{error}</Typography.Text></div>
                                    {record.ExaminationResultQuestionOptions.map((item, index) => {
                                        let alphabet = String.fromCharCode(index + 65);
                                        return <div><b>{alphabet}、</b>{item.title}</div>
                                    })}
                                </>
                            }
                        }}
                        request={async (params = {}, sort, filter) => {
                            const result = await examinationResultQuestionApi.getList({
                                ...params,//包含了翻页参数跟搜索参数
                                page: params.current,
                                examination_result_id: id,
                            });
                            return {
                                data: result.data.data,
                                success: true,
                                total: result.data.total,
                            };
                        }}
                    />

                </Space>
            </Drawer>
        </>
    )
}
