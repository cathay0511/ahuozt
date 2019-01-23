import render from './render'
import reconcile from './reconcile'

class Component {
    constructor(props) {
        this.props = props || {}
    }

    static render(vdom, parent=null) {
        const props = Object.assign({}, vdom.props, {children: vdom.children})
        if (Component.isPrototypeOf(vdom.type)) {
            const instance = new (vdom.type)(props)
            instance.componentWillMount()
            instance.base = render(instance.render(), parent)
            instance.base.__gooactInstance = instance
            instance.base.__gooactKey = vdom.props.key
            instance.componentDidMount()
            return instance.base
        } else {
            return render(vdom.type(props), parent)
        }
    }

    static patch(dom, vdom, parent=dom.parentNode) {
        const props = Object.assign({}, vdom.props, {children: vdom.children});
        if (dom.__gooactInstance && dom.__gooactInstance.constructor == vdom.type) {
            dom.__gooactInstance.componentWillReceiveProps(props)
            dom.__gooactInstance.props = props;
            return reconcile(dom, dom.__gooactInstance.render(), parent);
        } else if (Component.isPrototypeOf(vdom.type)) {
            const ndom = Component.render(vdom, parent);
            return parent ? (parent.replaceChild(ndom, dom) && ndom) : (ndom)
        } else if (!Component.isPrototypeOf(vdom.type)) {
            return reconcile(dom, vdom.type(props), parent);
        }
    }

    setState(nextState) {
        if (this.base && this.shouldComponentUpdate(this.props, nextState)) {
            const prevState = this.state;
            this.componentWillUpdate(this.props, nextState);
            this.state = nextState;
            reconcile(this.base, this.render());
            this.componentDidUpdate(this.props, prevState);
        } else {
            this.state = nextState;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps != this.props || nextState != this.state;
    }

    componentWillReceiveProps(nextProps) {
        return undefined;
    }

    componentWillUpdate(nextProps, nextState) {
        return undefined;
    }

    componentDidUpdate(prevProps, prevState) {
        return undefined;
    }

    componentWillMount() {
        return undefined;
    }

    componentDidMount() {
        return undefined;
    }

    componentWillUnmount() {
        return undefined;
    }
}

export default Component