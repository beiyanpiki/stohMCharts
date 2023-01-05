import React from 'react'

const DelayState = ({node}) => {
    const {title, composite, exp, variable, t} = node.data
    return <div className={`node ${composite ? "parent" : "child"}`}>
        <span className="label">
          <b>{title}</b>
        </span>
        <hr/>
        <span className="label">
          <b>Exp.</b> {exp}
        </span>
        <br/>
        <span className="label">
          <b>Inv.</b> {variable} = Delay({t})
        </span>
    </div>
}

export default DelayState;