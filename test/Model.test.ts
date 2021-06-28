import { Model } from '../src/model';
import { watch } from "wgxh-framework";

test("Test model.ts", () => {
	const m = new Model({
		state: {
			count: 1,
		},
		actions: {
			increment() {
				this.count++;
			},
			decrement() {
				this.count--;
			},
			to(count = 1) {
				this.count = count;
			}
		},
	});

	const state = m.getState();
	let count = 0;
	watch(() => {
		count = state.count;
	});
	m.dispatch('increment');
	expect(state.count).toBe(2);
	expect(count).toBe(2);

	m.dispatch('to', 10);
	expect(state.count).toBe(10);
	expect(count).toBe(10);
});
