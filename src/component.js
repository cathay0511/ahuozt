import render from './render'

class Component {
    constructor(props) {
        this.props = props || {}
    }

    static render(vdom, parent=null) {
        const props = Object.assign({}, vdom.props, {children: vdom.children})
        if (Component.isPrototypeOf(vdom.type)) {
            const instance = new (vdom.type)(props)
            instance.base = render(instance.render(), parent)
            instance.base.__gooactInstance = instance
            instance.base.__gooactKey = vdom.props.key
            return instance.base
        } else {
            return render(vdom.type(props), parent)
        }
    }
}

export default Component