import { Button, Checkbox, Form, Input, InputNumber } from 'antd'
import React, { useEffect } from 'react'

const DelayExpStateInfo = ({ state, onChange }) => {
    const [form] = Form.useForm()
    useEffect(() => {
        form.resetFields()
    }, [state])

    return (
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            form={form}
            initialValues={{
                id: state.id,
                title: state.title,
                exp: state.exp ? state.exp : '',
                variable: state.variable ? state.variable : '',
                rate: state.rate ? state.rate : 2,
                composite: state.composite,
            }}
            onFinish={(values) => {
                onChange({ ...values })
            }}
        >
            <Form.Item label="id" name="id">
                <Input disabled />
            </Form.Item>
            <Form.Item label="Title" name="title">
                <Input />
            </Form.Item>

            <Form.Item label="Exp." name="exp">
                <Input />
            </Form.Item>
            <Form.Item label="Var." name="variable">
                <Input />
            </Form.Item>
            <Form.Item label="Rate" name="rate">
                <InputNumber />
            </Form.Item>
            <Form.Item
                name="composite"
                valuePropName="checked"
                wrapperCol={{ offset: 4, span: 16 }}
            >
                <Checkbox>Composite</Checkbox>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                <Button type="primary" htmlType="submit" block>
                    Apply
                </Button>
            </Form.Item>
        </Form>
    )
}

export default DelayExpStateInfo
