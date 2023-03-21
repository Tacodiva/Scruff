import type { SvelteComponent } from "svelte";
import { ScuffEditorPane, type ScuffEditorPaneFactory, type ScuffEditorPaneInfo } from "./ScuffEditorPane";

type SvelteComponentInfo<T extends SvelteComponent> = readonly [
    Component: new (_: { target: Element, props?: any }) => T,
    props?: any
];

export class ScuffEditorSveltePane<T extends SvelteComponent> extends ScuffEditorPane {
    public static create(info: SvelteComponentInfo<SvelteComponent>): ScuffEditorPaneFactory {
        return pane => new ScuffEditorSveltePane(pane, info);
    }
    
    public readonly component: T;

    private constructor(pane: ScuffEditorPaneInfo, [Component, props] : SvelteComponentInfo<T>) {
        super(pane);
        this.component = new Component({ target: this.target, props });
    }
}