import './scratch';
import './css';
import { BlockScriptRoot, BlockSubscriptInput } from './src/block/BlockScript';
import { ScratchBlocks } from './src/scratch_blocks/ScratchBlocks';
import Target from './src/Target';
import App from './svelte/App.svelte';

export function load(callback: () => void) {
	callback();
}

export function main() {
	const target = new Target();

	const script = new BlockScriptRoot([
		ScratchBlocks.EVENT_GREEN_FLAG.createInstance(),

		ScratchBlocks.CONTROL_IF.createInstance({

			idk: ScratchBlocks.OPERATOR_EQUALS.createInstance({
				test: ScratchBlocks.OPERATOR_PLUS.createInstance()
			}),
			testI: new BlockSubscriptInput([
				ScratchBlocks.MOTION_MOVE_STEPS.createInstance(),

				ScratchBlocks.CONTROL_FOREVER.createInstance()
			])
		}),

		ScratchBlocks.MOTION_MOVE_STEPS.createInstance({
			test: ScratchBlocks.OPERATOR_PLUS.createInstance({
				test: ScratchBlocks.OPERATOR_PLUS.createInstance({
					test: ScratchBlocks.OPERATOR_PLUS.createInstance({
						test: ScratchBlocks.OPERATOR_PLUS.createInstance({
							testII: ScratchBlocks.OPERATOR_EQUALS.createInstance(),
						}),
					}),
				}),
				testII: ScratchBlocks.OPERATOR_PLUS.createInstance(),
			}),
		}),
		ScratchBlocks.MOTION_MOVE_STEPS.createInstance(),
		ScratchBlocks.MOTION_MOVE_STEPS.createInstance(),
		ScratchBlocks.MOTION_MOVE_STEPS.createInstance({
			test: ScratchBlocks.OPERATOR_PLUS.createInstance({}),
		}),
		ScratchBlocks.MOTION_MOVE_STEPS.createInstance(),
		ScratchBlocks.MOTION_MOVE_STEPS.createInstance({
			test: ScratchBlocks.OPERATOR_PLUS.createInstance({}),
		}),
	]);

	script.translation = { x: 100, y: 100 };
	target.blockScripts.scripts.push(script);
	target.blockScripts.transformScale = 1.5;
	target.blockScripts.transformPosition = { x: 0, y: 150 };

	new App({
		target: document.body,
		props: {
			scripts: target.blockScripts
		}
	});
};
