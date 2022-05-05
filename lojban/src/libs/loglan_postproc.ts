
export const postprocessing = function (ast: any, opts={}) {
    
    return clearJson(ast, [null, undefined, '', ' '], opts)
}
const isNonEmpty = function (d: any, ignores: any[]) {
    return (
        !ignores.includes(d) &&
        (typeof d !== 'object' || Object.keys(d).length)
    )
}
function clearJson(
    obj: any,
    ignores = [null, undefined, '', ' '],
    opts: { removeIntermediateNodes?: boolean, morphemes?: boolean, lowNodes?: string[], importantNodes?: string[] } = {}
    ) {
        let node_id = 0
    const parsed =
    JSON.parse(JSON.stringify(obj), function (_, v) {
        if (v?.rule) {
            v.id = node_id
            node_id++
        }
            if (v?.rule && opts.lowNodes?.includes(v?.rule)) delete v.children;
            if (
                !opts.morphemes &&
                v?.rule &&
                /^([A-Z]+[0-9]*|comma\b|comma2\b|period\b|end\b)/.test(v.rule)
            )
                delete v.children
            if (v?.rule && ['end'].includes(v.rule)) return
            if (Array.isArray(v)) {
                v = v.filter(Boolean).flat()
            }
            if (v?.children && !Array.isArray(v.children)) {
                v.children = [v.children]
            }
            try {
                if (v?.children) {
                    if (opts.removeIntermediateNodes)
                        while (
                            v.children &&
                            v.children.length === 1 &&
                            !opts.importantNodes.includes(v.children[0].rule)
                        ) {
                            if (!v.children[0].children) break
                            v.children = v.children[0].children
                        }
                    for (let n in v.children) {
                        if (v.children[n].rule) v.children[n].parent = v.id
                    }
                }
            } catch (error) {
                console.log(error)
            }

            if (!isNonEmpty(v, ignores)) return
            return v
        }) || {}

    return parsed
}
