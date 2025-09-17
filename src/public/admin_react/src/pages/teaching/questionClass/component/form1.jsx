import {
    ProFormText,
} from '@ant-design/pro-components';

export default ({ type, ...props }) => {

    return (
        <>
            <ProFormText
                name="title"
                label="分类名称"
                placeholder="请输入"
                rules={[
                    { required: true, message: '请输入' }
                ]}
            />
        </>
    )
}
