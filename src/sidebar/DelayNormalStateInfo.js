import { Button, Checkbox, Form, Input, InputNumber } from 'antd'
import React, { useEffect } from 'react'

const DelayNormalStateInfo = ({ state, onChange }) => {
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
                inv: state.inv ? state.inv : '',
                variable: state.variable ? state.variable : '',
                a: state.a ? state.a : 10,
                u: state.u ? state.u : 20,
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
            <Form.Item label="Var." name="variable">
                <Input />
            </Form.Item>
            <Form.Item label="a" name="a">
                <InputNumber />
            </Form.Item>
            <Form.Item label="u" name="u">
                <InputNumber />
            </Form.Item>
            <Form.Item label="Inv." name="inv">
                <Input />
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

export default DelayNormalStateInfo
