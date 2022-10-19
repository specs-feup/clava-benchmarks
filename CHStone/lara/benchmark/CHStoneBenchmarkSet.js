laraImport("lara.benchmark.CHStoneBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * C-version of the CHStone benchmarks.
 */
function CHStoneBenchmarkSet() {
	// Parent constructor
	BenchmarkSet.call(this, "CHStoneBenchmarkSet");

	this._testBenchmarks = ["adpcm", "aes", "blowfish", "dfadd", "dfdiv", "dfmul", "dfsin", "gsm", "jpeg",
		"mips", "motion", "sha"];
	this._testInputSizes = ["N"];
}
// Inheritance
CHStoneBenchmarkSet.prototype = Object.create(BenchmarkSet.prototype);

/*
 * Available benchmarks
 */
CHStoneBenchmarkSet._benchmarkNames = new PredefinedStrings("benchmark name", true, ["adpcm", "aes", "blowfish",
	"dfadd", "dfdiv", "dfmul", "dfsin", "gsm", "jpeg", "mips", "motion", "sha"]);

/*
 * Available sizes
 */
CHStoneBenchmarkSet._inputSizes = new PredefinedStrings("input size", true, ["N"]);


/**
 * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
 */
CHStoneBenchmarkSet.getBenchmarkNames = function () {
	return CHStoneBenchmarkSet._benchmarkNames;
}

/**
 * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
 */
CHStoneBenchmarkSet.getInputSizes = function () {
	return CHStoneBenchmarkSet._inputSizes;
}

CHStoneBenchmarkSet.isSizeSupported = function (benchName, inputSize) {
	// Check if name and inputSize are valid
	CHStoneBenchmarkSet.getBenchmarkNames().test(benchName);
	CHStoneBenchmarkSet.getInputSizes().test(inputSize);

	// CHStone has no sizes, so this is superfluous

	return true;
}

CHStoneBenchmarkSet.prototype.setBenchmarks = function () {
	this._testBenchmarks = CHStoneBenchmarkSet.getBenchmarkNames().parse(arrayFromArgs(arguments));
}

CHStoneBenchmarkSet.prototype.setInputSizes = function () {
	this._testInputSizes = CHStoneBenchmarkSet.getInputSizes().parse(arrayFromArgs(arguments));
}


/**
 * Prints the current CHStone benchmark set.
 */
CHStoneBenchmarkSet.prototype.print = function () {
	println("BenchmarkSet: " + this.getName());
	println("Benchmark names: " + this._testBenchmarks);
	println("Benchmark sizes: " + this._testInputSizes);

	for (var benchName of this._testBenchmarks) {

		print(benchName + ":");

		for (var inputSize of this._testInputSizes) {

			if (CHStoneBenchmarkSet.isSizeSupported(benchName, inputSize)) {
				print(" " + inputSize);
			}
		}

		println();
	}
}

/*** IMPLEMENTATIONS ***/

CHStoneBenchmarkSet.prototype._getInstancesPrivate = function () {

	var instances = [];

	for (var benchName of this._testBenchmarks) {

		for (var inputSize of this._testInputSizes) {

			if (!CHStoneBenchmarkSet.isSizeSupported(benchName, inputSize)) {
				continue;
			}

			instances.push(new CHStoneBenchmarkInstance(benchName, inputSize));

		}
	}

	return instances;
}
