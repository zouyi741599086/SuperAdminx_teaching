import { useRef, useState, lazy } from 'react';
import {
    ModalForm,
} from '@ant-design/pro-components';
import { App } from 'antd';
import { questionClassApi } from '@/api/questionClass';
import { useUpdateEffect } from 'ahooks';
import Lazyload from '@/component/lazyLoad/index';

const Form1 = lazy(() => import('./../component/form1'));

export default (props) => {
    const formRef = useRef();
    const [open, setOpen] = useState(false);
    const { message } = App.useApp();

    useUpdateEffect(() => {
        if (props.editId > 0) {
            setOpen(true);
        }
    }, [props.editId])

    return (
        <ModalForm
            name="editQuestClass"
            formRef={formRef}
            open={open}
            onOpenChange={(_boolean) => {
                setOpen(_boolean);
                //关闭的时候干掉editId，不然无法重复修改同一条数据
                if (_boolean === false) {
                    props.setEditId(0);
                }
            }}
            title="修改分类"
            width={460}
            //第一个输入框获取焦点
            autoFocusFirstInput={true}
            //可以回车提交
            isKeyPressSubmit={true}
            //不干掉null跟undefined 的数据
            omitNil={true}
            modalProps={{
                //关闭的时候销毁modal里的子元素，因为重复修改一条数据后request返回无法赋值到form里面，官方bug
                destroyOnHidden: true,
            }}
            params={{
                id: props.editId
            }}
            request={async (params) => {
                if (!props.editId) {
                    return {};
                }
                const result = await questionClassApi.findData(params);
                if (result.code === 1) {
                    return result.data;
                } else {
                    message.error(result.message);
                    setOpen(false);
                }
            }}
            onFinish={async (values) => {
                const result = await questionClassApi.update({
                    id: props.editId,
                    ...values,
                });
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
                <Form1 type='edit' list={props.list} />
            </Lazyload>
        </ModalForm>
    );
};