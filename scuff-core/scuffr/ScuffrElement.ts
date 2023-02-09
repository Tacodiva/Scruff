import type { Vec2 } from "../utils/Vec2";
import type { ScuffrElementParent } from "./ScuffrElementParent";
import type { ScuffrWorkspace } from "./ScuffrWorkspace";

export abstract class ScuffrElement {
    public static readonly DATA_NAME = "sfs-rendered-element";

    public readonly workspace: ScuffrWorkspace;

    public readonly dom: SVGGraphicsElement;
    private readonly _domTranslation: SVGTransform;
    public dimensions: Vec2;
    public topLeftOffset: Vec2;

    public translationSelf: Vec2;
    public translationParent: Vec2;
    public get translationX() { return this.translationSelf.x + this.translationParent.x; }
    public get translationY() { return this.translationSelf.y + this.translationParent.y; }


    public abstract parent: ScuffrElementParent | null;

    public constructor(dom: SVGGraphicsElement, workspace?: ScuffrWorkspace, translation: Vec2 = { x: 0, y: 0 }, dimensions: Vec2 = { x: 0, y: 0 }, topLeftOffset: Vec2 = { x: 0, y: 0 }, translationParent: Vec2 = { x: 0, y: 0 }) {
        this.workspace = workspace ?? this._getWorkspace();
        this.dom = dom;
        this.dimensions = dimensions;
        this.topLeftOffset = topLeftOffset;

        this.translationSelf = translation;
        this.translationParent = translationParent;
        this._domTranslation = this.workspace.svg?.createSVGTransform();
        if (this._domTranslation) {
            this.dom.transform.baseVal.clear();
            this.dom.transform.baseVal.appendItem(this._domTranslation);
        }

        (<any>this.dom)[ScuffrElement.DATA_NAME] = this;
    }

    public getAbsoluteTranslation(): Vec2 {
        if (!this.parent) return { x: this.translationX, y: this.translationY };
        const parentTrans = this.parent.getAbsoluteTranslation();
        return {
            x: this.translationX + parentTrans.x,
            y: this.translationY + parentTrans.y
        }
    }

    protected _getWorkspace(): ScuffrWorkspace {
        throw new Error("No workspace provided in constructor and element did not override _getWorkspace()!");
    }

    public onClick(event: MouseEvent): boolean {
        return false;
    }

    public onDrag(event: MouseEvent): boolean {
        return false;
    }

    public onWheel(event: WheelEvent): boolean {
        return false;
    }

    public updateTraslation() {
        if (this._domTranslation)
            this._domTranslation.setTranslate(this.translationX, this.translationY);
        this.onTranslationUpdate();
    }

    public onTranslationUpdate() { }

    public updateAll() {
        this.update(false);
    }

    public update(propagateUp: boolean) {
        if (propagateUp && this.parent) this.parent.update(true);
    }

    public get topOffset() {
        return -this.topLeftOffset.y;
    }

    public get bottomOffset() {
        return this.dimensions.y + this.topOffset;
    }

    public get leftOffset() {
        return -this.topLeftOffset.x;
    }

    public get rightOffset() {
        return this.dimensions.x + this.leftOffset;
    }
}


