import React, { useState, useRef } from 'react'
import { Input } from 'antd'
const Title = ({ title, onTitleChange }) => {
    const [edit, setEdit] = useState(false)
    const inputRef = useRef(null)

    return (
        <>
            {edit ? (
                <Input.Group compact size="small">
                    <Input
                        ref={inputRef}
                        defaultValue={title}
                        onChange={(e) => {
                            const { value } = e.target
                            if (value.length < 20) {
                                onTitleChange(value)
                            }
                        }}
                        onPressEnter={() => {
                            setEdit(false)
                        }}
                        onBlur={() => {
                            setEdit(false)
                        }}
                    />
                </Input.Group>
            ) : (
                <h3
                    onClick={() => {
                        setEdit(true)
                    }}
                >
                    {title}
                </h3>
            )}
        </>
    )
}

export default Title
