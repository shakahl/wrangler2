import { unstable_dev } from "wrangler";

describe("worker", () => {
	let worker: {
		fetch: (init?: RequestInit) => Promise<Response | undefined>;
		stop: () => Promise<void>;
	};

	beforeAll(async () => {
		//since the script is invoked from the directory above, need to specify index.js is in src/
		worker = await unstable_dev(
			"src/basicModule.ts",
			{},
			{ disableExperimentalWarning: true }
		);
	});

	afterAll(async () => {
		await worker.stop();
	});

	it("should invoke the worker and exit", async () => {
		const resp = await worker.fetch();
		expect(resp).not.toBe(undefined);
		if (resp) {
			const text = await resp.text();

			expect(text).toMatchInlineSnapshot(`"Hello World!"`);
		}
	});
});
