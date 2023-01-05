import {Button, Form, Input, InputNumber, Radio} from "antd";
import React, {useEffect} from "react";

const ProbabilityTransitionSidebar = ({state, onChange, onSwitch}) => {
    const [form] = Form.useForm();
    useEffect(() => {
        form.resetFields()
    }, [state])

    return <Form labelCol={{span: 4}} wrapperCol={{span: 20}} form={form} initialValues={{
        id: state.id,
        weight: state.weight,
        sync: state.sync,
        update: state.update
    }} onFinish={(values) => {
        onChange({...values})
    }}>
        <Form.Item label='type'>
            <Radio.Group defaultValue="prob" buttonStyle="solid" onChange={(e) => {
                if (e.target.value === 'tran') {
                    onSwitch()
                }
            }}>
                <Radio.Button value="tran">Transition</Radio.Button>
                <Radio.Button value='prob'>Probability</Radio.Button>
            </Radio.Group>
        </Form.Item>

        <Form.Item label='id' name='id'>
            <Input disabled/>
        </Form.Item>
        <Form.Item label='sync' name='sync'>
            <Input/>
        </Form.Item>
        <Form.Item label='update' name='update'>
            <Input/>
        </Form.Item>
        <Form.Item label='weight' name='weight'>
            <InputNumber/>
        </Form.Item>
        <Form.Item wrapperCol={{offset: 4, span: 16}}>
            <Button type="primary" htmlType="submit" block>
                Apply
            </Button>
        </Form.Item>
    </Form>
}

export default ProbabilityTransitionSidebar