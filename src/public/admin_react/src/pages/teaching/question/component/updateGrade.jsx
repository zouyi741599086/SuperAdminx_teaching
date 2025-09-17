import { useRef } from 'react';
import { EditOutlined } from '@ant-design/icons';
import {
    ModalForm,
    ProFormSelect,
} from '@ant-design/pro-components';
import { Button, App } from 'antd';
import { authCheck } from '@/common/function';
import { gradeApi } from '@/api/grade';
import { questionApi } from '@/api/question';

export default ({ ids, tableReload, ...props }) => {
    const formRef = useRef();
    const { message } = App.useApp();

    return (
        <ModalForm
            name="updateGrade"
            formRef={formRef}
            title="批量修改年级"
            trigger={
                <Button
                    type="link"
                    size='small'
                    disabled={authCheck('updateGrade')}
                    icon={<EditOutlined />}
                >批量修改年级</Button>
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
                const result = await questionApi.updateGrade({
                    ...values,
                    ids: ids,
                });
                if (result.code === 1) {
                    tableReload(true);
                    message.success(result.message)
                    formRef.current?.resetFields?.()
                    return true;
                } else {
                    message.error(result.message)
                }
            }}
        >
            <ProFormSelect
                name="grade_id"
                label="所属年级"
                placeholder="请选择"
                rules={[
                    { required: true, message: '请选择' }
                ]}
                request={async () => {
                    let result = await gradeApi.getList();
                    return result.data;
                }}
                fieldProps={{
                    fieldNames: {
                        label: 'title',
                        value: 'id'
                    },
                    showSearch: true
                }}
            />
        </ModalForm>
    );
};