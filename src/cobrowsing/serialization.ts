enum EVENTS_TYPE {
    CLICK = 0,
    INPUT,
    MOUSE,
    DOM_CHANGE,
    ATTRIBUTE_CHANGE,

}
interface HTMLElementSerialization {
    id: number;
    type: number;
    tag?: string;
    content?: string;
    attributes?: {};
    children?: Array<HTMLElementSerialization>;
}

interface mouseClick {
    x: number;
    y: number;
}

interface inputEvent {
    id: number;
    content: string;
}

interface DOMEvent {
    id: number;
    content: HTMLElementSerialization
}

interface AttributeEvent {
    id: number;
    content: {}
}

interface HTMLEvent {
    type: number;
    data: mouseClick | inputEvent | DOMEvent | AttributeEvent
}

let _id = -1;

export const snapshot = (): string => {
    const DOMVirual = serializeDOMElement(document)
    return JSON.stringify(DOMVirual)
}

const map = new Map<number, HTMLElement>()

const serializeDOMElement = (element: HTMLElement | Document): HTMLElementSerialization | undefined => {
    switch(element.nodeType) {
        case document.ELEMENT_NODE:
            element = element as HTMLElement
            //@ts-ignore
            element.__emploriumId = _id + 1;
            return {
                id: ++_id,
                tag: element.tagName.toLocaleLowerCase(),
                type: document.ELEMENT_NODE,
                children: Array.from(element.childNodes).map(child => serializeDOMElement(child as HTMLElement)).filter(serialize => serialize !== void 0) as HTMLElementSerialization[],
                attributes: Array.from(element.attributes).map(attribute => {
                    if (attribute.value === "" || attribute.value === null || attribute.value === void 0) {
                        return {}
                    }
                    const protocol = window.location.protocol
                    const hostname = window.location.hostname
                    const port =  window.location.port
                    const value = (attribute.name === "href" || attribute.name === "src") && !/^(https|http):\/\//.test(attribute.value) ? `${protocol}//${hostname}:${port}${attribute.value}` : attribute.value 
                    return ({[attribute.name]: value})
                }).reduce((acc, v) => ({...acc, ...v}),{})
            }
        case document.TEXT_NODE:
            element = element as HTMLElement
            if (element.textContent === null) {
                return undefined
            }
            //@ts-ignore
            element.__emploriumId = _id + 1;
            return {
                id: ++_id,
                type: document.TEXT_NODE,
                content: element.textContent as string,
            }
        case document.DOCUMENT_NODE:
            element = element as Document
            //@ts-ignore
            element.__emploriumId = _id + 1;
            return {
                id: ++_id,
                type: document.DOCUMENT_NODE,
                children: [element.head, element.body].map(element => serializeDOMElement(element)).filter(serialize => serialize !== void 0) as HTMLElementSerialization[]
            }
    }
    return undefined;
}

export const rebuildDOM = (serialization: string | HTMLElementSerialization, dom: Document) => {
    if (typeof serialization === "string") {
        serialization = JSON.parse(serialization)
    }

    return (buildElementNode(serialization as HTMLElementSerialization, dom));
}

export const buildElementNode = (element: HTMLElementSerialization, virtualDocument?: Document): HTMLElement | Document | Text | undefined => {
    switch(element.type) {
        case document.DOCUMENT_NODE: {
            //const doc = document.implementation.createDocument(null, null, null)
            const children = element.children?.map(child => buildElementNode(child, virtualDocument)) || []
            const HTMLNode = document.createElement("html")
            children.map(child => HTMLNode.appendChild(child as HTMLElement))
            virtualDocument!.append(HTMLNode)
            return virtualDocument
        }
        case document.ELEMENT_NODE: {
            const node = virtualDocument?.createElement(element.tag as string) as HTMLElement
            const attributes = element.attributes as {} || {}
            const children = element.children?.map(child => buildElementNode(child, virtualDocument)) || []
            //@ts-ignore
            node!.__emploriumId = element.id
            //@ts-ignore
            Object.keys(attributes).map(key => node?.setAttribute(key, attributes[key]))
            children.map(child => node.appendChild(child as HTMLElement))
            //@ts-ignore
            map.set(node.__emploriumId, node)
            return node
        }
        case document.TEXT_NODE: {
            const textNode = virtualDocument?.createTextNode(element.content as string) as Text
            return textNode
         }

    }
    return undefined
}

export const executeEvent = (event: string): void => {
    try {
        const parsedEvent = JSON.parse(event) as HTMLEvent
        
        switch (parsedEvent.type){
            case EVENTS_TYPE.INPUT: {
                const eventContent = parsedEvent.data  as inputEvent
                const node = map.get(eventContent.id) as HTMLInputElement
                node.value = eventContent.content
                break
            }

            case EVENTS_TYPE.ATTRIBUTE_CHANGE:{
                const eventContent = parsedEvent.data as AttributeEvent
                const node = map.get(eventContent.id)
                //@ts-ignore
                Object.keys(eventContent.content).forEach(key => node?.setAttribute(key, eventContent.content[key]))
                break
            }

            case EVENTS_TYPE.DOM_CHANGE: {
                const eventContent = parsedEvent.data as DOMEvent
                const node = map.get(eventContent.id)

                const removeIDs = (child: HTMLElement) => {
                    if (child.nodeType !== document.ELEMENT_NODE) return undefined
                    //@ts-ignore
                    const id = child.__emploriumId
                    map.delete(id)
                    child.childNodes.forEach(child => removeIDs(child as HTMLElement))
                }
                node?.childNodes.forEach(child => {
                    removeIDs(child as HTMLElement)
                    child.remove()
                })

               const builded =  buildElementNode(eventContent.content as HTMLElementSerialization)
                builded?.childNodes.forEach(child => node?.append(child))
            }
        }
    } catch {
        console.warn("Couldn't parse the received event !")
    }
}