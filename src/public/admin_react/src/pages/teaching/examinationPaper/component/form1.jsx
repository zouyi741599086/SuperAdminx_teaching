import { lazy } from 'react';
import {
    ProForm,
    ProFormText,
    ProFormSelect,
} from '@ant-design/pro-components';
import { Row, Col } from 'antd';
import { gradeApi } from '@/api/grade';
import { examinationPaperClassApi } from '@/api/examinationPaperClass';

const SelectQuestionAll = lazy(() => import('@/components/selectQuestionAll'));

export default () => {

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={6}>
                    <ProFormText
                        name="title"
                        label="标题"
                        placeholder="请输入"
                        rules={[
                            { required: true, message: '请输入' }
                        ]}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={8} xxl={6}>
                    <ProFormSelect
                        name="examination_paper_class_id"
                        label="试卷分类"
                        placeholder="请选择"
                        rules={[
                            { required: true, message: '请选择' }
                        ]}
                        request={async () => {
                            let result = await examinationPaperClassApi.getList();
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
                </Col>
            </Row>
            <ProForm.Item
                name="ExaminationPaperQuestion"
                label="题目"
                rules={[
                    { required: true, message: '请选择' }
                ]}
            >
                <SelectQuestionAll />
            </ProForm.Item>
        </>
    )
}
