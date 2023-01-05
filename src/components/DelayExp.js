const DelayExpState = ({node}) => {
    const {title, composite, exp, variable, rate} = node.data
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
          <b>Inv.</b> {variable} = DelayExp({rate})
        </span>
    </div>
}

export default DelayExpState;