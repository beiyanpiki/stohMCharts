import {generateID} from '../utils'

class Graph {
    constructor() {
        this.vertices = []; // Save ID
        this.data = new Map()  // for node, {id: data, shape}; for edge, {id: data, shape, target}
        this.adjList = new Map(); // {id: [edge_id1, edge_id2]}

        this.roots = []
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

    loadData(data) {
        let nodes = [], edges = []
        data.cells.forEach((cell) => {
            if (cell.shape === 'transition' || cell.shape === 'probability-transition') {
                edges.push(cell)
            } else {
                nodes.push(cell)
            }
        })

        nodes.forEach(({id, shape, data}) => {
            this.add_vertices(id, shape, data)
        })
        edges.forEach(({id, shape, data, source, target}) => {
            this.add_edge(id, shape, data, source.cell, target.cell)
        })

        data.roots.forEach(({id}) => {
            this.roots.push(id)
        })
    }
}

export const convert = (data) => {
    let G = new Graph(), A = new Graph()
    const convertNode = (node_id) => {
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
                        update: edge_data.data.update,
                        sync: edge_data.data.sync,
                        weight: edge_data.data.weight
                    }, node_id, target_id)
                } else {
                    A.add_edge(edge_id, 'transition', {
                        guard: edge_data.data.guard,
                        sync: edge_data.data.sync,
                        update: edge_data.data.update
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
            convertNode(target_id)
        })
    }
    G.loadData(data)
    G.roots.forEach((root_id) => {
        convertNode(root_id)
    })

    return {
        vertices: A.vertices, data: A.data, adjList: A.adjList,
    }
}


