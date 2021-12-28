interface ReplicatedStorage extends Instance {
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
			stone_impact: Sound;
			hum: Sound;
		};
		tiles: Folder & {
			wooden: Model & {
				tile: Part & {
					Decal: Decal;
				};
			};
			o_button: Model & {
				button: MeshPart;
				tile: Part & {
					Decal: Decal;
					WeldConstraint: WeldConstraint;
				};
			};
			tile: Model & {
				tile: Part & {
					Decal: Decal;
				};
			};
			toggle: Model & {
				tile: Part & {
					Decal: Decal;
				};
			};
			x_button: Model & {
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
			endtile: Model & {
				endtile: MeshPart;
			};
		};
	};
	TS: Folder & {
		module: Folder & {
			Signal: ModuleScript;
		};
		config: Folder & {
			["game-config"]: ModuleScript;
			["credits-config"]: ModuleScript;
			["network-events"]: ModuleScript;
		};
		rodux: Folder & {
			reducer: ModuleScript;
			actions: ModuleScript;
			store: ModuleScript;
		};
		player: Folder & {
			stats: ModuleScript;
		};
		level: Folder & {
			["level-registry"]: ModuleScript;
			level: ModuleScript;
			["level-config"]: ModuleScript;
		};
		game: Folder & {
			tiles: Folder & {
				["tile-types"]: ModuleScript;
			};
		};
		utility: Folder & {
			["string-utils"]: ModuleScript;
			debug: ModuleScript;
			["udim-math"]: ModuleScript;
			math: ModuleScript;
			array: ModuleScript;
			["vector3-utils"]: ModuleScript;
			generators: ModuleScript;
		};
	};
	Time: IntValue;
	rbxts_include: Folder & {
		RuntimeLib: ModuleScript;
		Promise: ModuleScript;
		node_modules: Folder & {
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
			["ts-remote"]: Folder & {
				typings: Folder;
				out: ModuleScript & {
					NetworkEvent: ModuleScript;
					NetworkFunction: ModuleScript;
				};
			};
			["delay-spawn-wait"]: ModuleScript;
			maid: Folder & {
				Maid: ModuleScript;
			};
			rodux: Folder & {
				src: ModuleScript & {
					combineReducers: ModuleScript;
					NoYield: ModuleScript;
					createReducer: ModuleScript;
					loggerMiddleware: ModuleScript;
					makeActionCreator: ModuleScript;
					thunkMiddleware: ModuleScript;
					prettyPrint: ModuleScript;
					Store: ModuleScript;
					Signal: ModuleScript;
				};
			};
			profileservice: Folder & {
				src: ModuleScript;
			};
			["roact-rodux"]: Folder & {
				src: ModuleScript & {
					join: ModuleScript;
					StoreProvider: ModuleScript;
					Symbol: ModuleScript;
					shallowEqual: ModuleScript;
					getStore: ModuleScript;
					storeKey: ModuleScript;
					connect: ModuleScript;
				};
			};
			types: Folder & {
				include: Folder & {
					generated: Folder;
				};
			};
			["compiler-types"]: Folder & {
				types: Folder;
			};
			janitor: Folder & {
				src: ModuleScript;
			};
			make: ModuleScript;
			services: ModuleScript;
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
		};
	};
}
