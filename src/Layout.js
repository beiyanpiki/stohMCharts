import React, { useEffect, useRef, useState } from 'react'
import { Graph } from '@antv/x6'
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { Stencil } from '@antv/x6-plugin-stencil'
import { register } from '@antv/x6-react-shape'

import {
    DelayExpState,
    DelayNormalState,
    DelayState,
    DelayUnifState,
    State,
} from './components'
import {
    DelayExpStateInfo,
    DelayNormalStateInfo,
    DelayStateInfo,
    DelayUnifStateInfo,
    ProbabilityTransitionSidebar,
    StateInfo,
    TransitionSidebar,
} from './sidebar'
import { convert, test_data_a } from './algorithm'
import { toUppaalXML } from './utils'
import { Button, Dropdown, Space } from 'antd'
import { GithubFilled, DownOutlined } from '@ant-design/icons'
const ports = {
    groups: {
        top: {
            position: 'top',
            attrs: {
                circle: {
                    r: 8,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 2,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden',
                    },
                },
            },
        },
        right: {
            position: 'right',
            attrs: {
                circle: {
                    r: 8,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 2,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden',
                    },
                },
            },
        },
        bottom: {
            position: 'bottom',
            attrs: {
                circle: {
                    r: 8,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 2,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden',
                    },
                },
            },
        },
        left: {
            position: 'left',
            attrs: {
                circle: {
                    r: 8,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 2,
                    fill: '#fff',
                    style: {
                        visibility: 'hidden',
                    },
                },
            },
        },
    },
    items: [
        {
            group: 'top',
        },
        {
            group: 'right',
        },
        {
            group: 'bottom',
        },
        {
            group: 'left',
        },
    ],
}
// Register custom component
register({
    shape: 'state',
    width: 180,
    height: 86,
    component: State,
    effect: ['data'],
})
register({
    shape: 'delay-exp',
    width: 180,
    height: 86,
    component: DelayExpState,
    effect: ['data'],
})
register({
    shape: 'delay-unif',
    width: 180,
    height: 86,
    component: DelayUnifState,
    effect: ['data'],
})
register({
    shape: 'delay',
    width: 180,
    height: 86,
    component: DelayState,
    effect: ['data'],
})
register({
    shape: 'delay-normal',
    width: 180,
    height: 86,
    component: DelayNormalState,
    effect: ['data'],
})
Graph.registerNode(
    'probability-node',
    {
        inherit: 'circle',
        width: 20,
        height: 20,
        attrs: {
            body: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
                rx: 6,
                ry: 6,
            },
        },
    },
    true
)
Graph.registerNode('initial-node', {
    inherit: 'circle',
    width: 30,
    height: 30,
    attrs: {
        body: {
            fill: '#888888',
        },
    },
})

// Register custom edge
Graph.registerEdge('transition', {
    inherit: 'edge',
    router: { name: 'metro' },
    connector: { name: 'rounded' },
    attrs: {
        line: {
            stroke: '#faad14',
            strokeDasharray: null,
            targetMarker: 'classic',
        },
    },
    data: {
        guard: '',
        sync: '',
        update: '',
    },
})
Graph.registerEdge('probability-transition', {
    inherit: 'edge',
    router: { name: 'metro' },
    connector: { name: 'rounded' },
    attrs: {
        line: {
            stroke: '#1890ff',
            strokeDasharray: 5,
            targetMarker: 'classic',
        },
    },
    data: {
        sync: '',
        update: '',
        weight: 0,
    },
})

const Layout = () => {
    const refContainer = useRef(null)
    const refStencilContainer = useRef(null)
    const [state, setState] = useState({
        shape: '',
        id: '',
        data: {},
    })
    const [G, setG] = useState(null)

    useEffect(() => {
        // Init graph
        const graph = new Graph({
            container: refContainer.current,
            grid: true,
            mousewheel: {
                enabled: true,
                zoomAtMousePosition: true,
                modifiers: 'ctrl',
                minScale: 0.5,
                maxScale: 3,
            },
            highlighting: {
                embedding: {
                    name: 'stroke',
                    args: {
                        padding: -1,
                        attrs: {
                            stroke: '#73d13d',
                        },
                    },
                },
                magnetAdsorbed: {
                    name: 'stroke',
                    args: {
                        attrs: {
                            fill: '#5F95FF',
                            stroke: '#5F95FF',
                        },
                    },
                },
            },
            connecting: {
                anchor: 'center',
                connectionPoint: 'anchor',
                allowBlank: false,
                snap: {
                    radius: 20,
                },
                createEdge() {
                    return graph.createEdge({ shape: 'transition' })
                },
                validateConnection({ targetMagnet }) {
                    return !!targetMagnet
                },
            },
            embedding: {
                enabled: true,
                findParent({ node }) {
                    const bbox = node.getBBox()
                    return this.getNodes().filter((node) => {
                        const data = node.getData()
                        if (data && data.composite) {
                            const targetBBox = node.getBBox()
                            return bbox.isIntersectWithRect(targetBBox)
                        }
                        return false
                    })
                },
            },
        })
            .use(
                new Transform({
                    resizing: true,
                    rotating: true,
                })
            )
            .use(
                new Selection({
                    enabled: true,
                    rubberband: true,
                    showNodeSelectionBox: true,
                })
            )
            .use(
                new Snapline({
                    enabled: true,
                })
            )
            .use(
                new Keyboard({
                    enabled: true,
                })
            )
            .use(
                new Clipboard({
                    enabled: true,
                })
            )
            .use(
                new History({
                    enabled: true,
                })
            )

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
                const cells = graph.paste({ offset: 32 })
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

        graph.on('blank:contextmenu', () => {
            graph.clearCells()
            graph.fromJSON(test_data_a)
        })

        graph.on('blank:dblclick', () => {
            const cells = graph.toJSON()

            const output = convert(cells)
            const xml = toUppaalXML(output)
            console.log(xml)
        })

        // Init node ports
        const showPorts = (ports, show) => {
            for (let i = 0, len = ports.length; i < len; i = i + 1) {
                ports[i].style.visibility = show ? 'visible' : 'hidden'
            }
        }
        graph.on('node:mouseenter', () => {
            const container = refContainer.current
            const ports = container.querySelectorAll('.x6-port-body')
            showPorts(ports, true)
        })
        graph.on('node:mouseleave', () => {
            const container = refContainer.current
            const ports = container.querySelectorAll('.x6-port-body')
            showPorts(ports, false)
        })

        // Init stencil
        const stencil = new Stencil({
            title: 'Components',
            target: graph,
            stencilGraphWidth: 350,
            stencilGraphHeight: 100,
            groups: [
                { name: 'STATE', title: 'state' },
                { name: 'DELAY', title: 'Delay(t)' },
                {
                    name: 'DELAY_EXP',
                    title: 'DelayExp(rate)',
                },
                { name: 'DELAY_UNIF', title: 'DelayUnif(a, b)' },
                {
                    name: 'DELAY_NORMAL',
                    title: 'Normal(a, u)',
                },
                { name: 'PROBABILITY_NODE', title: 'Probability' },
            ],
        })
        refStencilContainer.current.appendChild(stencil.container)
        // Init stencil group
        const r1 = graph.createNode({
            shape: 'state',
            x: 180,
            y: 40,
            data: { title: 'NEW STATE', exp: '', inv: '', composite: false },
            ports: { ...ports },
        })
        const r2 = graph.createNode({
            shape: 'delay-exp',
            x: 180,
            y: 40,
            data: {
                title: 'NEW STATE',
                exp: '',
                variable: 'c',
                rate: 2,
                composite: false,
            },
            ports: { ...ports },
        })
        const r3 = graph.createNode({
            shape: 'delay-unif',
            x: 180,
            y: 40,
            data: {
                title: 'NEW STATE',
                exp: '',
                variable: 'c',
                a: 10,
                b: 20,
                composite: false,
            },
            ports: { ...ports },
        })
        const r4 = graph.createNode({
            shape: 'delay',
            x: 180,
            y: 40,
            data: {
                title: 'NEW STATE',
                exp: '',
                variable: 'c',
                t: 5,
                composite: false,
            },
            ports: { ...ports },
        })
        const r5 = graph.createNode({
            shape: 'delay-normal',
            x: 180,
            y: 40,
            data: {
                title: 'NEW STATE',
                exp: '',
                variable: 'v',
                a: 10,
                u: 5,
                composite: false,
            },
            ports: { ...ports },
        })
        const r6 = graph.createNode({
            shape: 'probability-node',
            x: 180,
            y: 40,
            data: {},
            ports: { ...ports },
        })
        stencil.load([r1], 'STATE')
        stencil.load([r2], 'DELAY_EXP')
        stencil.load([r3], 'DELAY_UNIF')
        stencil.load([r4], 'DELAY')
        stencil.load([r5], 'DELAY_NORMAL')
        stencil.load([r6], 'PROBABILITY_NODE')

        // Init node&edge action
        graph.on('cell:click', ({ cell }) => {
            setState({
                shape: cell.shape,
                id: cell.id,
                data: cell.data ? cell.data : {},
            })
        })

        setG(graph)
    }, [refContainer, refStencilContainer])

    return (
        <>
            <div className="topbar">
                <div className="topbar-left">
                    <div className="topbar-left-title">
                        <Button type="text" size="small">
                            <b>StohM Charts</b>
                        </Button>
                    </div>

                    <div className="topbar-left-menu">
                        <Space wrap size="middle">
                            <Button size="small" type="primary">
                                New
                            </Button>
                            <Button size="small">Load</Button>
                            <Button size="small">Save</Button>
                            <Button size="small">Export</Button>
                            <Dropdown
                                menu={{
                                    items: [{ key: '1', label: '123' }],
                                    onClick: (e) => {
                                        console.log(e)
                                    },
                                }}
                            >
                                <Space>
                                    <Button size="small">
                                        Examples
                                        <DownOutlined />
                                    </Button>
                                </Space>
                            </Dropdown>
                        </Space>
                    </div>
                </div>
                <div className="topbar-right">
                    <Button
                        type="text"
                        size="small"
                        icon={<GithubFilled />}
                        href="https://github.com/beiyanpiki/stohMCharts"
                        target="__blank"
                    />
                </div>
            </div>
            <div className="app">
                <div className="app-stencil" ref={refStencilContainer} />
                <div className="app-content" ref={refContainer} />
                <div className="app-sidebar">
                    {(() => {
                        switch (state.shape) {
                            case 'state':
                                return (
                                    <StateInfo
                                        state={{
                                            id: state.id,
                                            title: state.data.title,
                                            exp: state.data.exp,
                                            inv: state.data.inv,
                                            composite: state.data.composite,
                                        }}
                                        onChange={(newState) => {
                                            setState({
                                                id: newState.id,
                                                shape: state.shape,
                                                data: {
                                                    title: newState.title,
                                                    exp: newState.exp,
                                                    inv: newState.inv,
                                                    composite:
                                                        newState.composite,
                                                },
                                            })
                                            const cell = G.getCellById(
                                                newState.id
                                            )
                                            cell.setData({
                                                title: newState.title,
                                                exp: newState.exp,
                                                inv: newState.inv,
                                                composite: newState.composite,
                                            })
                                        }}
                                    />
                                )
                            case 'delay-exp':
                                return (
                                    <DelayExpStateInfo
                                        state={{
                                            id: state.id,
                                            title: state.data.title,
                                            exp: state.data.exp,
                                            variable: state.data.variable,
                                            rate: state.data.rate,
                                            composite: state.data.composite,
                                        }}
                                        onChange={(newState) => {
                                            setState({
                                                id: newState.id,
                                                data: {
                                                    shape: state.shape,
                                                    title: newState.title,
                                                    exp: newState.exp,
                                                    variable: newState.variable,
                                                    rate: newState.rate,
                                                    composite:
                                                        newState.composite,
                                                },
                                            })
                                            const cell = G.getCellById(
                                                newState.id
                                            )
                                            cell.setData({
                                                title: newState.title,
                                                exp: newState.exp,
                                                variable: newState.variable,
                                                rate: newState.rate,
                                                composite: newState.composite,
                                            })
                                        }}
                                    />
                                )
                            case 'delay-unif':
                                return (
                                    <DelayUnifStateInfo
                                        state={{
                                            id: state.id,
                                            title: state.data.title,
                                            exp: state.data.exp,
                                            variable: state.data.variable,
                                            a: state.data.a,
                                            b: state.data.b,
                                            composite: state.data.composite,
                                        }}
                                        onChange={(newState) => {
                                            setState({
                                                id: newState.id,
                                                shape: state.shape,
                                                data: {
                                                    title: newState.title,
                                                    exp: newState.exp,
                                                    variable: newState.variable,
                                                    a: newState.a,
                                                    b: newState.b,
                                                    composite:
                                                        newState.composite,
                                                },
                                            })
                                            const cell = G.getCellById(
                                                newState.id
                                            )
                                            cell.setData({
                                                title: newState.title,
                                                exp: newState.exp,
                                                variable: newState.variable,
                                                a: newState.a,
                                                b: newState.b,
                                                composite: newState.composite,
                                            })
                                        }}
                                    />
                                )
                            case 'delay':
                                return (
                                    <DelayStateInfo
                                        state={{
                                            id: state.id,
                                            title: state.data.title,
                                            exp: state.data.exp,
                                            variable: state.data.variable,
                                            t: state.data.t,
                                            composite: state.data.composite,
                                        }}
                                        onChange={(newState) => {
                                            setState({
                                                id: newState.id,
                                                shape: state.shape,
                                                data: {
                                                    title: newState.title,
                                                    exp: newState.exp,
                                                    variable: newState.variable,
                                                    t: newState.t,
                                                    composite:
                                                        newState.composite,
                                                },
                                            })
                                            const cell = G.getCellById(
                                                newState.id
                                            )
                                            cell.setData({
                                                title: newState.title,
                                                exp: newState.exp,
                                                variable: newState.variable,
                                                t: newState.t,
                                                composite: newState.composite,
                                            })
                                        }}
                                    />
                                )
                            case 'delay-normal':
                                return (
                                    <DelayNormalStateInfo
                                        state={{
                                            id: state.id,
                                            title: state.data.title,
                                            inv: state.data.inv,
                                            variable: state.data.variable,
                                            a: state.data.a,
                                            u: state.data.u,
                                            composite: state.data.composite,
                                        }}
                                        onChange={(newState) => {
                                            setState({
                                                id: newState.id,
                                                shape: state.shape,
                                                data: {
                                                    title: newState.title,
                                                    inv: newState.inv,
                                                    variable: newState.variable,
                                                    a: newState.a,
                                                    u: newState.u,
                                                    composite:
                                                        newState.composite,
                                                },
                                            })
                                            const cell = G.getCellById(
                                                newState.id
                                            )
                                            cell.setData({
                                                title: newState.title,
                                                inv: newState.inv,
                                                variable: newState.variable,
                                                a: newState.a,
                                                u: newState.u,
                                                composite: newState.composite,
                                            })
                                        }}
                                    />
                                )
                            case 'transition':
                                return (
                                    <TransitionSidebar
                                        state={{
                                            id: state.id,
                                            guard: state.data.guard,
                                            sync: state.data.sync,
                                            update: state.data.update,
                                        }}
                                        onChange={(newState) => {
                                            console.log(newState)
                                            setState({
                                                id: newState.id,
                                                shape: state.shape,
                                                data: {
                                                    guard: newState.guard,
                                                    sync: newState.sync,
                                                    update: newState.update,
                                                },
                                            })
                                            const cell = G.getCellById(
                                                newState.id
                                            )
                                            cell.setData({
                                                guard: newState.guard,
                                                sync: newState.sync,
                                                update: newState.update,
                                            })
                                        }}
                                        onSwitch={() => {
                                            setState({
                                                id: state.id,
                                                shape: 'probability-transition',
                                                data: {
                                                    sync: '',
                                                    update: '',
                                                    weight: 0,
                                                },
                                            })
                                            const cell = G.getCellById(state.id)
                                            cell.prop(
                                                'shape',
                                                'probability-transition'
                                            )
                                            cell.attr('line/stroke', '#1890ff')
                                            cell.attr('line/strokeDasharray', 5)
                                            cell.setData({
                                                sync: '',
                                                update: '',
                                                weight: 0,
                                            })
                                        }}
                                    />
                                )
                            case 'probability-transition':
                                return (
                                    <ProbabilityTransitionSidebar
                                        state={{
                                            id: state.id,
                                            weight: state.data.weight,
                                            sync: state.data.sync,
                                            update: state.data.update,
                                        }}
                                        onChange={(newState) => {
                                            setState({
                                                id: newState.id,
                                                shape: state.shape,
                                                data: {
                                                    weight: newState.weight,
                                                    sync: newState.sync,
                                                    update: newState.update,
                                                },
                                            })
                                            const cell = G.getCellById(
                                                newState.id
                                            )
                                            cell.setData({
                                                weight: newState.weight,
                                                sync: newState.sync,
                                                update: newState.update,
                                            })
                                        }}
                                        onSwitch={() => {
                                            setState({
                                                id: state.id,
                                                shape: 'transition',
                                                data: {
                                                    sync: '',
                                                    update: '',
                                                    guard: '',
                                                },
                                            })
                                            const cell = G.getCellById(state.id)
                                            cell.prop('shape', 'transition')
                                            cell.attr('line/stroke', '#faad14')
                                            cell.attr(
                                                'line/strokeDasharray',
                                                null
                                            )
                                            cell.setData({
                                                sync: '',
                                                update: '',
                                                weight: 0,
                                            })
                                        }}
                                    />
                                )
                            default:
                                return <div></div>
                        }
                    })()}
                </div>
            </div>
        </>
    )
}

export default Layout
