import { Button, Form, Input, Space } from 'antd'
import React, { useEffect } from 'react'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

const VerificationSidebar = ({ state, onChange }) => {
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
                quries: state.quries,
            }}
            onFinish={(values) => {
                onChange(values.quries)
            }}
        >
            <Form.List name="quries">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map((field) => (
                            <Space key={field.key} align="baseline">
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'text']}
                                >
                                    <Input />
                                </Form.Item>
                                <MinusCircleOutlined
                                    onClick={() => remove(field.name)}
                                />
                            </Space>
                        ))}

                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add()}
                                block
                                icon={<PlusOutlined />}
                            >
                                Add query
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            <Form.Item wrapperCol={{ span: 20 }}>
                <Button type="primary" htmlType="submit" block>
                    Apply
                </Button>
            </Form.Item>
        </Form>
    )
}

export default VerificationSidebar
