import { useRef, lazy, useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { examinationPaperApi } from '@/api/examinationPaper';
import { App, Affix, Flex, Button } from 'antd';
import { useNavigate } from "react-router-dom";
import {
    ProForm,
} from '@ant-design/pro-components';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('../component/form1'));

export default () => {
    const formRef = useRef();
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [submitLoading, setSubmitLoading] = useState(false);

    // 返回上一页
    const onBack = () => {
        navigate('/teaching/examinationPaper');
    }

    return (
        <>
            <PageContainer
                className="rx-page-container"
                ghost
                header={{
                    title: '添加试卷',
                    style: { padding: '0 24px 12px' },
                    onBack: onBack
                }}
            >
                <ProCard bodyStyle={{ paddingBottom: '40px' }}>
                    <ProForm
                        formRef={formRef}
                        layout="vertical"
                        submitter={false}
                        // 可以回车提交
                        isKeyPressSubmit={true}
                        // 不干掉null跟undefined 的数据
                        omitNil={false}
                        onFinish={async (values) => {
                            setSubmitLoading(true);
                            const result = await examinationPaperApi.create(values);
                            if (result.code === 1) {
                                message.success(result.message)
                                // onBack();
                                // return true;
                            } else {
                                message.error(result.message)
                            }
                            setSubmitLoading(false);
                        }}
                    >
                        <Lazyload>
                            <Form1 />
                        </Lazyload>
                    </ProForm>
                </ProCard>
                <Affix offsetBottom={10}>
                    <ProCard boxShadow style={{ marginTop: '10px' }}>
                        <Flex align="center" justify="center" gap="small">
                            <Button
                                loading={submitLoading}
                                type="primary"
                                onClick={() => {
                                    formRef?.current?.submit();
                                }}
                            >保存</Button>
                        </Flex>
                    </ProCard>
                </Affix>
            </PageContainer>
        </>
    )
}
