import { useRef, lazy } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { Button, App } from 'antd';
import { authCheck } from '@/common/function';
import { examinationPaperClassApi } from '@/api/examinationPaperClass';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

export default (props) => {
    const formRef = useRef();
    const { message } = App.useApp();

    return (
        <ModalForm
            name="examinationpagerclassadd"
            formRef={formRef}
            title="添加分类"
            trigger={
                <Button
                    type="primary"
                    disabled={authCheck('examinationPaperClassCreate')}
                    icon={<PlusOutlined />}
                >添加分类</Button>
            }
            width={460}
            colProps={{ md: 12, xs: 24 }}
            //第一个输入框获取焦点
            autoFocusFirstInput={true}
            //可以回车提交
            isKeyPressSubmit={true}
            //不干掉null跟undefined 的数据
            omitNil={false}
            onFinish={async (values) => {
                const result = await examinationPaperClassApi.create(values);
                if (result.code === 1) {
                    props.tableReload();
                    message.success(result.message)
                    formRef.current?.resetFields?.()
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <Lazyload height={50}>
                <Form1 />
            </Lazyload>
        </ModalForm>
    );
};