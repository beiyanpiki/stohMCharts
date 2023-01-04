const DelayUnifState = ({node}) => {
    const {title, composite, exp, a, b} = node.data
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
          <b>Inv.</b> DelayUnif({a}, {b})
        </span>
    </div>
}

export default DelayUnifState;