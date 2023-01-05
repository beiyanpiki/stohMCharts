import React from 'react'
const DelayNormalState = ({node}) => {
    const {title, composite, variable, a, u, inv} = node.data
    return <div className={`node ${composite ? "parent" : "child"}`}>
        <span className="label">
          <b>{title}</b>
        </span>
        <hr/>
        <span className="label">
          <b>Exp.</b> {variable} = Normal({a}, {u})
        </span>
        <br/>
        <span className="label">
          <b>Inv.</b> {inv}
        </span>
    </div>
}

export default DelayNormalState;