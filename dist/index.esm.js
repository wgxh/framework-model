/**
 * Create a observer object.
 */
class Reactive {
    raw;
    observale = {};
    depends = new Map();
    /**
     * @param raw - raw object to observe.
     */
    constructor(raw) {
        this.raw = raw;
        this.observale = this.bind(raw);
    }
    /**
     * Bind.
     */
    bind(raw) {
        const self = this;
        const observale = new Proxy(raw, {
            get(target, key) {
                self.registerDepend(key);
                return Reflect.get(target, key);
            },
            set(target, key, value) {
                const depends = self.depends.get(key);
                Reflect.set(target, key, value);
                if (depends != undefined) {
                    depends.forEach((observer) => observer());
                }
                return true;
            },
        });
        for (const key in raw) {
            const item = Reflect.get(raw, key);
            if (typeof item === "object") {
                Reflect.set(observale, key, this.bind(item));
            }
        }
        return observale;
    }
    /**
     * Register depend.
     */
    registerDepend(key) {
        this.depends.get(key);
        {
            return false;
        }
    }
}
/**
 * Raw object to observable object.
 *
 * @param target - raw object to observe.
 */
function use(raw) {
    return new Reactive(raw).observale;
}

class Base {
    type;
    childrens;
    ownClassName = `w${Math.floor(Math.random() * 1000000)}`;
    attributes = {};
    styles = {};
    evnets = new Map();
    constructor(type, childrens) {
        this.type = type;
        this.childrens = childrens;
        this.attributes["className"] = this.ownClassName;
    }
    attrs(attrs) {
        Object.assign(this.attributes, attrs);
        return this;
    }
    class(...classNames) {
        this.attributes["className"] += ` ${classNames.join(" ")}`;
        return this;
    }
    style(style) {
        Object.assign(this.styles, style);
        return this;
    }
    id(id) {
        this.attributes["id"] = id;
        return this;
    }
    on(type, listener) {
        this.evnets.set(type, listener);
        return this;
    }
    _(...childrens) {
        this.childrens.push(...childrens);
        return this;
    }
}

class Element extends Base {
    static styleEl = document.createElement("style");
    constructor(type, ...childrens) {
        super(type, childrens);
    }
    resolveAttributes(el) {
        for (let attr in this.attributes) {
            Reflect.set(el, attr, this.attributes[attr]);
        }
    }
    resolveEvents(el) {
        this.evnets.forEach((listener, type) => {
            el.addEventListener(type, listener);
        });
    }
    resolveStyle(el) {
        const selector = `${this.type}.${this.attributes.className
            .split(" ")
            .join(".")}`;
        const rules = `${Object.keys(this.styles)
            .map((rule) => {
            return `${rule}: ${this.styles[rule]};`;
        })
            .join("")}`;
        el.innerText += `${selector} {${rules}}`;
    }
    resolveChildrens(el) {
        this.childrens.forEach((child) => {
            if (typeof child == "function") {
                el.append(child().render());
            }
            else if (typeof child == "string") {
                el.append(document.createTextNode(child));
            }
            else {
                el.append(child.render());
            }
        });
    }
    render() {
        if (this.type == "text") {
            return document.createTextNode(this.childrens.join(""));
        }
        else {
            const el = document.createElement(this.type);
            this.resolveAttributes(el);
            this.resolveEvents(el);
            this.resolveStyle(Element.styleEl);
            this.resolveChildrens(el);
            return el;
        }
    }
}

/**
 * Data manager.
 */
class Model {
    state;
    actions;
    constructor(options) {
        this.state = use(options.state);
        this.actions = !!options.actions ? options.actions : {};
    }
    action(type, a) {
        this.action[type] = a;
        return this;
    }
    dispatch(type, ...args) {
        if (!(type in this.actions)) {
            return false;
        }
        this.actions[type].call(this.state, ...args);
        return this;
    }
    getState() {
        return this.state;
    }
    select(selector) {
        return selector(this.state);
    }
}

export { Model };
