import React, {useEffect, useRef, useState} from "react";
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
import {
    DelayExpStateInfo,
    DelayNormalStateInfo,
    DelayStateInfo,
    DelayUnifStateInfo,
    ProbabilityTransitionSidebar,
    StateInfo,
    TransitionSidebar
} from './sidebar'
import {convert} from "./algorithm";
import {toUppaalXML} from "./utils";


const ports = {
    groups: {
        top: {
            position: 'top', attrs: {
                circle: {
                    r: 8, magnet: true, stroke: '#5F95FF', strokeWidth: 2, fill: '#fff', style: {
                        visibility: 'hidden',
                    },
                },
            },
        }, right: {
            position: 'right', attrs: {
                circle: {
                    r: 8, magnet: true, stroke: '#5F95FF', strokeWidth: 2, fill: '#fff', style: {
                        visibility: 'hidden',
                    },
                },
            },
        }, bottom: {
            position: 'bottom', attrs: {
                circle: {
                    r: 8, magnet: true, stroke: '#5F95FF', strokeWidth: 2, fill: '#fff', style: {
                        visibility: 'hidden',
                    },
                },
            },
        }, left: {
            position: 'left', attrs: {
                circle: {
                    r: 8, magnet: true, stroke: '#5F95FF', strokeWidth: 2, fill: '#fff', style: {
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
Graph.registerNode('probability-node', {
    inherit: 'circle',
    width: 20, height: 20, attrs: {
        body: {
            stroke: '#8f8f8f', strokeWidth: 1, fill: '#fff', rx: 6, ry: 6,
        },
    },
}, true,)
Graph.registerNode('initial-node', {
    inherit: 'circle',
    width: 30, height: 30, attrs: {
        body: {
            fill: '#888888'
        },
    },
})

// Register custom edge
Graph.registerEdge("transition", {
    inherit: 'edge',
    router: {name: 'metro'},
    connector: {name: 'rounded'},
    attrs: {
        line: {
            stroke: '#faad14', strokeDasharray: null, targetMarker: 'classic',
        },
    },
    data: {
        guard: "",
        sync: "",
        update: ""
    }
})
Graph.registerEdge("probability-transition", {
    inherit: 'edge',
    router: {name: 'metro'},
    connector: {name: 'rounded'},
    attrs: {
        line: {
            stroke: '#1890ff', strokeDasharray: 5, targetMarker: 'classic',
        },
    },
    data: {
        sync: "",
        update: "",
        weight: 0,
    }
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
                    name: 'stroke', args: {
                        attrs: {
                            fill: '#5F95FF', stroke: '#5F95FF',
                        },
                    },
                },
            }, connecting: {
                anchor: 'center', connectionPoint: 'anchor', allowBlank: false, snap: {
                    radius: 20,
                }, createEdge() {
                    return graph.createEdge({shape: 'transition'})
                }, validateConnection({targetMagnet}) {
                    return !!targetMagnet
                },
            }, embedding: {
                enabled: true,
                findParent({node}) {
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
            }
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

        graph.on("blank:contextmenu", () => {
            graph.clearCells()
            graph.fromJSON({
                "cells": [
                    {
                        "position": {
                            "x": 110,
                            "y": 100
                        },
                        "size": {
                            "width": 980,
                            "height": 520
                        },
                        "view": "react-shape-view",
                        "shape": "state",
                        "id": "d42792c0-3369-4281-88ea-2dd1d47df34e",
                        "data": {
                            "title": "A",
                            "exp": "",
                            "inv": "",
                            "composite": true
                        },
                        "ports": {
                            "groups": {
                                "top": {
                                    "position": "top",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "position": "right",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "bottom": {
                                    "position": "bottom",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "left": {
                                    "position": "left",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                }
                            },
                            "items": [
                                {
                                    "group": "top",
                                    "id": "d8dc8b0f-0bc3-4e7c-be5d-a0c122023d41"
                                },
                                {
                                    "group": "right",
                                    "id": "fe34202c-b5bf-4363-8572-4b0217c49a80"
                                },
                                {
                                    "group": "bottom",
                                    "id": "fc4e51a1-8e13-40a0-a618-22421f5bd5ac"
                                },
                                {
                                    "group": "left",
                                    "id": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                                }
                            ]
                        },
                        "zIndex": 1,
                        "children": [
                            "e117d7aa-3ad4-404e-bcee-7b6f186daeec",
                            "9d3efdb3-f87f-4e78-a9c0-a9dc5805caa3",
                            "d502d11c-3c0b-4d15-99a5-480ef71af868",
                            "dbf27753-0dc0-4a7b-ad2c-71e163a93f43",
                            "17fb3b36-3d15-4438-b536-82fb04667055",
                            "c847f05b-f39b-4c1a-85b4-1cbdcf8950f2",
                            "5c73ddff-16f4-4bcd-a4d9-f366811d8c3a",
                            "de4750f4-b9f9-492c-89f7-6df3c9fb3a05",
                            "af6313c9-8705-4984-bdb6-23f2ed4612bb"
                        ]
                    },
                    {
                        "position": {
                            "x": 161,
                            "y": 317
                        },
                        "size": {
                            "width": 180,
                            "height": 86
                        },
                        "view": "react-shape-view",
                        "shape": "state",
                        "id": "e117d7aa-3ad4-404e-bcee-7b6f186daeec",
                        "data": {
                            "title": "A1",
                            "exp": "",
                            "inv": "",
                            "composite": false
                        },
                        "ports": {
                            "groups": {
                                "top": {
                                    "position": "top",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "position": "right",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "bottom": {
                                    "position": "bottom",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "left": {
                                    "position": "left",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                }
                            },
                            "items": [
                                {
                                    "group": "top",
                                    "id": "d8dc8b0f-0bc3-4e7c-be5d-a0c122023d41"
                                },
                                {
                                    "group": "right",
                                    "id": "fe34202c-b5bf-4363-8572-4b0217c49a80"
                                },
                                {
                                    "group": "bottom",
                                    "id": "fc4e51a1-8e13-40a0-a618-22421f5bd5ac"
                                },
                                {
                                    "group": "left",
                                    "id": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                                }
                            ]
                        },
                        "zIndex": 2,
                        "parent": "d42792c0-3369-4281-88ea-2dd1d47df34e"
                    },
                    {
                        "position": {
                            "x": 436,
                            "y": 317
                        },
                        "size": {
                            "width": 180,
                            "height": 86
                        },
                        "view": "react-shape-view",
                        "shape": "delay",
                        "id": "9d3efdb3-f87f-4e78-a9c0-a9dc5805caa3",
                        "data": {
                            "title": "A2",
                            "exp": "",
                            "variable": "c",
                            "t": 5,
                            "composite": false
                        },
                        "ports": {
                            "groups": {
                                "top": {
                                    "position": "top",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "position": "right",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "bottom": {
                                    "position": "bottom",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "left": {
                                    "position": "left",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                }
                            },
                            "items": [
                                {
                                    "group": "top",
                                    "id": "724e8f7d-266c-4145-9c1b-717f521da6dc"
                                },
                                {
                                    "group": "right",
                                    "id": "5c2655b9-d2cc-43aa-b76e-4deb6af11e02"
                                },
                                {
                                    "group": "bottom",
                                    "id": "3095bfb1-28a4-4a62-a6a6-1ce986a563d4"
                                },
                                {
                                    "group": "left",
                                    "id": "247497f9-a0ff-48aa-ba8f-e12b35064613"
                                }
                            ]
                        },
                        "zIndex": 3,
                        "parent": "d42792c0-3369-4281-88ea-2dd1d47df34e"
                    },
                    {
                        "position": {
                            "x": 754,
                            "y": 350
                        },
                        "size": {
                            "width": 20,
                            "height": 20
                        },
                        "visible": true,
                        "shape": "probability-node",
                        "id": "d502d11c-3c0b-4d15-99a5-480ef71af868",
                        "data": {},
                        "ports": {
                            "groups": {
                                "top": {
                                    "position": "top",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "position": "right",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "bottom": {
                                    "position": "bottom",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "left": {
                                    "position": "left",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                }
                            },
                            "items": [
                                {
                                    "group": "top",
                                    "id": "54e2d0ab-e2e6-4b20-8215-e2a50d4236a2"
                                },
                                {
                                    "group": "right",
                                    "id": "47ebf83a-d0ad-4441-b889-5191d351c8d1"
                                },
                                {
                                    "group": "bottom",
                                    "id": "6855da3f-d57c-4ba2-939a-28882eb50ee4"
                                },
                                {
                                    "group": "left",
                                    "id": "b57cf501-9057-4bd8-b713-be28b4af0de4"
                                }
                            ]
                        },
                        "zIndex": 4,
                        "parent": "d42792c0-3369-4281-88ea-2dd1d47df34e"
                    },
                    {
                        "position": {
                            "x": 850,
                            "y": 170
                        },
                        "size": {
                            "width": 180,
                            "height": 86
                        },
                        "view": "react-shape-view",
                        "shape": "state",
                        "id": "dbf27753-0dc0-4a7b-ad2c-71e163a93f43",
                        "data": {
                            "title": "A3",
                            "exp": "",
                            "inv": "",
                            "composite": false
                        },
                        "ports": {
                            "groups": {
                                "top": {
                                    "position": "top",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "position": "right",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "bottom": {
                                    "position": "bottom",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "left": {
                                    "position": "left",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                }
                            },
                            "items": [
                                {
                                    "group": "top",
                                    "id": "d8dc8b0f-0bc3-4e7c-be5d-a0c122023d41"
                                },
                                {
                                    "group": "right",
                                    "id": "fe34202c-b5bf-4363-8572-4b0217c49a80"
                                },
                                {
                                    "group": "bottom",
                                    "id": "fc4e51a1-8e13-40a0-a618-22421f5bd5ac"
                                },
                                {
                                    "group": "left",
                                    "id": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                                }
                            ]
                        },
                        "zIndex": 5,
                        "parent": "d42792c0-3369-4281-88ea-2dd1d47df34e"
                    },
                    {
                        "position": {
                            "x": 850,
                            "y": 443
                        },
                        "size": {
                            "width": 180,
                            "height": 86
                        },
                        "view": "react-shape-view",
                        "shape": "state",
                        "id": "17fb3b36-3d15-4438-b536-82fb04667055",
                        "data": {
                            "title": "A4",
                            "exp": "",
                            "inv": "",
                            "composite": false
                        },
                        "ports": {
                            "groups": {
                                "top": {
                                    "position": "top",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "position": "right",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "bottom": {
                                    "position": "bottom",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "left": {
                                    "position": "left",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                }
                            },
                            "items": [
                                {
                                    "group": "top",
                                    "id": "d8dc8b0f-0bc3-4e7c-be5d-a0c122023d41"
                                },
                                {
                                    "group": "right",
                                    "id": "fe34202c-b5bf-4363-8572-4b0217c49a80"
                                },
                                {
                                    "group": "bottom",
                                    "id": "fc4e51a1-8e13-40a0-a618-22421f5bd5ac"
                                },
                                {
                                    "group": "left",
                                    "id": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                                }
                            ]
                        },
                        "zIndex": 6,
                        "parent": "d42792c0-3369-4281-88ea-2dd1d47df34e"
                    },
                    {
                        "shape": "transition",
                        "router": {
                            "name": "metro"
                        },
                        "connector": {
                            "name": "rounded"
                        },
                        "data": {
                            "guard": "",
                            "sync": "",
                            "update": ""
                        },
                        "id": "c847f05b-f39b-4c1a-85b4-1cbdcf8950f2",
                        "source": {
                            "cell": "e117d7aa-3ad4-404e-bcee-7b6f186daeec",
                            "port": "fe34202c-b5bf-4363-8572-4b0217c49a80"
                        },
                        "target": {
                            "cell": "9d3efdb3-f87f-4e78-a9c0-a9dc5805caa3",
                            "port": "247497f9-a0ff-48aa-ba8f-e12b35064613"
                        },
                        "zIndex": 7,
                        "parent": "d42792c0-3369-4281-88ea-2dd1d47df34e"
                    },
                    {
                        "shape": "transition",
                        "router": {
                            "name": "metro"
                        },
                        "connector": {
                            "name": "rounded"
                        },
                        "data": {
                            "guard": "",
                            "sync": "",
                            "update": ""
                        },
                        "id": "5c73ddff-16f4-4bcd-a4d9-f366811d8c3a",
                        "source": {
                            "cell": "9d3efdb3-f87f-4e78-a9c0-a9dc5805caa3",
                            "port": "5c2655b9-d2cc-43aa-b76e-4deb6af11e02"
                        },
                        "target": {
                            "cell": "d502d11c-3c0b-4d15-99a5-480ef71af868",
                            "port": "b57cf501-9057-4bd8-b713-be28b4af0de4"
                        },
                        "zIndex": 8,
                        "parent": "d42792c0-3369-4281-88ea-2dd1d47df34e"
                    },
                    {
                        "shape": "probability-transition",
                        "attrs": {
                            "line": {
                                "stroke": "#1890ff",
                                "strokeDasharray": 5
                            }
                        },
                        "router": {
                            "name": "metro"
                        },
                        "connector": {
                            "name": "rounded"
                        },
                        "data": {
                            "guard": "",
                            "sync": "",
                            "update": "",
                            "weight": 12
                        },
                        "id": "de4750f4-b9f9-492c-89f7-6df3c9fb3a05",
                        "source": {
                            "cell": "d502d11c-3c0b-4d15-99a5-480ef71af868",
                            "port": "47ebf83a-d0ad-4441-b889-5191d351c8d1"
                        },
                        "target": {
                            "cell": "dbf27753-0dc0-4a7b-ad2c-71e163a93f43",
                            "port": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                        },
                        "zIndex": 9,
                        "parent": "d42792c0-3369-4281-88ea-2dd1d47df34e"
                    },
                    {
                        "shape": "probability-transition",
                        "attrs": {
                            "line": {
                                "stroke": "#1890ff",
                                "strokeDasharray": 5
                            }
                        },
                        "router": {
                            "name": "metro"
                        },
                        "connector": {
                            "name": "rounded"
                        },
                        "data": {
                            "guard": "",
                            "sync": "",
                            "update": "",
                            "weight": 17
                        },
                        "id": "af6313c9-8705-4984-bdb6-23f2ed4612bb",
                        "source": {
                            "cell": "d502d11c-3c0b-4d15-99a5-480ef71af868",
                            "port": "47ebf83a-d0ad-4441-b889-5191d351c8d1"
                        },
                        "target": {
                            "cell": "17fb3b36-3d15-4438-b536-82fb04667055",
                            "port": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                        },
                        "zIndex": 10,
                        "parent": "d42792c0-3369-4281-88ea-2dd1d47df34e"
                    },
                    {
                        "position": {
                            "x": 109.99999999999682,
                            "y": 702.0000000000063
                        },
                        "size": {
                            "width": 980,
                            "height": 530
                        },
                        "view": "react-shape-view",
                        "shape": "state",
                        "id": "0cc8e00f-9a1e-49a4-8d12-2309100bfe58",
                        "data": {
                            "title": "B",
                            "exp": "",
                            "inv": "",
                            "composite": true
                        },
                        "ports": {
                            "groups": {
                                "top": {
                                    "position": "top",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "position": "right",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "bottom": {
                                    "position": "bottom",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "left": {
                                    "position": "left",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                }
                            },
                            "items": [
                                {
                                    "group": "top",
                                    "id": "d8dc8b0f-0bc3-4e7c-be5d-a0c122023d41"
                                },
                                {
                                    "group": "right",
                                    "id": "fe34202c-b5bf-4363-8572-4b0217c49a80"
                                },
                                {
                                    "group": "bottom",
                                    "id": "fc4e51a1-8e13-40a0-a618-22421f5bd5ac"
                                },
                                {
                                    "group": "left",
                                    "id": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                                }
                            ]
                        },
                        "zIndex": 11,
                        "children": [
                            "59752520-f097-44d0-a96e-8d563eded661",
                            "932a73bc-ee76-4e0d-a1c2-769f29c12407",
                            "ee63a1c0-f581-4b57-8253-4181cc9b34b1",
                            "f8c408ab-20dc-4c41-a486-35224d069364",
                            "bc3ef988-e21d-4dd4-a996-d89151cdf37e",
                            "54be5835-e8aa-455a-95f7-a788fca962af",
                            "29916c50-2e09-41c9-9e23-ff6d067e69ce",
                            "37363a6d-ae54-4184-ace6-13f87c89ccec",
                            "fd53a442-3f0f-4f05-aae6-02b0a10e94e7"
                        ]
                    },
                    {
                        "position": {
                            "x": 161,
                            "y": 894
                        },
                        "size": {
                            "width": 180,
                            "height": 86
                        },
                        "view": "react-shape-view",
                        "shape": "state",
                        "id": "59752520-f097-44d0-a96e-8d563eded661",
                        "data": {
                            "title": "B1",
                            "exp": "",
                            "inv": "",
                            "composite": false
                        },
                        "ports": {
                            "groups": {
                                "top": {
                                    "position": "top",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "position": "right",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "bottom": {
                                    "position": "bottom",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "left": {
                                    "position": "left",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                }
                            },
                            "items": [
                                {
                                    "group": "top",
                                    "id": "d8dc8b0f-0bc3-4e7c-be5d-a0c122023d41"
                                },
                                {
                                    "group": "right",
                                    "id": "fe34202c-b5bf-4363-8572-4b0217c49a80"
                                },
                                {
                                    "group": "bottom",
                                    "id": "fc4e51a1-8e13-40a0-a618-22421f5bd5ac"
                                },
                                {
                                    "group": "left",
                                    "id": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                                }
                            ]
                        },
                        "zIndex": 12,
                        "parent": "0cc8e00f-9a1e-49a4-8d12-2309100bfe58"
                    },
                    {
                        "position": {
                            "x": 454,
                            "y": 927
                        },
                        "size": {
                            "width": 20,
                            "height": 20
                        },
                        "visible": true,
                        "shape": "probability-node",
                        "id": "932a73bc-ee76-4e0d-a1c2-769f29c12407",
                        "data": {},
                        "ports": {
                            "groups": {
                                "top": {
                                    "position": "top",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "position": "right",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "bottom": {
                                    "position": "bottom",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "left": {
                                    "position": "left",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                }
                            },
                            "items": [
                                {
                                    "group": "top",
                                    "id": "54e2d0ab-e2e6-4b20-8215-e2a50d4236a2"
                                },
                                {
                                    "group": "right",
                                    "id": "47ebf83a-d0ad-4441-b889-5191d351c8d1"
                                },
                                {
                                    "group": "bottom",
                                    "id": "6855da3f-d57c-4ba2-939a-28882eb50ee4"
                                },
                                {
                                    "group": "left",
                                    "id": "b57cf501-9057-4bd8-b713-be28b4af0de4"
                                }
                            ]
                        },
                        "zIndex": 13,
                        "parent": "0cc8e00f-9a1e-49a4-8d12-2309100bfe58"
                    },
                    {
                        "position": {
                            "x": 574,
                            "y": 789
                        },
                        "size": {
                            "width": 180,
                            "height": 86
                        },
                        "view": "react-shape-view",
                        "shape": "state",
                        "id": "ee63a1c0-f581-4b57-8253-4181cc9b34b1",
                        "data": {
                            "title": "NEW STATE",
                            "exp": "",
                            "inv": "",
                            "composite": false
                        },
                        "ports": {
                            "groups": {
                                "top": {
                                    "position": "top",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "position": "right",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "bottom": {
                                    "position": "bottom",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "left": {
                                    "position": "left",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                }
                            },
                            "items": [
                                {
                                    "group": "top",
                                    "id": "d8dc8b0f-0bc3-4e7c-be5d-a0c122023d41"
                                },
                                {
                                    "group": "right",
                                    "id": "fe34202c-b5bf-4363-8572-4b0217c49a80"
                                },
                                {
                                    "group": "bottom",
                                    "id": "fc4e51a1-8e13-40a0-a618-22421f5bd5ac"
                                },
                                {
                                    "group": "left",
                                    "id": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                                }
                            ]
                        },
                        "zIndex": 14,
                        "parent": "0cc8e00f-9a1e-49a4-8d12-2309100bfe58"
                    },
                    {
                        "position": {
                            "x": 574,
                            "y": 1020
                        },
                        "size": {
                            "width": 180,
                            "height": 86
                        },
                        "view": "react-shape-view",
                        "shape": "state",
                        "id": "f8c408ab-20dc-4c41-a486-35224d069364",
                        "data": {
                            "title": "NEW STATE",
                            "exp": "",
                            "inv": "",
                            "composite": false
                        },
                        "ports": {
                            "groups": {
                                "top": {
                                    "position": "top",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "right": {
                                    "position": "right",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "bottom": {
                                    "position": "bottom",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                },
                                "left": {
                                    "position": "left",
                                    "attrs": {
                                        "circle": {
                                            "r": 8,
                                            "magnet": true,
                                            "stroke": "#5F95FF",
                                            "strokeWidth": 2,
                                            "fill": "#fff",
                                            "style": {
                                                "visibility": "hidden"
                                            }
                                        }
                                    }
                                }
                            },
                            "items": [
                                {
                                    "group": "top",
                                    "id": "d8dc8b0f-0bc3-4e7c-be5d-a0c122023d41"
                                },
                                {
                                    "group": "right",
                                    "id": "fe34202c-b5bf-4363-8572-4b0217c49a80"
                                },
                                {
                                    "group": "bottom",
                                    "id": "fc4e51a1-8e13-40a0-a618-22421f5bd5ac"
                                },
                                {
                                    "group": "left",
                                    "id": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                                }
                            ]
                        },
                        "zIndex": 15,
                        "parent": "0cc8e00f-9a1e-49a4-8d12-2309100bfe58"
                    },
                    {
                        "shape": "transition",
                        "router": {
                            "name": "metro"
                        },
                        "connector": {
                            "name": "rounded"
                        },
                        "data": {
                            "guard": "",
                            "sync": "",
                            "update": ""
                        },
                        "id": "bc3ef988-e21d-4dd4-a996-d89151cdf37e",
                        "source": {
                            "cell": "59752520-f097-44d0-a96e-8d563eded661",
                            "port": "fe34202c-b5bf-4363-8572-4b0217c49a80"
                        },
                        "target": {
                            "cell": "932a73bc-ee76-4e0d-a1c2-769f29c12407",
                            "port": "b57cf501-9057-4bd8-b713-be28b4af0de4"
                        },
                        "zIndex": 16,
                        "parent": "0cc8e00f-9a1e-49a4-8d12-2309100bfe58"
                    },
                    {
                        "shape": "probability-transition",
                        "attrs": {
                            "line": {
                                "stroke": "#1890ff",
                                "strokeDasharray": 5
                            }
                        },
                        "router": {
                            "name": "metro"
                        },
                        "connector": {
                            "name": "rounded"
                        },
                        "data": {
                            "guard": "",
                            "sync": "",
                            "update": "",
                            "weight": 12
                        },
                        "id": "fd53a442-3f0f-4f05-aae6-02b0a10e94e7",
                        "source": {
                            "cell": "932a73bc-ee76-4e0d-a1c2-769f29c12407",
                            "port": "47ebf83a-d0ad-4441-b889-5191d351c8d1"
                        },
                        "target": {
                            "cell": "ee63a1c0-f581-4b57-8253-4181cc9b34b1",
                            "port": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                        },
                        "zIndex": 17,
                        "parent": "0cc8e00f-9a1e-49a4-8d12-2309100bfe58"
                    },
                    {
                        "shape": "probability-transition",
                        "attrs": {
                            "line": {
                                "stroke": "#1890ff",
                                "strokeDasharray": 5
                            }
                        },
                        "router": {
                            "name": "metro"
                        },
                        "connector": {
                            "name": "rounded"
                        },
                        "data": {
                            "guard": "",
                            "sync": "",
                            "update": "",
                            "weight": 17
                        },
                        "id": "29916c50-2e09-41c9-9e23-ff6d067e69ce",
                        "source": {
                            "cell": "932a73bc-ee76-4e0d-a1c2-769f29c12407",
                            "port": "47ebf83a-d0ad-4441-b889-5191d351c8d1"
                        },
                        "target": {
                            "cell": "f8c408ab-20dc-4c41-a486-35224d069364",
                            "port": "c1d22b2e-6108-43be-9687-7d63d60842d0"
                        },
                        "zIndex": 18,
                        "parent": "0cc8e00f-9a1e-49a4-8d12-2309100bfe58"
                    },
                    {
                        "shape": "transition",
                        "router": {
                            "name": "metro"
                        },
                        "connector": {
                            "name": "rounded"
                        },
                        "data": {
                            "guard": "",
                            "sync": "",
                            "update": ""
                        },
                        "id": "37363a6d-ae54-4184-ace6-13f87c89ccec",
                        "source": {
                            "cell": "ee63a1c0-f581-4b57-8253-4181cc9b34b1",
                            "port": "d8dc8b0f-0bc3-4e7c-be5d-a0c122023d41"
                        },
                        "target": {
                            "cell": "59752520-f097-44d0-a96e-8d563eded661",
                            "port": "d8dc8b0f-0bc3-4e7c-be5d-a0c122023d41"
                        },
                        "zIndex": 19,
                        "parent": "0cc8e00f-9a1e-49a4-8d12-2309100bfe58"
                    },
                    {
                        "shape": "transition",
                        "router": {
                            "name": "metro"
                        },
                        "connector": {
                            "name": "rounded"
                        },
                        "data": {
                            "guard": "",
                            "sync": "",
                            "update": ""
                        },
                        "id": "54be5835-e8aa-455a-95f7-a788fca962af",
                        "source": {
                            "cell": "f8c408ab-20dc-4c41-a486-35224d069364",
                            "port": "fc4e51a1-8e13-40a0-a618-22421f5bd5ac"
                        },
                        "target": {
                            "cell": "59752520-f097-44d0-a96e-8d563eded661",
                            "port": "fc4e51a1-8e13-40a0-a618-22421f5bd5ac"
                        },
                        "zIndex": 20,
                        "parent": "0cc8e00f-9a1e-49a4-8d12-2309100bfe58"
                    },
                    {
                        "shape": "transition",
                        "router": {
                            "name": "metro"
                        },
                        "connector": {
                            "name": "rounded"
                        },
                        "data": {
                            "guard": "",
                            "sync": "",
                            "update": ""
                        },
                        "id": "1cd45879-64d6-4618-a5af-0b78bf2e3eff",
                        "source": {
                            "cell": "d42792c0-3369-4281-88ea-2dd1d47df34e",
                            "port": "fc4e51a1-8e13-40a0-a618-22421f5bd5ac"
                        },
                        "target": {
                            "cell": "0cc8e00f-9a1e-49a4-8d12-2309100bfe58",
                            "port": "d8dc8b0f-0bc3-4e7c-be5d-a0c122023d41"
                        },
                        "zIndex": 21
                    }
                ]
            })
        })

        graph.on("blank:dblclick", () => {
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
                {name: "PROBABILITY_NODE", title: 'Probability'},
                {name: "INITIAL_NODE", title: 'Initial Node'},
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
            data: {title: "NEW STATE", exp: "", variable: "c", rate: 2, composite: false},
            ports: {...ports}
        })
        const r3 = graph.createNode({
            shape: 'delay-unif',
            x: 180,
            y: 40,
            data: {title: "NEW STATE", exp: "", variable: "c", a: 10, b: 20, composite: false},
            ports: {...ports}
        })
        const r4 = graph.createNode({
            shape: 'delay',
            x: 180,
            y: 40,
            data: {title: "NEW STATE", exp: "", variable: 'c', t: 5, composite: false},
            ports: {...ports}
        })
        const r5 = graph.createNode({
            shape: 'delay-normal',
            x: 180,
            y: 40,
            data: {title: "NEW STATE", exp: "", variable: 'v', a: 10, u: 5, composite: false},
            ports: {...ports}
        })
        const r6 = graph.createNode({
            shape: 'probability-node',
            x: 180,
            y: 40,
            data: {},
            ports: {...ports}
        })
        const r7 = graph.createNode({
            shape: 'initial-node',
            x: 180,
            y: 40,
            data: {},
            ports: {...ports}
        })
        stencil.load([r1], 'STATE')
        stencil.load([r2], 'DELAY_EXP')
        stencil.load([r3], 'DELAY_UNIF')
        stencil.load([r4], 'DELAY')
        stencil.load([r5], 'DELAY_NORMAL')
        stencil.load([r6], 'PROBABILITY_NODE')
        stencil.load([r7], 'INITIAL_NODE')

        // Init node&edge action
        graph.on('cell:click', ({cell}) => {
            setState({
                shape: cell.shape, id: cell.id, data: cell.data ? cell.data : {}
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
                                id: newState.id,
                                shape: state.shape,
                                data: {
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
                            variable: state.data.variable,
                            rate: state.data.rate,
                            composite: state.data.composite
                        }} onChange={(newState) => {
                            setState({
                                id: newState.id, data: {
                                    shape: state.shape,
                                    title: newState.title,
                                    exp: newState.exp,
                                    variable: newState.variable,
                                    rate: newState.rate,
                                    composite: newState.composite
                                }
                            })
                            const cell = G.getCellById(newState.id)
                            cell.setData({
                                title: newState.title,
                                exp: newState.exp,
                                variable: newState.variable,
                                rate: newState.rate,
                                composite: newState.composite
                            })
                        }}/>
                    case 'delay-unif':
                        return <DelayUnifStateInfo state={{
                            id: state.id,
                            title: state.data.title,
                            exp: state.data.exp,
                            variable: state.data.variable,
                            a: state.data.a,
                            b: state.data.b,
                            composite: state.data.composite
                        }} onChange={(newState) => {
                            setState({
                                id: newState.id,
                                shape: state.shape,
                                data: {
                                    title: newState.title,
                                    exp: newState.exp,
                                    variable: newState.variable,
                                    a: newState.a,
                                    b: newState.b,
                                    composite: newState.composite
                                }
                            })
                            const cell = G.getCellById(newState.id)
                            cell.setData({
                                title: newState.title,
                                exp: newState.exp,
                                variable: newState.variable,
                                a: newState.a,
                                b: newState.b,
                                composite: newState.composite
                            })
                        }}/>
                    case 'delay':
                        return <DelayStateInfo state={{
                            id: state.id,
                            title: state.data.title,
                            exp: state.data.exp,
                            variable: state.data.variable,
                            t: state.data.t,
                            composite: state.data.composite
                        }} onChange={(newState) => {
                            setState({
                                id: newState.id,
                                shape: state.shape, data: {
                                    title: newState.title,
                                    exp: newState.exp,
                                    variable: newState.variable,
                                    t: newState.t,
                                    composite: newState.composite
                                }
                            })
                            const cell = G.getCellById(newState.id)
                            cell.setData({
                                title: newState.title,
                                exp: newState.exp,
                                variable: newState.variable,
                                t: newState.t,
                                composite: newState.composite
                            })
                        }}/>
                    case 'delay-normal':
                        return <DelayNormalStateInfo state={{
                            id: state.id,
                            title: state.data.title,
                            inv: state.data.inv,
                            variable: state.data.variable,
                            a: state.data.a,
                            u: state.data.u,
                            composite: state.data.composite
                        }} onChange={(newState) => {
                            setState({
                                id: newState.id,
                                shape: state.shape,
                                data: {
                                    title: newState.title,
                                    inv: newState.inv,
                                    variable: newState.variable,
                                    a: newState.a,
                                    u: newState.u,
                                    composite: newState.composite
                                }
                            })
                            const cell = G.getCellById(newState.id)
                            cell.setData({
                                title: newState.title,
                                inv: newState.inv,
                                variable: newState.variable,
                                a: newState.a,
                                u: newState.u,
                                composite: newState.composite
                            })
                        }}/>
                    case 'transition':
                        return <TransitionSidebar state={{
                            id: state.id,
                            guard: state.data.guard,
                            sync: state.data.sync,
                            update: state.data.update
                        }} onChange={(newState) => {
                            console.log(newState)
                            setState({
                                id: newState.id,
                                shape: state.shape,
                                data: {
                                    guard: newState.guard,
                                    sync: newState.sync,
                                    update: newState.update
                                }
                            })
                            const cell = G.getCellById(newState.id)
                            cell.setData({
                                guard: newState.guard,
                                sync: newState.sync,
                                update: newState.update
                            })
                        }} onSwitch={() => {
                            setState({
                                id: state.id,
                                shape: 'probability-transition',
                                data: {
                                    sync: "",
                                    update: "",
                                    weight: 0,
                                }
                            })
                            const cell = G.getCellById(state.id)
                            cell.prop('shape', 'probability-transition')
                            cell.attr('line/stroke', '#1890ff')
                            cell.attr('line/strokeDasharray', 5)
                            cell.setData({
                                sync: "",
                                update: "",
                                weight: 0,
                            })
                        }}/>
                    case 'probability-transition':
                        return <ProbabilityTransitionSidebar state={{
                            id: state.id,
                            weight: state.data.weight,
                            sync: state.data.sync,
                            update: state.data.update
                        }} onChange={(newState) => {
                            setState({
                                id: newState.id,
                                shape: state.shape,
                                data: {
                                    weight: newState.weight,
                                    sync: newState.sync,
                                    update: newState.update
                                }
                            })
                            const cell = G.getCellById(newState.id)
                            cell.setData({
                                weight: newState.weight,
                                sync: newState.sync,
                                update: newState.update
                            })
                        }} onSwitch={() => {
                            setState({
                                id: state.id,
                                shape: 'transition',
                                data: {
                                    sync: "",
                                    update: "",
                                    guard: '',
                                }
                            })
                            const cell = G.getCellById(state.id)
                            cell.prop('shape', 'transition')
                            cell.attr('line/stroke', '#faad14')
                            cell.attr('line/strokeDasharray', null)
                            cell.setData({
                                sync: "",
                                update: "",
                                weight: 0,
                            })
                        }}/>
                }
            })()}
        </div>
    </div>
}

export default Layout;