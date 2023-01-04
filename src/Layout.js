import {useEffect, useRef, useState} from "react";
import {Graph} from '@antv/x6'
import {Transform} from "@antv/x6-plugin-transform";
import {Selection} from "@antv/x6-plugin-selection";
import {Snapline} from "@antv/x6-plugin-snapline";
import {Keyboard} from "@antv/x6-plugin-keyboard";
import {Clipboard} from "@antv/x6-plugin-clipboard";
import {History} from "@antv/x6-plugin-history";
import {Stencil} from '@antv/x6-plugin-stencil'
import {register} from '@antv/x6-react-shape'

import {DelayExpState, DelayNormalState, DelayState, DelayUnifState, State} from './components'
import {DelayExpStateInfo, DelayNormalStateInfo, DelayStateInfo, DelayUnifStateInfo, StateInfo} from './sidebar'

const ports = {
    groups: {
        top: {
            position: 'top', attrs: {
                circle: {
                    r: 4, magnet: true, stroke: '#5F95FF', strokeWidth: 1, fill: '#fff', style: {
                        visibility: 'hidden',
                    },
                },
            },
        }, right: {
            position: 'right', attrs: {
                circle: {
                    r: 4, magnet: true, stroke: '#5F95FF', strokeWidth: 1, fill: '#fff', style: {
                        visibility: 'hidden',
                    },
                },
            },
        }, bottom: {
            position: 'bottom', attrs: {
                circle: {
                    r: 4, magnet: true, stroke: '#5F95FF', strokeWidth: 1, fill: '#fff', style: {
                        visibility: 'hidden',
                    },
                },
            },
        }, left: {
            position: 'left', attrs: {
                circle: {
                    r: 4, magnet: true, stroke: '#5F95FF', strokeWidth: 1, fill: '#fff', style: {
                        visibility: 'hidden',
                    },
                },
            },
        },
    }, items: [{
        group: 'top',
    }, {
        group: 'right',
    }, {
        group: 'bottom',
    }, {
        group: 'left',
    },],
}
// Register custom component
register({
    shape: 'state', width: 180, height: 86, component: State, effect: ['data']
})
register({
    shape: 'delay-exp', width: 180, height: 86, component: DelayExpState, effect: ['data']
})
register({
    shape: 'delay-unif', width: 180, height: 86, component: DelayUnifState, effect: ['data']
})
register({
    shape: 'delay', width: 180, height: 86, component: DelayState, effect: ['data']
})
register({
    shape: 'delay-normal', width: 180, height: 86, component: DelayNormalState, effect: ['data']
})

const Layout = () => {
    const refContainer = useRef(null);
    const refStencilContainer = useRef(null);
    const [state, setState] = useState({
        shape: "", id: "", data: {}
    })
    const [G, setG] = useState(null)

    useEffect(() => {
        // Init graph
        const graph = new Graph({
            container: refContainer.current, grid: true, mousewheel: {
                enabled: true, zoomAtMousePosition: true, modifiers: 'ctrl', minScale: 0.5, maxScale: 3,
            }, highlighting: {
                magnetAdsorbed: {
                    name: 'stroke', args: {
                        attrs: {
                            fill: '#5F95FF', stroke: '#5F95FF',
                        },
                    },
                },
            },
        })
            .use(new Transform({
                resizing: true, rotating: true,
            }))
            .use(new Selection({
                enabled: true, rubberband: true, showNodeSelectionBox: true,
            }))
            .use(new Snapline({
                enabled: true,
            }))
            .use(new Keyboard({
                enabled: true,
            }))
            .use(new Clipboard({
                enabled: true,
            }))
            .use(new History({
                enabled: true,
            }))

        // Init keymap
        graph.bindKey(['meta+c', 'ctrl+c'], () => {
            const cells = graph.getSelectedCells()
            if (cells.length) {
                graph.copy(cells)
            }
            return false
        })
        graph.bindKey(['meta+x', 'ctrl+x'], () => {
            const cells = graph.getSelectedCells()
            if (cells.length) {
                graph.cut(cells)
            }
            return false
        })
        graph.bindKey(['meta+v', 'ctrl+v'], () => {
            if (!graph.isClipboardEmpty()) {
                const cells = graph.paste({offset: 32})
                graph.cleanSelection()
                graph.select(cells)
            }
            return false
        })
        graph.bindKey(['meta+z', 'ctrl+z'], () => {
            if (graph.canUndo()) {
                graph.undo()
            }
            return false
        })
        graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
            if (graph.canRedo()) {
                graph.redo()
            }
            return false
        })
        graph.bindKey(['meta+a', 'ctrl+a'], () => {
            const nodes = graph.getNodes()
            if (nodes) {
                graph.select(nodes)
            }
        })
        graph.bindKey(['backspace', 'delete'], () => {
            const cells = graph.getSelectedCells()
            if (cells.length) {
                graph.removeCells(cells)
            }
        })
        graph.bindKey(['ctrl+1', 'meta+1'], () => {
            const zoom = graph.zoom()
            if (zoom < 1.5) {
                graph.zoom(0.1)
            }
        })
        graph.bindKey(['ctrl+2', 'meta+2'], () => {
            const zoom = graph.zoom()
            if (zoom > 0.5) {
                graph.zoom(-0.1)
            }
        })

        // Init node ports
        const showPorts = (ports, show) => {
            for (let i = 0, len = ports.length; i < len; i = i + 1) {
                ports[i].style.visibility = show ? 'visible' : 'hidden'
            }
        }
        graph.on('node:mouseenter', () => {
            const container = refContainer.current;
            const ports = container.querySelectorAll('.x6-port-body',)
            showPorts(ports, true)
        })
        graph.on('node:mouseleave', () => {
            const container = refContainer.current;
            const ports = container.querySelectorAll('.x6-port-body',)
            showPorts(ports, false)
        })

        // Init stencil
        const stencil = new Stencil({
            title: "Components",
            target: graph,
            stencilGraphWidth: 350,
            stencilGraphHeight: 100,
            groups: [
                {name: "STATE", title: 'state'},
                {name: "DELAY", title: 'Delay(t)'},
                {name: "DELAY_EXP", title: 'DelayExp(rate)'},
                {name: "DELAY_UNIF", title: 'DelayUnif(a, b)'},
                {name: "DELAY_NORMAL", title: 'Normal(a, u)'},
            ],
        });
        refStencilContainer.current.appendChild(stencil.container);
        // Init stencil group
        const r1 = graph.createNode({
            shape: 'state',
            x: 180,
            y: 40,
            data: {title: "NEW STATE", exp: "", inv: "", composite: false},
            ports: {...ports}
        })
        const r2 = graph.createNode({
            shape: 'delay-exp',
            x: 180,
            y: 40,
            data: {title: "NEW STATE", exp: "", rate: 2, composite: false},
            ports: {...ports}
        })
        const r3 = graph.createNode({
            shape: 'delay-unif',
            x: 180,
            y: 40,
            data: {title: "NEW STATE", exp: "", a: 10, b: 20, composite: false},
            ports: {...ports}
        })
        const r4 = graph.createNode({
            shape: 'delay',
            x: 180,
            y: 40,
            data: {title: "NEW STATE", exp: "", t: 5, composite: false},
            ports: {...ports}
        })
        const r5 = graph.createNode({
            shape: 'delay-normal',
            x: 180,
            y: 40,
            data: {title: "NEW STATE", exp: "", a: 10, u: 5, composite: false},
            ports: {...ports}
        })
        stencil.load([r1], 'STATE')
        stencil.load([r2], 'DELAY_EXP')
        stencil.load([r3], 'DELAY_UNIF')
        stencil.load([r4], 'DELAY')
        stencil.load([r5], 'DELAY_NORMAL')

        // Init node&edge action
        graph.on('node:click', (props) => {
            const {e, x, y, cell, view} = props;
            console.log('cell click', {e, x, y, cell, view})

            setState({
                shape: cell.shape, id: cell.id, x: x, y: y, data: cell.data ? cell.data : {}
            })
        })

        setG(graph)
    }, [refContainer, refStencilContainer])


    return <div className="app">
        <div className="app-stencil" ref={refStencilContainer}/>
        <div className="app-content" ref={refContainer}/>
        <div className="app-sidebar">
            {(() => {
                switch (state.shape) {
                    case 'state':
                        return <StateInfo state={{
                            id: state.id,
                            title: state.data.title,
                            exp: state.data.exp,
                            inv: state.data.inv,
                            composite: state.data.composite
                        }} onChange={(newState) => {
                            setState({
                                id: newState.id, data: {
                                    title: newState.title,
                                    exp: newState.exp,
                                    inv: newState.inv,
                                    composite: newState.composite
                                }
                            })
                            const cell = G.getCellById(newState.id)
                            cell.setData({
                                title: newState.title,
                                exp: newState.exp,
                                inv: newState.inv,
                                composite: newState.composite
                            })
                        }}/>
                    case 'delay-exp':
                        return <DelayExpStateInfo state={{
                            id: state.id,
                            title: state.data.title,
                            exp: state.data.exp,
                            rate: state.data.rate,
                            composite: state.data.composite
                        }} onChange={(newState) => {
                            setState({
                                id: newState.id,
                                data: {
                                    title: newState.title,
                                    exp: newState.exp,
                                    rate: newState.rate,
                                    composite: newState.composite
                                }
                            })
                            const cell = G.getCellById(newState.id)
                            cell.setData({
                                title: newState.title,
                                exp: newState.exp,
                                rate: newState.rate,
                                composite: newState.composite
                            })
                        }}/>
                    case 'delay-unif':
                        return <DelayUnifStateInfo state={{
                            id: state.id,
                            title: state.data.title,
                            exp: state.data.exp,
                            a: state.data.a,
                            b: state.data.b,
                            composite: state.data.composite
                        }} onChange={(newState) => {
                            setState({
                                id: newState.id,
                                data: {
                                    title: newState.title,
                                    exp: newState.exp,
                                    a: newState.a, b: newState.b,
                                    composite: newState.composite
                                }
                            })
                            const cell = G.getCellById(newState.id)
                            cell.setData({
                                title: newState.title,
                                exp: newState.exp,
                                a: newState.a, b: newState.b,
                                composite: newState.composite
                            })
                        }}/>
                    case 'delay':
                        return <DelayStateInfo state={{
                            id: state.id,
                            title: state.data.title,
                            exp: state.data.exp,
                            t: state.data.t,
                            composite: state.data.composite
                        }} onChange={(newState) => {
                            setState({
                                id: newState.id,
                                data: {
                                    title: newState.title,
                                    exp: newState.exp,
                                    t: newState.t,
                                    composite: newState.composite
                                }
                            })
                            const cell = G.getCellById(newState.id)
                            cell.setData({
                                title: newState.title,
                                exp: newState.exp,
                                t: newState.t,
                                composite: newState.composite
                            })
                        }}/>
                    case 'delay-normal':
                        return <DelayNormalStateInfo state={{
                            id: state.id,
                            title: state.data.title,
                            inv: state.data.inv,
                            a: state.data.a, u: state.data.u,
                            composite: state.data.composite
                        }} onChange={(newState) => {
                            setState({
                                id: newState.id,
                                data: {
                                    title: newState.title,
                                    inv: newState.inv,
                                    a: newState.a, u: newState.u,
                                    composite: newState.composite
                                }
                            })
                            const cell = G.getCellById(newState.id)
                            cell.setData({
                                title: newState.title,
                                inv: newState.inv,
                                a: newState.a, u: newState.u,
                                composite: newState.composite
                            })
                        }}/>
                }
            })()}

        </div>

    </div>
}

export default Layout;