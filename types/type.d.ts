/// <reference path="../node_modules/@rbxts/roact/src/index.d.ts"/>
import type { FunctionComponent } from "@rbxts/roact"

// export declare namespace Roact {
// 	interface FC extends FunctionComponent {}
// }

declare module "Roact" {
	namespace customNamespace {
		export interface AnotherTimeGrid {
			customField1: string
			customField2: boolean
		}
	}

	export namespace Roact {
		export type FC = FunctionComponent
	}
}
