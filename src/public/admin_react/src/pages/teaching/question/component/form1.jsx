import { lazy } from 'react';
import { Row, Col } from 'antd';
import {
    ProForm,
    ProFormText,
    ProFormRadio,
    ProFormSelect,
    ProFormList,
    ProFormGroup,
    ProFormDigit,
} from '@ant-design/pro-components';
import { gradeApi } from '@/api/grade';
import { questionClassApi } from '@/api/questionClass';

const UploadImgAll = lazy(() => import('@/component/form/uploadImgAll/index'));

export default (props) => {

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={6}>
                    <ProFormText
                        name="title"
                        label="题目"
                        placeholder="请输入"
                        rules={[
                            { required: true, message: '请输入' }
                        ]}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={6}>
                    <ProFormDigit
                        name="points"
                        label="分数"
                        placeholder="请输入"
                        min={0}
                        fieldProps={{ precision: 0 }}
                        rules={[
                            { required: true, message: '请输入' }
                        ]}
                        extra="此题的分数"
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={6}>
                    <ProFormSelect
                        name="question_class_id"
                        label="题库分类"
                        placeholder="请选择"
                        rules={[
                            { required: true, message: '请选择' }
                        ]}
                        request={async () => {
                            let result = await questionClassApi.getList();
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
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={6}>
                    <ProFormSelect
                        name="grade_id"
                        label="所属年级"
                        placeholder="请选择"
                        rules={[
                            //{ required: true, message: '请选择' }
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
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
                    <ProFormRadio.Group
                        name="type"
                        label="类型"
                        options={[
                            {
                                label: '单选',
                                value: 1,
                            },
                            {
                                label: '多选',
                                value: 2,
                            },
                        ]}
                        rules={[
                            { required: true, message: '请选择' }
                        ]}
                    />
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={16} xxl={18}>
                    <ProForm.Item
                        name="imgs"
                        label="问题中的图片"
                        rules={[
                            //{ required: true, message: '请上传' }
                        ]}
                    >
                        <UploadImgAll />
                    </ProForm.Item>
                </Col>
            </Row>

            <ProFormList
                name="QuestionOptions"
                label="问题选择项"
                rules={[
                    {
                        required: true,
                        validator: async (_, value) => {
                            if (!value || value.length == 0) {
                                throw new Error('至少要有一个选择项！');
                            }
                            //判断单选多选的正确答案数量
                            let type = props.formRef.current?.getFieldValue('type');
                            let answer = value.filter(item => item.is_answer == 2).length;
                            if (answer == 0) {
                                throw new Error('至少要有一个是正确选择项！');
                            }
                            if (type == 1 && answer > 1) {
                                throw new Error('单选题只能有一个正确选择项！');
                            }
                            return;
                        },
                    },
                ]}
                creatorButtonProps={{
                    creatorButtonText: '添加选择项'
                }}
                //新建一行时候的默认值
                creatorRecord={{
                    is_answer: 1,
                }}
                //关闭复制按钮
                copyIconProps={false}
            >
                <ProFormGroup key="group">
                    <ProFormRadio.Group
                        name="is_answer"
                        label="正确选项"
                        options={[
                            {
                                label: '否',
                                value: 1,
                            },
                            {
                                label: '是',
                                value: 2,
                            },
                        ]}
                        rules={[
                            { required: true, message: '请选择' }
                        ]}
                    />
                    <ProFormText
                        rules={[
                            { required: true, message: '请输入' },
                        ]}
                        width="lg"
                        name="title"
                        label="选择项"
                    />
                </ProFormGroup>
            </ProFormList>
        </>
    )
}
