import { lazy } from 'react';
import {
    ProForm,
} from '@ant-design/pro-components';

const Teditor = lazy(() => import('@/component/form/teditor/index'));

export default () => {

    return (
        <>
            <ProForm.Item
                name="answer_content"
                label="问题解析"
                rules={[
                    // { required: true, message: '请输入' }
                ]}
            >
                <Teditor />
            </ProForm.Item>
        </>
    )
}
