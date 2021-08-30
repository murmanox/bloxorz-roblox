declare class Connection {
	/**
	 * Creates a new Connection
	 * @param signal Signal that this connection originates from
	 * @param handler Function to be called whenever signal is activated
	 */
	constructor(signal: Signal, handler: Callback)

	/**
	 * Signal that this connection originates from
	 */
	private signal: Signal

	/**
	 * Whether the connection is still connected or not
	 */
	private connected: boolean

	/**
	 * Disconnects the connection from its' source signal
	 */
	public disconnect(): void
}

declare class Signal<T extends Callback = Callback> {
	/**
	 * Creates a new Signal
	 */
	constructor()

	/**
	 * Calls all handlers connected to the signal
	 * @param args Arguments to call the handlers with
	 */
	public fire(...args: Parameters<T>): void

	/**
	 * Connects a handler function so that whenever .fire() is called, the function is invoked
	 * @param handler Function to call whenever the signal is fired
	 */
	public connect(handler: (...args: Parameters<T>) => void): Connection

	/**
	 * Pauses the current thread until the signal is fired
	 */
	public wait(): Parameters<T>
}

export = Signal
