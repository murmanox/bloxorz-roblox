interface ReplicatedStorage extends Instance {
	TS: Folder & {
		level: Folder & {
			["level-registry"]: ModuleScript;
			level: ModuleScript;
			["level-config"]: ModuleScript;
		};
		config: Folder & {
			["game-config"]: ModuleScript;
		};
		utility: Folder & {
			generators: ModuleScript;
			array: ModuleScript;
			["vector3-utils"]: ModuleScript;
			math: ModuleScript;
		};
	};
	assets: Folder & {
		mesh: Folder & {
			star: MeshPart;
			endtile: MeshPart;
			arrow: MeshPart;
		};
		audio: Folder & {
			["interface"]: Folder & {
				button_mouse_over: Sound;
			};
			stone_sliding: Sound;
			om: Sound;
			stone_impact: Sound & {
				PitchShiftSoundEffect: PitchShiftSoundEffect;
			};
			hum: Sound;
		};
		tiles: Folder & {
			Part: Part & {
				Decal: Decal;
			};
			x_button: Model & {
				button: MeshPart;
				tile: Part & {
					Decal: Decal;
					WeldConstraint: WeldConstraint;
				};
			};
			o_button: Model & {
				button: MeshPart;
				tile: Part & {
					Decal: Decal;
					WeldConstraint: WeldConstraint;
				};
			};
			teleporter: Model & {
				button: MeshPart;
				tile: Part & {
					Decal: Decal;
					WeldConstraint: WeldConstraint;
				};
			};
		};
	};
	rbxts_include: Folder & {
		RuntimeLib: ModuleScript;
		Promise: ModuleScript;
		node_modules: Folder & {
			flipper: Folder & {
				typings: Folder;
				src: ModuleScript & {
					isMotor: ModuleScript;
					Spring: ModuleScript;
					GroupMotor: ModuleScript;
					Signal: ModuleScript;
					SingleMotor: ModuleScript;
					Instant: ModuleScript;
					Linear: ModuleScript;
					BaseMotor: ModuleScript;
				};
			};
			roact: Folder & {
				src: ModuleScript & {
					createSpy: ModuleScript;
					createElement: ModuleScript;
					oneChild: ModuleScript;
					RobloxRenderer: ModuleScript;
					createSignal: ModuleScript;
					assertDeepEqual: ModuleScript;
					getDefaultInstanceProperty: ModuleScript;
					invalidSetStateMessages: ModuleScript;
					Binding: ModuleScript;
					internalAssert: ModuleScript;
					NoopRenderer: ModuleScript;
					createReconciler: ModuleScript;
					GlobalConfig: ModuleScript;
					strict: ModuleScript;
					createReconcilerCompat: ModuleScript;
					assign: ModuleScript;
					createRef: ModuleScript;
					Type: ModuleScript;
					Portal: ModuleScript;
					Symbol: ModuleScript;
					PropMarkers: Folder & {
						Ref: ModuleScript;
						Change: ModuleScript;
						Children: ModuleScript;
						Event: ModuleScript;
					};
					createContext: ModuleScript;
					createFragment: ModuleScript;
					ElementUtils: ModuleScript;
					ComponentLifecyclePhase: ModuleScript;
					Config: ModuleScript;
					ElementKind: ModuleScript;
					PureComponent: ModuleScript;
					Logging: ModuleScript;
					Component: ModuleScript;
					SingleEventManager: ModuleScript;
					None: ModuleScript;
				};
			};
			maid: Folder & {
				Maid: ModuleScript;
			};
			services: ModuleScript;
			janitor: Folder & {
				src: ModuleScript & {
					Scheduler: ModuleScript;
				};
			};
			make: ModuleScript;
			["compiler-types"]: Folder & {
				types: Folder;
			};
			types: Folder & {
				include: Folder & {
					generated: Folder;
				};
			};
		};
	};
}
