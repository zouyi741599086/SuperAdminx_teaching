import {
    ProFormText,
} from '@ant-design/pro-components';

export default () => {

    return (
        <>
            <ProFormText
                name="title"
                label="年级"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' }
                ]}
            />
        </>
    )
}
