import { use, readonly } from "@wgxh-framework/core";

export interface Action<S extends object> {
	(this: S, ...args: any[]): void;
}
export interface Actions<S extends object> {
	[type: string]: Action<S>;
}
export interface ModelOptions<S extends object, A extends Actions<any>> {
	state: S;
	actions?: A;
}

/**
 * Data manager.
 */
export class Model<S extends object, A extends Actions<S>> {
	protected state: S;
	protected actions: A;
	
	constructor(options: ModelOptions<S, A>) {
		this.state = use(options.state);
		this.actions = !!options.actions ? options.actions : {} as A;
	}

	action(type: string, a: (...args: any[]) => void) {
		this.action[type] = a;

		return this;
	}
	dispatch<T extends keyof A>(type: T, ...args: Parameters<A[T]>) {
		if (!(type in this.actions)) {
			return false;
		}
		this.actions[type].call(this.state, ...args);

		return this;
	}
	getState() {
		return readonly(this.state);
	}
	select<T>(selector: (state: S) => T) {
		return selector(this.state);
	}
}
