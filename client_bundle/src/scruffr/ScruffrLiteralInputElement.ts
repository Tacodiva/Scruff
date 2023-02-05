import type { BlockInputType } from "../block/BlockInputType";
import type { IBlockInput } from "../block/IBlockInput";
import { BlockInputString } from "../block/BlockInputString";
import { ScruffrBackground } from "./background/ScruffrBackground";
import { BackgroundShapes } from "./background/BackgroundShapes";
import type { IScruffrBlockInput } from "./IScruffrBlockInput";
import { ScruffrBackgroundedBlockPartElement } from "./ScruffrBackgroundedBlockPartElement";
import type { ScruffrBlockContentElement } from "./ScruffrBlockContentElement";
import type { ScruffrBlockRef } from "./ScruffrBlockRef";
import { ScruffrTextElement } from "./ScruffrTextElement";

export class ScruffrLiteralInputElement extends ScruffrBackgroundedBlockPartElement<ScruffrTextElement> implements IScruffrBlockInput {
    private _parent: ScruffrBlockContentElement;
    public override get parent(): ScruffrBlockContentElement { return this._parent; }
    public readonly input: BlockInputType;
    private _value: string;

    public constructor(parent: ScruffrBlockContentElement, input: BlockInputType, value: string) {
        super(parent.root, parent, new ScruffrBackground(
            BackgroundShapes.InputRound,
            null,
            "scruff-input"
        ));
        this._parent = parent;
        this.input = input;
        this._value = value;
        this.content.text = this._value;
    }

    protected createContent(): ScruffrTextElement {
        return new ScruffrTextElement(this, "");
    }

    public setValue(value: string) {
        this.parent.parent.block.setInput(this.input, new BlockInputString(value));
        this._value = value;
        this.content.text = value;
        this.content.update(false);
        this.update(true);
    }

    public override onClick(event: MouseEvent): boolean {
        event.preventDefault();
        this.workspace.editLiteralInput(this);
        return true;
    }

    public asInput(): IBlockInput {
        return new BlockInputString(this._value);
    }

    public setParent(parentRef: ScruffrBlockRef<BlockInputType<IBlockInput>, ScruffrBlockContentElement>): void {
        this._parent = parentRef.parent;
        this.onAncestryChange(this._parent.root);
    }
}
