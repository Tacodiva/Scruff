import { ScuffrElement, ScuffrParentElement } from "./ScuffrElement";
import type { IScuffrBlockPartElement } from "./ScuffrBlockInstanceElement";
import type { Vec2 } from "../utils/Vec2";
import type { BlockInstance } from "../block/BlockInstance";
import { ScuffrAttachmentPointList } from "./ScuffrAttachmentPoint";
import type { ScuffrRootScriptElement } from "./ScuffrRootScriptElement";

class ScuffrBackground {
    public readonly shape: ScuffrBackgroundShape;
    public readonly fill: string;
    public readonly stroke: string;

    public constructor(shape: ScuffrBackgroundShape, fill: string, stroke: string) {
        this.shape = shape;
        this.fill = fill;
        this.stroke = stroke;
    }
}

abstract class ScuffrBackgroundElement<TContent extends ScuffrElement = ScuffrElement> extends ScuffrParentElement implements IScuffrBlockPartElement {
    public abstract override parent: ScuffrParentElement;
    public override children: readonly [TContent];
    public readonly background: ScuffrBackground;
    public readonly backgroundDOM: SVGElement;

    public get content() { return this.children[0]; }

    public constructor(parent: ScuffrParentElement, background: ScuffrBackground) {
        super(parent.dom.appendChild(document.createElementNS(SVG_NS, "g")), parent.workspace);
        this.backgroundDOM = this.dom.appendChild(background.shape.createElement())
        this.background = background;
        this.children = [this.createContent()];
    }

    protected abstract createContent(): TContent;

    public override update(propagateUp: boolean) {
        const size = {
            x: this.content.dimensions.x,
            y: this.content.dimensions.y
        }

        const ajustX = size.x < this.background.shape.minSize.x;
        if (ajustX) size.x = this.background.shape.minSize.x;
        if (size.y < this.background.shape.minSize.y) size.y = this.background.shape.minSize.y;

        this.background.shape.updateElement(this.backgroundDOM, size, this.background);
        const padding = this.background.shape.getPadding(size);

        if (ajustX) {
            this.content.translationParent.x = (this.background.shape.minSize.x - this.content.dimensions.x) / 2;
        } else {
            this.content.translationParent.x = 0;
        }
        this.content.updateTraslation();

        this.translationSelf.x = padding.x;
        this.updateTraslation();

        this.dimensions = {
            x: size.x + padding.x * 2,
            y: size.y + padding.y * 2
        }

        this.topLeftOffset = this.background.shape.getTopLeftOffset(size);
        super.update(propagateUp);
    }
}

abstract class ScuffrBackgroundShape {

    public static readonly ROUND_BLOCK = new class extends ScuffrBackgroundShape {
        public override createPath(size: Vec2): string {
            let radius = size.y / 2;
            return `m ${size.x - 8} ${-radius} a ${radius} ${radius} 0 0 1 0 ${size.y} H 6 a ${radius} ${radius} 0 0 1 0 ${-size.y} z`;
        }

        public getPadding(contentSize: Vec2): Vec2 {
            return { x: contentSize.y / 2 - 6, y: 4 };
        }

        public getTopLeftOffset(contentSize: Vec2): Vec2 {
            return { x: contentSize.y / 2 - 6, y: contentSize.y / 2 };
        }
    }({ x: 20, y: 32 }, 4);

    public static readonly STACK_BODY = new class extends ScuffrBackgroundShape {
        public override createPath(size: Vec2): string {
            return `m -8 ${-size.y / 2 + 4} a 4 4 0 0 1 4 -4 h 8 c 2 0 3 1 4 2 l 4 4 c 1 1 2 2 4 2 h 12 c 2 0 3 -1 4 -2 l 4 -4 c 1 -1 2 -2 4 -2 H ${size.x + 4} a 4 4 0 0 1 4 4 v ${size.y - 8} a 4 4 0 0 1 -4 4 H 40 c -2 0 -3 1 -4 2 l -4 4 c -1 1 -2 2 -4 2 h -12 c -2 0 -3 -1 -4 -2 l -4 -4 c -1 -1 -2 -2 -4 -2 H -4 a 4 4 0 0 1 -4 -4 z`;
        }

        public override prePartPadding(block: BlockInstance, partIdx: number, x: number, part: IScuffrBlockPartElement): number {
            x = super.prePartPadding(block, partIdx, x, part);
            if (x < 40 && (part.getBackground && part.getBackground()))
                x = 40;
            return x;
        }

        public getPadding(contentSize: Vec2): Vec2 {
            return { x: 8, y: 0 };
        }

        public getTopLeftOffset(contentSize: Vec2): Vec2 {
            return { x: 8, y: contentSize.y / 2 };
        }
    }({ x: 60, y: 48 });

    public readonly minSize: Vec2;

    public readonly snugglePadding: number;

    public constructor(minSize: Vec2, snugglePadding: number = 0) {
        this.minSize = minSize;
        this.snugglePadding = snugglePadding;
    }

    public abstract getTopLeftOffset(contentSize: Vec2): Vec2;
    public abstract getPadding(contentSize: Vec2): Vec2;

    public prePartPadding(block: BlockInstance, partIdx: number, x: number, part: IScuffrBlockPartElement): number {
        if (partIdx === 0) {
            if (part.getBackground && part.getBackground()?.shape === this) {
                x += this.snugglePadding - this.getPadding(part.dimensions).x;
            }
        }
        return x;
    }

    public postPartPadding(block: BlockInstance, partIdx: number, x: number, part: IScuffrBlockPartElement): number {
        if (partIdx === block.type.parts.length - 1) {
            if (part.getBackground && part.getBackground()?.shape === this)
                x += this.snugglePadding - this.getPadding(part.dimensions).x;
        } else x += 8;
        return x + part.dimensions.x;
    }

    public createElement(): SVGElement {
        return document.createElementNS(SVG_NS, "path");
    }

    public updateElement(element: SVGElement, size: Vec2, background: ScuffrBackground) {
        element.style.fill = background.fill;
        element.style.stroke = background.stroke;
        element.setAttribute("d", this.createPath(size));
    }

    public abstract createPath(size: Vec2): string;
}

export { ScuffrBackground, ScuffrBackgroundElement, ScuffrBackgroundShape }