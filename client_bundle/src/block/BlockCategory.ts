
export class BlockCategory {

    public static readonly MOTION = new BlockCategory("motion");
    public static readonly OPERATORS = new BlockCategory("operators");
    public static readonly DATA = new BlockCategory("data");
    public static readonly SOUNDS = new BlockCategory("sounds");
    public static readonly CONTROL = new BlockCategory("control");

    public readonly colorPrimary;
    public readonly colorSecondary;
    public readonly colorTertiary;

    constructor(id: string) {
        this.colorPrimary = `var(--scruff-block-${id}-bg-primary)`;
        this.colorSecondary = `var(--scruff-block-${id}-bg-secondary)`;
        this.colorTertiary = `var(--scruff-block-${id}-bg-tertiary)`;
    }
}