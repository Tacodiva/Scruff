import { ScuffrElement } from "./ScuffrElement";
import type { ScuffrParentElement } from "./ScuffrParentElement";


export class ScuffrDummyElement extends ScuffrElement {
    public parent: ScuffrParentElement | null;

    public constructor(parent: ScuffrParentElement) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 });
        this.parent = parent;
    }
}
