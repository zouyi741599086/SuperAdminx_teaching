import { useState } from 'react';
import {
    CloudUploadOutlined,
    CloudDownloadOutlined,
    InboxOutlined
} from '@ant-design/icons';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { Button, App, Space, Steps, Upload } from 'antd';
import { questionApi } from '@/api/question';
import { getToken } from '@/common/function';
import { fileApi } from '@/api/file'
import { authCheck } from '@/common/function';

const { Dragger } = Upload;

export default ({ tableReload, ...props }) => {
    const { message, modal } = App.useApp();
    const [open, setOpen] = useState(false);

    //下载导入模板
    const downloadImportExcel = () => {
        message.open({
            type: 'loading',
            content: '模板生成中...',
            duration: 0,
            key: 'excel'
        });
        questionApi.downloadImportExcel().then(res => {
            message.destroy('excel')
            if (res.code === 1 && res.data.filePath && res.data.fileName) {
                message.success('模板已生成')
                setTimeout(() => {
                    if (res.data.filePath.indexOf("http") !== -1) {
                        window.open(`${res.data.filePath}`);
                    } else {
                        window.open(`${fileApi.download}?filePath=${res.data.filePath}&fileName=${res.data.fileName}`);
                    }
                }, 1000)
            } else {
                message.error('模板生成失败')
            }
        })
    }

    //上传导入
    const uploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        action: questionApi.importData,
        headers: {
            token: getToken()
        },
        accept: '.xlsx',
        onChange(info) {
            const { status } = info.file;
            if (status == 'uploading') {
                message.open({
                    type: 'loading',
                    content: '数据导入中...',
                    duration: 0,
                    key: 'excel'
                });
            }
            if (status === 'done') {
                message.destroy('excel');
                if (info.file.response.code === 1) {
                    modal.info({
                        title: '导入成功',
                        content: <>
                            共导入<strong style={{ color: 'red' }}>{info.file.response.data}</strong>道题目~
                        </>,
                        onOk() {
                            setOpen(false);
                        },
                    });
                    if (parseInt(info.file.response.data) > 0) {
                        tableReload();
                    }
                } else {
                    message.error(info.file.response.message);
                }
            } else if (status === 'error') {
                message.open({
                    type: 'error',
                    content: '数据导入失败',
                    duration: 2,
                    key: 'excel'
                });
            }
        },
        onDrop(e) {
        },
    };


    return (
        <ModalForm
            name="importQuestion"
            title="批量导入题库"
            open={open}
            onOpenChange={(_boolean) => {
                setOpen(_boolean);
            }}
            trigger={
                <Button
                    type="primary"
                    ghost
                    icon={<CloudUploadOutlined />}
                    disabled={authCheck('questionImportData')}
                >批量导入</Button>
            }
            width={530}
            submitter={false}
        >
            <Space direction='vertical' style={{ width: '100%' }}>
                <Steps
                    progressDot
                    current={2}
                    direction="vertical"
                    items={[
                        {
                            title: '下载导入模板',
                            description: <>
                                <Button
                                    type="primary"
                                    ghost
                                    icon={<CloudDownloadOutlined />}
                                    onClick={() => {
                                        downloadImportExcel()
                                    }}
                                //style={{ margin: '0px 5px 5px 0px' }}
                                >导入模板</Button>
                            </>,
                        },
                        {
                            title: '录入题目',
                            description: '按照下载的表格模板填充数据',
                        },
                        {
                            title: '上传模板，导入题库',
                            description: <>
                                <Dragger {...uploadProps}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined style={{ fontSize: '40px' }} />
                                    </p>
                                    <p className="ant-upload-text" style={{ fontSize: '14px' }}>单击或拖动文件到此区域进行上传</p>
                                </Dragger>
                            </>,
                        },
                    ]}
                />
            </Space>

        </ModalForm>
    );
};