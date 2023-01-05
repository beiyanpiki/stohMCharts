import {generateID} from '../utils'

class Graph {
    constructor() {
        this.vertices = []; // Save ID
        this.data = new Map()  // for node, {id: data, shape}; for edge, {id: data, shape, target}
        this.adjList = new Map(); // {id: [edge_id1, edge_id2]}
        this.root = null
    }

    add_vertices(id, shape, data) {
        this.vertices.push(id)
        this.data.set(id, {shape, data})
        this.adjList.set(id, [])
    }

    add_edge(id, shape, data, source, target) {
        this.adjList.get(source).push(id)
        this.data.set(id, {shape, data, target})
    }

    getRoot() {
        const cnt = new Map()
        this.vertices.forEach((v) => {
            cnt.set(v, 0)
        })
        for (let [_, edges] of this.adjList) {
            edges.forEach((edge_id) => {
                const target = this.data.get(edge_id).target
                if (cnt.has(target)) {
                    cnt.set(target, cnt.get(target) + 1)
                }
            })
        }
        let min_times = 9999999, min_node = ""
        for (let [node_id, times] of cnt) {
            if (times <= min_times) {
                min_times = times
                min_node = node_id
            }
        }
        this.root = min_node
    }

    loadData(nodes, edges) {
        nodes.forEach(({id, shape, data}) => {
            this.add_vertices(id, shape, data)
        })
        edges.forEach(({id, shape, data, source, target}) => {
            this.add_edge(id, shape, data, source.cell, target.cell)
        })
        this.getRoot()
    }
}

const convertNode = (node_id, vis, G, A) => {
    if (vis.has(node_id)) {
        return
    }
    vis.set(node_id, true)

    const node_data = G.data.get(node_id)
    // If node is not exist, create it.
    if (!A.vertices.includes(node_id)) {
        A.add_vertices(node_id, node_data.shape === 'probability-node' ? 'branch' : 'location', {
            title: node_data.data.title, invariant: "", rate_exp: ""
        })
    }
    const edges = G.adjList.get(node_id)
    edges.forEach((edge_id) => {
        const edge_data = G.data.get(edge_id)
        const target_id = edge_data.target

        // If target node is not exist, create it.
        const target_data = G.data.get(target_id)
        if (!A.vertices.includes(target_id)) {
            A.add_vertices(target_id, target_data.shape === 'probability-node' ? 'branch' : 'location', {
                title: target_data.data.title, invariant: "", rate_exp: ""
            })
        }
        // Link source to target
        if (node_data.shape !== 'delay') {
            if (node_data.shape === 'probability-node') {
                A.add_edge(edge_id, 'prob-transition', {
                    update: edge_data.data.update, sync: edge_data.data.sync, weight: edge_data.data.weight
                }, node_id, target_id)
            } else {
                A.add_edge(edge_id, 'transition', {
                    guard: edge_data.data.guard, sync: edge_data.data.sync, update: edge_data.data.update
                }, node_id, target_id)
            }
        }

        // DelayUnif(a, b)
        if (node_data.shape === 'delay-unif') {
            // Algorithm 1: Line 7
            const {variable, a, b} = node_data.data
            const node_data_raw = A.data.get(node_id)
            A.data.set(node_id, {
                ...node_data_raw, data: {
                    ...node_data_raw.data, invariant: `${variable} <= ${b}`
                }
            })

            const edge_data_raw = A.data.get(edge_id)
            A.data.set(edge_id, {
                ...edge_data_raw, data: {
                    ...edge_data_raw.data, guard: `${variable} >= ${a}`
                }
            })
        }
        // DelayExp(rate)
        if (node_data.shape === 'delay-exp') {
            // Algorithm 1: Line 8
            const {rate} = node_data.data
            const node_data_raw = A.data.get(node_id)
            A.data.set(node_id, {
                ...node_data_raw, data: {
                    ...node_data_raw.data, rate_exp: rate
                },
            })
        }
        // Delay(t)
        if (node_data.shape === 'delay') {
            // Algorithm 1: Line 9
            // Create New Node and Link node
            const new_node_id = generateID()
            A.add_vertices(new_node_id, 'location', {
                title: '', invariant: `${node_data.data.variable} <= ${node_data.data.t}`, rate_exp: ''
            })
            const new_edge_1 = generateID();
            A.add_edge(new_edge_1, 'transition', {
                guard: '', sync: '', update: `${node_data.data.variable} = 0`
            }, node_id, new_node_id)
            A.add_edge(edge_id, 'transition', {
                guard: `${node_data.data.variable} == ${node_data.data.t}`,
                sync: edge_data.data.sync,
                update: edge_data.data.update
            }, new_node_id, target_id)
        }
        // Normal(a, u)
        if (node_data.shape === 'normal') {
            // Algorithm 1: Line 10
            const {variable, a, u} = node_data.data
            const edge_data_raw = A.data.get(edge_id)
            A.data.set(edge_id, {
                ...edge_data_raw, data: {
                    ...edge_data_raw.data, update: `${variable} = Norm(${a}, ${u})`
                }
            })
        }
        // Probability
        if (node_data.shape === 'probability-node') {
            // Algorithm 1: Line 13
            const my_prob = edge_data.data.weight
            let sum_prob = 0
            edges.forEach((edge) => {
                const ed = G.data.get(edge)
                if (ed.shape === 'probability-transition') {
                    sum_prob += ed.data.weight
                }
            })
            const prob = my_prob / sum_prob
            const edge_data_raw = A.data.get(edge_id)
            A.data.set(edge_id, {
                ...edge_data_raw, data: {
                    ...edge_data_raw.data, weight: prob
                }
            })
        }
        // Action
        // if (node_id === target_id) {
        //     console.log("Self Loop!!", edge_id)
        //     // Algorithm 1: Line 11
        //     A.add_edge(edge_id, 'transition', {
        //         guard: edge_data.data.guard,
        //         sync: edge_data.data.sync,
        //         update: edge_data.data.update
        //     }, node_id, target_id)
        // }
        convertNode(target_id, vis, G, A)
    })
}


export const convert = (data) => {
    let template = []

    let cell_map = new Map()
    data.cells.forEach((cell) => {
        cell_map.set(cell.id, cell)
    })

    // Find all composite node
    let composite_nodes = [], composite_edges = []
    data.cells.forEach((cell) => {
        if ('composite' in cell.data && cell.data.composite) {
            composite_nodes.push(cell)
        }
    })
    data.cells.forEach((cell) => {
        if (cell.shape === 'transition' || cell.shape === 'probability-transition') {
            if (!('parent' in cell) || cell.source.cell === cell.target.cell) {
                composite_edges.push(cell)
            }
        }
    })
    let composite_G = new Graph(), composite_A = new Graph()
    composite_G.loadData(composite_nodes, composite_edges)
    let vis = new Map()
    convertNode(composite_G.root, vis, composite_G, composite_A)

    template.push({
        name: 'overall',
        vertices: composite_A.vertices,
        data: composite_A.data,
        adjList: composite_A.adjList,
        root: composite_G.root
    })

    // Find all child node
    for (let composite_node of composite_nodes) {
        if (composite_node.children === undefined) {
            break
        }
        let nodes = [], edges = []
        composite_node.children.forEach((cell_id) => {
            const cell_data = cell_map.get(cell_id)
            if (cell_data.shape === 'transition' || cell_data.shape === 'probability-transition') {
                edges.push(cell_data)
            } else {
                nodes.push(cell_data)
            }
        })
        if (nodes.length === 0) {
            break
        }
        let sub_G = new Graph(), sub_A = new Graph(), vis = new Map()
        sub_G.loadData(nodes, edges)
        convertNode(sub_G.root, vis, sub_G, sub_A)
        template.push({
            name: composite_node.data.title,
            vertices: sub_A.vertices,
            data: sub_A.data,
            adjList: sub_A.adjList,
            root: sub_G.root
        })
    }
    return template
}


