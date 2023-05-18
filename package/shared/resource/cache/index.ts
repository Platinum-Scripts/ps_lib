export const cache: Record<string, any> = new Proxy(
	{
		resource: GetCurrentResourceName(),
	},
	{
		get(target, key: string) {
			const result = key ? target[key] : target;
			if (result !== undefined) return result;

			AddEventHandler(`ps_lib:cache:${key}`, (value: any) => {
				target[key] = value;
			});

			target[key] = exports.ps_lib.cache(key) || false;
			return target[key];
		},
	}
);

export const onCache = <T = any>(key: string, cb: (value: T) => void) => {
	AddEventHandler(`ps_lib:cache:${key}`, cb);
};
