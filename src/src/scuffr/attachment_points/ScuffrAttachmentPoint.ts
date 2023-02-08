import type { ScuffrElement } from "../ScuffrElement";
import type { Vec2 } from "../../utils/Vec2";
import type { ScuffrRootScriptElement } from "../ScuffrRootScriptElement";
import type { ScuffrAttachmentPointList } from "./ScuffrAttachmentPointList";

export abstract class ScuffrAttachmentPoint {
    public abstract readonly parent: ScuffrElement;
    public readonly offset: Vec2;

    private _translation: Vec2 | null;

    public constructor(offset: Vec2 = { x: 0, y: 0 }) {
        this.offset = offset;
        this._translation = null;
    }

    public calculateDelta(source: ScuffrRootScriptElement): Vec2 {
        return this._calculateRawDelta(source);
    }
    
    protected _calculateRawDelta(source: ScuffrRootScriptElement): Vec2 {
        return {
            x: this.translation.x + this.root.translationX - source.translationX,
            y: this.translation.y + this.root.translationY - source.translationY
        };
    }


    public get translation(): Vec2 {
        if (this._translation !== null) return this._translation;
        return this.recalculateTranslation();
    }

    public recalculateTranslation() {
        const absTrans = this.parent.getAbsoluteTranslation();
        return this._translation = {
            x: absTrans.x - this.root.translationX + this.offset.x,
            y: absTrans.y - this.root.translationY + this.offset.y
        };
    }

    public abstract get root(): ScuffrRootScriptElement;

    public abstract canTakeScript(script: ScuffrRootScriptElement): boolean;
    public abstract takeScript(script: ScuffrRootScriptElement): void;

    public abstract highlight(script: ScuffrRootScriptElement) : void;
    public abstract unhighlight(script: ScuffrRootScriptElement) : void;
}

export interface IScuffrPointAttachable extends ScuffrElement {
    attachmentPoints: ScuffrAttachmentPointList;
}

