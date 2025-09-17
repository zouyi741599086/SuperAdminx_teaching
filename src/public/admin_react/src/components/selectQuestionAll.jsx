import { useState, useEffect } from 'react';
import { DragSortTable, ProTable } from '@ant-design/pro-components';
import { Button, Typography, Table, Row, Col } from 'antd';
import { questionApi } from '@/api/question';
import { gradeApi } from '@/api/grade';

/**
 * 选择题库，多选，返回数组-题的id
 * @param {value} String 默认值
 * @param {onChange} fun 修改value事件
 * @param {valueType} String 返回的value值是要id还是要title
 */
export default ({ value, onChange, valueType = 'title', ...props }) => {
    // 统计数据
    const [total, setTotal] = useState({
        count: 0, // 总题数
        countPoints: 0, // 总分数
        countType1: 0, // 单选题数
        countType2: 0, // 多选题数
    })
    // 存的id的值
    const [_value, set_value] = useState([]);
    // 存的列表，把id的值转成列表
    const [list, setList] = useState([]);

    // 排序改变的时候
    const handleDragSortEnd = (beforeIndex, afterIndex, newDataSource) => {
        setList(newDataSource);
    };
    // list改变的时候统计 跟新本地的值
    useEffect(() => {
        let _total = {
            count: 0, // 总题数
            countPoints: 0, // 总分数
            countType1: 0, // 单选题数
            countType2: 0, // 多选题数
        };
        let _tmp_value = list.map(item => {
            // 统计
            _total.count += 1;
            _total.countPoints += item.points;
            if (item.type == 1) {
                _total.countType1 += 1;
            }
            if (item.type == 2) {
                _total.countType2 += 1;
            }
            return item.id;
        })
        setTotal(_total);

        // 更新本地的值
        set_value(_tmp_value);

    }, [list])

    // 删除值
    const del = id => {
        setList(list.filter(item => item.id !== id));
    }

    // 添加值
    const add = data => {
        setList([...list, data]);
    }

    // 给父组件赋值
    useEffect(() => {
        onChange?.(_value)
    }, [_value])
    // 给本组件复制
    useEffect(() => {
        if (value?.length > 0 && _value?.length == 0) {
            setList(value);
            set_value(value.map(item => item.id));
        }
    }, [value])

    const columns = [
        {
            title: '排序',
            dataIndex: 'sort',
            width: 50,
            className: 'drag-visible',
        },
        {
            title: '题目',
            dataIndex: 'title',
            ellipsis: true,
        },
        {
            title: '分数',
            dataIndex: 'points',
            width: 80,
            render: (_, record) => <Typography.Text type="danger">{record.points}</Typography.Text>,
        },
        {
            title: '类型',
            dataIndex: 'type',
            width: 80,
            render: (_, record) => <>
                {record.type == 1 ? <Typography.Text type="success">单选</Typography.Text> : <Typography.Text type="warning">多选</Typography.Text>}
            </>
        },
        {
            title: '所属年级',
            dataIndex: 'grade_id',
            width: 100,
            render: (_, record) => record.Grade?.title || '--',
        },
        {
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 60,
            render: (_, record) => (
                <Button
                    type="link"
                    size="small"
                    danger
                    onClick={() => {
                        del(record.id)
                    }}
                >删除</Button>
            ),
        },
    ]

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
                    <DragSortTable
                        ghost={true}
                        columns={columns}
                        scroll={{
                            x: 600
                        }}
                        rowKey="id"
                        search={false}
                        pagination={false}
                        options={false}
                        dataSource={list}
                        defaultSize="small"
                        bordered={true}
                        dragSortKey="sort"
                        onDragSortEnd={handleDragSortEnd}
                        footer={() => <>
                            <p>
                                题目：
                                <Typography.Text type="danger">{total.count}</Typography.Text>题；
                                总分数：
                                <Typography.Text type="danger">{total.countPoints}</Typography.Text>分；
                                单选：
                                <Typography.Text type="danger">{total.countType1}</Typography.Text>题；
                                多选：
                                <Typography.Text type="danger">{total.countType2}</Typography.Text>题；
                            </p>

                        </>
                        }
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={12} xxl={12}>
                    <ProTable
                        cardBordered
                        rowKey="id"
                        toolbar={{
                            title: '选择题库',
                        }}
                        scroll={{
                            x: 500
                        }}
                        // 列名
                        columns={[
                            {
                                title: '题目',
                                dataIndex: 'title',
                                ellipsis: true,
                            },
                            {
                                title: '分数',
                                dataIndex: 'points',
                                width: 80,
                                search: false,
                                render: (_, record) => <Typography.Text type="danger">{record.points}</Typography.Text>,
                            },
                            {
                                title: '类型',
                                dataIndex: 'type',
                                // 定义搜索框类型
                                valueType: 'select',
                                width: 80,
                                // 订单搜索框的选择项
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
                                title: '所属年级',
                                dataIndex: 'grade_id',
                                width: 100,
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
                                title: '操作',
                                dataIndex: 'action',
                                search: false,
                                width: 60,
                                fixed: 'right',
                                render: (_, record) => {
                                    return <>
                                        {_value.indexOf(record.id) !== -1 ? <>
                                            <Button
                                                type="link"
                                                size="small"
                                                danger
                                                onClick={() => { del(record.id) }}
                                            >删除</Button>
                                        </> : <>
                                            <Button
                                                type="link"
                                                size="small"
                                                onClick={() => { add(record) }}
                                            >选择</Button>
                                        </>}
                                    </>
                                },
                            },
                        ]}
                        size="small"
                        // 翻页
                        pagination={{
                            defaultPageSize: 10,
                            size: 'small',
                            // 支持跳到多少页
                            showQuickJumper: true,
                            showSizeChanger: true,
                            responsive: true,
                        }}
                        // 搜索表单的控制
                        search={{
                            // layout: 'vertical',
                            filterType: 'light',
                            collapse: true,
                            footerRender: false,
                        }}
                        options={false}
                        // 请求数据
                        request={async (params = {}, sort, filter) => {
                            // 排序的时候
                            let orderBy = '';
                            for (let key in sort) {
                                orderBy = key + ' ' + (sort[key] === 'descend' ? 'desc' : 'asc');
                            }
                            const res = await questionApi.getList({
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
                    />
                </Col>
            </Row>
        </>
    )
}