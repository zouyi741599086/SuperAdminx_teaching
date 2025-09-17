import { useRef, lazy, useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { questionApi } from '@/api/question';
import { App, Affix, Flex, Button, Card } from 'antd';
import { useNavigate } from "react-router-dom";
import {
    ProForm,
} from '@ant-design/pro-components';
import Lazyload from '@/component/lazyLoad/index';
import { useSearchParams } from "react-router-dom";

const Form1 = lazy(() => import('./../component/form1'));
const Form2 = lazy(() => import('./../component/form2'));

export default () => {
    const formRef = useRef();
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [submitLoading, setSubmitLoading] = useState(false);
    const [search] = useSearchParams();


    //返回上一页
    const onBack = () => {
        navigate('/teaching/question');
    }

    const [activeKey, setActiveKey] = useState('1');

    return (
        <>
            <PageContainer
                className="rx-page-container"
                ghost
                header={{
                    title: '编辑',
                    style: { padding: '0 24px 12px' },
                    onBack: onBack
                }}
            >
                <Card
                    tabList={[
                        {
                            label: `基本信息`,
                            key: '1',
                        },
                        {
                            label: `题目解析`,
                            key: '2',
                        },
                    ]}
                    activeTabKey={activeKey}
                    onTabChange={setActiveKey}
                >
                    <ProForm
                        formRef={formRef}
                        layout="vertical"
                        submitter={false}
                        //可以回车提交
                        isKeyPressSubmit={true}
                        //不干掉null跟undefined 的数据
                        omitNil={false}
                        onFinish={async (values) => {
                            setSubmitLoading(true);
                            //知识点是数组，只要最后一个id
                            if (values.course_class_id) {
                                values.course_class_id = values.course_class_id[values.course_class_id.length - 1];
                            }
                            const result = await questionApi.update({
                                ...values,
                                id: search.get('id'),
                            });
                            if (result.code === 1) {
                                message.success(result.message)
                                onBack();
                                return true;
                            } else {
                                message.error(result.message)
                                setSubmitLoading(false);
                            }
                        }}
                        onFinishFailed={({ errorFields }) => {
                            //form验证失败的时候，用来自动切换顶部
                            if (['title', 'type', 'QuestionOptions'].includes(errorFields[0].name[0])) {
                                setActiveKey(1)
                            }
                        }}
                        request={async () => {
                            let id = search.get('id');
                            if (!id) {
                                onBack();
                            }
                            const result = await questionApi.findData({ id })
                            if (result.code !== 1) {
                                message.error(result.message)
                                onBack();
                            }

                            //所属知识点要的是数组
                            if (result.data.CourseClass) {
                                result.data.course_class_id = result.data.CourseClass.pid_path.split(',').filter(Boolean).map(Number);
                            }

                            return result.data;
                        }}
                    >
                        <div style={{ width: '100%', display: activeKey == '1' ? 'block' : 'none' }}>
                            <Lazyload>
                                <Form1 formRef={formRef} typeAction='update'/>
                            </Lazyload>
                        </div>
                        <div style={{ display: activeKey == '2' ? 'block' : 'none' }}>
                            <Lazyload>
                                <Form2 formRef={formRef} typeAction='update'/>
                            </Lazyload>
                        </div>
                    </ProForm>
                </Card>
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
