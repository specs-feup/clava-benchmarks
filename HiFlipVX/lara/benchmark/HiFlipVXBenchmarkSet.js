laraImport("lara.benchmark.HiFlipVXBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * C++ version of the HiFlipVX benchmarks.
 */
function HiFlipVXBenchmarkSet() {
	// Parent constructor
	BenchmarkSet.call(this, "HiFlipVXBenchmarkSet");

	this._testBenchmarks = ["v2"];
	this._testInputSizes = ["N"];
}
// Inheritance
HiFlipVXBenchmarkSet.prototype = Object.create(BenchmarkSet.prototype);

/*
 * Available benchmarks
 */
HiFlipVXBenchmarkSet._benchmarkNames = new PredefinedStrings("benchmark name", true, ["v2"]);

/*
 * Available sizes
 */
HiFlipVXBenchmarkSet._inputSizes = new PredefinedStrings("input size", true, ["N"]);


/**
 * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
 */
HiFlipVXBenchmarkSet.getBenchmarkNames = function () {
	return HiFlipVXBenchmarkSet._benchmarkNames;
}

/**
 * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
 */
HiFlipVXBenchmarkSet.getInputSizes = function () {
	return HiFlipVXBenchmarkSet._inputSizes;
}

HiFlipVXBenchmarkSet.isSizeSupported = function (benchName, inputSize) {
	// Check if name and inputSize are valid
	HiFlipVXBenchmarkSet.getBenchmarkNames().test(benchName);
	HiFlipVXBenchmarkSet.getInputSizes().test(inputSize);

	// HiFlipVX has no sizes, so this is superfluous

	return true;
}

HiFlipVXBenchmarkSet.prototype.setBenchmarks = function () {
	this._testBenchmarks = HiFlipVXBenchmarkSet.getBenchmarkNames().parse(arrayFromArgs(arguments));
}

HiFlipVXBenchmarkSet.prototype.setInputSizes = function () {
	this._testInputSizes = HiFlipVXBenchmarkSet.getInputSizes().parse(arrayFromArgs(arguments));
}


/**
 * Prints the current HiFlipVX benchmark set.
 */
HiFlipVXBenchmarkSet.prototype.print = function () {
	println("BenchmarkSet: " + this.getName());
	println("Benchmark names: " + this._testBenchmarks);
	println("Benchmark sizes: " + this._testInputSizes);

	for (var benchName of this._testBenchmarks) {

		print(benchName + ":");

		for (var inputSize of this._testInputSizes) {

			if (HiFlipVXBenchmarkSet.isSizeSupported(benchName, inputSize)) {
				print(" " + inputSize);
			}
		}

		println();
	}
}

/*** IMPLEMENTATIONS ***/

HiFlipVXBenchmarkSet.prototype._getInstancesPrivate = function () {

	var instances = [];

	for (var benchName of this._testBenchmarks) {

		for (var inputSize of this._testInputSizes) {

			if (!HiFlipVXBenchmarkSet.isSizeSupported(benchName, inputSize)) {
				continue;
			}

			instances.push(new HiFlipVXBenchmarkInstance(benchName, inputSize));

		}
	}

	return instances;
}
