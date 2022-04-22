laraImport("lara.benchmark.LsuBenchmarkResources");


class LsuData {
	
	static #sizes;
	static #copy;
	
	static getSizes() {
		// Initialize if undefined
		if(LsuData.#sizes === undefined) {
			LsuData.#sizes = LsuBenchmarkResources.getJson("config.json")["sizes"];
		}
		
		return LsuData.#sizes;
	}

	static copyData(benchmarkName) {
		// Initialize if undefined
		if(LsuData.#copy === undefined) {
			LsuData.#copy = LsuBenchmarkResources.getJson("config.json")["copy"];
		}
		
		return LsuData.#copy.includes(benchmarkName);
	}	
}