import { useRef, useState, lazy } from 'react';
import { ProTable, PageContainer } from '@ant-design/pro-components';
import { examinationPaperClassApi } from '@/api/examinationPaperClass';
import { useMount } from 'ahooks';
import { authCheck } from '@/common/function';
import { Button, Popconfirm, InputNumber, App, Space } from 'antd';
import {
    OrderedListOutlined,
} from '@ant-design/icons';
import Lazyload from '@/component/lazyLoad/index';

const Create = lazy(() => import('./create'));
const Update = lazy(() => import('./update'));

export default () => {
    const tableRef = useRef();
    const [sortArr, setSortArr] = useState([]);
    const { message } = App.useApp();

    //这是给添加删除的时候选择的上级分类，为了保证只能添加二级分类出来
    const [pidList, setPidList] = useState([]);

    useMount(() => {
        //加载列表数据
        //getList();
    })
    /////////////////////////修改的数据////////////////////////
    const [editId, setEditId] = useState(0);

    ///////////////////////////刷新表格数据///////////////////////
    const tableReload = () => {
        tableRef.current.reload();
    }

    ///////////////////////////保存排序///////////////////////////
    const updateSort = () => {
        examinationPaperClassApi.updateSort({ list: sortArr }).then(res => {
            if (res.code === 1) {
                message.success(res.message)
                tableRef.current.reload();
                setSortArr([]);
                tableReload();
            } else {
                message.error(res.message)
            }
        })
    }
    //排序改变的时候
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

    //////////////////////////删除////////////////////////
    const del = (id) => {
        examinationPaperClassApi.delete({
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
            title: '分类名称',
            dataIndex: 'title',
        },
        {
            title: '排序',
            dataIndex: 'sort',
            render: (text, record) => {
                return <InputNumber
                    defaultValue={text}
                    style={{ width: '100px' }}
                    min={0}
                    disabled={authCheck('examinationPaperClassUpdateSort')}
                    onChange={(value) => {
                        sortArrChange(record.id, value);
                    }}
                />
            },
        },
        {
            title: '添加时间',
            dataIndex: 'create_time',
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (_, record) => {
                return <>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => { setEditId(record.id) }}
                        disabled={authCheck('examinationPaperClassUpdate')}
                    >修改</Button>
                    <Popconfirm
                        title={<div style={{ maxWidth: '200px' }}>确认删除吗？</div>}
                        onConfirm={() => { del(record.id) }}
                        disabled={authCheck('examinationPaperClassDelete')}
                    >
                        <Button
                            type="link"
                            size="small"
                            danger
                            disabled={authCheck('examinationPaperClassDelete')}
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
                    title: '测评试卷分类',
                    style: { padding: '0 24px 12px' },
                }}
            >
                <ProTable
                    actionRef={tableRef}
                    rowKey="id"
                    search={false}
                    columns={columns}
                    scroll={{
                        x: 700
                    }}
                    options={{
                        fullScreen: true
                    }}
                    columnsState={{
                        //此table列设置后存储本地的唯一key
                        persistenceKey: 'table_column_' + 'examinationPaperClass',
                        persistenceType: 'localStorage'
                    }}
                    headerTitle={
                        <Space>
                            <Lazyload block={false}>
                                <Create tableReload={tableReload} list={pidList} />
                            </Lazyload>
                            <Button
                                type="primary"
                                onClick={updateSort}
                                disabled={authCheck('examinationPaperClassUpdateSort')}
                                icon={<OrderedListOutlined />}
                            >保存排序</Button>
                            {/* 修改表单 */}
                            <Lazyload block={false}>
                                <Update
                                    tableReload={tableReload}
                                    editId={editId}
                                    setEditId={setEditId}
                                    list={pidList}
                                />
                            </Lazyload>
                        </Space>
                    }
                    pagination={false}
                    request={async (params = {}, sort, filter) => {
                        const result = await examinationPaperClassApi.getList();
                        return {
                            data: result.data,
                            success: true,
                            total: result.data.total,
                        };
                    }}
                />
            </PageContainer>
        </>
    )
}
