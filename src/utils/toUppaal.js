import xml2js from 'xml-js'

const baseXML = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE nta PUBLIC '-//Uppaal Team//DTD Flat System 1.1//EN' 'http://www.it.uu.se/research/group/darts/uppaal/flat-1_2.dtd'>
<nta>
\t<declaration>// Place global declarations here.</declaration>
\t<template>
\t\t<name>Empty Template</name>
\t\t<declaration>// Place local declarations here.</declaration>
\t</template>
\t<system>// Place template instantiations here.
Process = Template();
// List one or more processes to be composed into a system.
system Process;
    </system>
\t<queries>
\t\t<query>
\t\t\t<formula></formula>
\t\t\t<comment></comment>
\t\t</query>
\t</queries>
</nta>`

export const toUppaalXML = (datas) => {
    let result1 = xml2js.xml2js(baseXML, { compact: true })
    console.log(result1.nta)
    let global_declaretion = '\n'
    for (const chan of datas[0].chan) {
        global_declaretion += `broadcast chan ${chan};\n`
    }
    console.log(datas[0].variable)
    for (const variable of datas[0].variable) {
        global_declaretion += `clock ${variable};\n`
    }
    result1.nta.declaration._text += global_declaretion

    let templates_name = []

    result1.nta.template = []
    for (const data of datas) {
        templates_name.push(data.name)

        let x = 0,
            y = 0

        const tpl = {
            name: { _text: data.name },
            declaration: { _text: '// Place local declarations here.' },
            location: [],
            branchpoint: [],
            init: {},
            transition: [],
        }
        // Add location and branchpoint
        data.vertices.forEach((node_id) => {
            x += 100
            y += 0
            const node_data = data.data.get(node_id)
            const node_shape = node_data.shape
            // Insert node
            let obj = {
                _attributes: { id: node_id, x: x, y: y },
            }
            if (node_shape === 'location') {
                const { title, invariant, rate_exp } = node_data.data
                if (title !== '') {
                    obj.name = {
                        _attributes: { x: x, y: y + 20 },
                        _text: title,
                    }
                }
                if (invariant !== '' || rate_exp !== '') {
                    obj.label = []
                    if (invariant !== '') {
                        obj.label.push({
                            _attributes: { kind: 'invariant', x: x, y: y + 40 },
                            _text: invariant,
                        })
                    }
                    if (rate_exp !== '') {
                        obj.label.push({
                            _attributes: {
                                kind: 'exponentialrate',
                                x: x,
                                y: y + 60,
                            },
                            _text: `${rate_exp}`,
                        })
                    }
                }
                tpl.location.push(obj)
            } else if (node_shape === 'branch') {
                tpl.branchpoint.push(obj)
            }
            // Insert edge
            const source_id = node_id
            const edges = data.adjList.get(node_id)
            edges.forEach((edge_id) => {
                const edge_data = data.data.get(edge_id)
                obj = {
                    source: { _attributes: { ref: source_id } },
                    target: { _attributes: { ref: edge_data.target } },
                    label: [],
                }
                if (edge_data.shape === 'transition') {
                    const { guard, sync, update } = edge_data.data
                    if (guard !== '') {
                        obj.label.push({
                            _attributes: {
                                kind: 'guard',
                                x: x + 50,
                                y: y + 10,
                            },
                            _text: guard,
                        })
                    }
                    if (sync !== '') {
                        obj.label.push({
                            _attributes: {
                                kind: 'synchronisation',
                                x: x + 50,
                                y: y + 20,
                            },
                            _text: sync,
                        })
                    }
                    if (update !== '') {
                        obj.label.push({
                            _attributes: {
                                kind: 'assignment',
                                x: x + 50,
                                y: y + 30,
                            },
                            _text: update,
                        })
                    }
                } else if (edge_data.shape === 'prob-transition') {
                    const { update, sync, weight } = edge_data.data
                    if (weight !== '') {
                        obj.label.push({
                            _attributes: {
                                kind: 'probability',
                                x: x + 50,
                                y: y + 10,
                            },
                            _text: `${weight}`,
                        })
                    }
                    if (sync !== '') {
                        obj.label.push({
                            _attributes: {
                                kind: 'synchronisation',
                                x: x + 50,
                                y: y + 20,
                            },
                            _text: sync,
                        })
                    }
                    if (update !== '') {
                        obj.label.push({
                            _attributes: {
                                kind: 'update',
                                x: x + 50,
                                y: y + 30,
                            },
                            _text: update,
                        })
                    }
                }
                tpl.transition.push(obj)
            })
        })
        tpl.init = { _attributes: { ref: data.root } }

        result1.nta.template.push(tpl)
    }

    let process = '// Place template instantiations here.\n'
    for (const template_name of templates_name) {
        process += `${template_name}_1 = ${template_name}();\n`
    }
    process += 'system '
    for (const template_name of templates_name) {
        process += `${template_name}_1,`
    }
    process = process.substring(0, process.length - 1) + ';'
    result1.nta.system._text = process

    const newXml = xml2js.js2xml(result1, { compact: true })
    return newXml
}
