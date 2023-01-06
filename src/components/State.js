import React from 'react'

const State = ({ node }) => {
    const { title, exp, inv, composite } = node.data
    return (
        <div className={`node ${composite ? 'parent' : 'child'}`}>
            <span className="label">
                <b>{title}</b>
            </span>
            <hr />
            <span className="label">
                <b>Exp.</b> {exp}
            </span>
            <br />
            <span className="label">
                <b>Inv.</b> {inv}
            </span>
        </div>
    )
}

export default State
