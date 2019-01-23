import Component from './component'

const RENDER_TYPE_PRIM = 'prime'         // string || boolean 
const RENDER_TYPE_BASIC = 'basic'        // divs
const RENDER_TYPE_COM = 'component'      // components

const _setAttribute = (dom, key, value) => {
    if (typeof value == 'function' && key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase();
        dom.__gooactHandlers = dom.__gooactHandlers || {};
        dom.removeEventListener(eventType, dom.__gooactHandlers[eventType]);
        dom.__gooactHandlers[eventType] = value;
        dom.addEventListener(eventType, dom.__gooactHandlers[eventType]);
    } else if (key == 'checked' || key == 'value' || key == 'className') {
        dom[key] = value;
    } else if (key == 'style' && typeof value == 'object') {
        Object.assign(dom.style, value);
    } else if (key == 'ref' && typeof value == 'function') {
        value(dom);
    } else if (key == 'key') {
        dom.__gooactKey = value;
    } else if (typeof value != 'object' && typeof value != 'function') {
        dom.setAttribute(key, value);
    }
}

const _renderType = (vdom) => {
    if (typeof vdom == 'string' || typeof vdom == 'number') {
        return RENDER_TYPE_PRIM
    } else if (typeof vdom == 'object' && typeof vdom.type == 'function') {
        return RENDER_TYPE_COM
    } else if (typeof vdom == 'object' && typeof vdom.type == 'string') {
        return RENDER_TYPE_BASIC
    } else {
        return null
    }
}

const _primeRender = (vdom, parent) => {
    const mount = parent ? (el => parent.appendChild(el)) : (el => el)
    return mount(document.createTextNode(vdom))
}

const _basicRender = (vdom, parent) => {
    const mount = parent ? (el => parent.appendChild(el)) : (el => el)
    const dom = mount(document.createElement(vdom.type))
    for (const child of [/* flatten */].concat(...vdom.children))
        render(child, dom)
    for (const prop in vdom.props)
        _setAttribute(dom, prop, vdom.props[prop]);
    return dom
}

const render = (vdom, parent = null) => {
    let dom = null
    switch (_renderType(vdom)) {
        case RENDER_TYPE_PRIM:
            dom = _primeRender(vdom, parent)
            break
        case RENDER_TYPE_BASIC:
            dom = _basicRender(vdom, parent)
            break
        case RENDER_TYPE_COM:
            dom = Component.render(vdom, parent)
            break
        default:
            throw new Error(`Invalid VDOM: ${vdom}.`)
    }
    return dom
}

export default render