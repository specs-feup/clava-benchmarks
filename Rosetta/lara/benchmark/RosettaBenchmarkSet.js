laraImport("lara.benchmark.RosettaBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * C-version of the Rosetta benchmarks.
 */
function RosettaBenchmarkSet() {
	// Parent constructor
	BenchmarkSet.call(this, "RosettaBenchmarkSet");

	this._testBenchmarks = ["3d-rendering", "digit-recognition", "face-detection", "optical-flow", "spam-filter"];
	this._testInputSizes = ["N", "current", "sintel"];
}
// Inheritance
RosettaBenchmarkSet.prototype = Object.create(BenchmarkSet.prototype);

/*
 * Available benchmarks
 */
RosettaBenchmarkSet._benchmarkNames = new PredefinedStrings("benchmark name", true, ["3d-rendering", "digit-recognition",
	"face-detection", "optical-flow", "spam-filter"]);

/*
 * Available sizes
 */
RosettaBenchmarkSet._inputSizes = new PredefinedStrings("input size", true, ["N", "current", "sintel"]);


/**
 * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
 */
RosettaBenchmarkSet.getBenchmarkNames = function () {
	return RosettaBenchmarkSet._benchmarkNames;
}

/**
 * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
 */
RosettaBenchmarkSet.getInputSizes = function () {
	return RosettaBenchmarkSet._inputSizes;
}

RosettaBenchmarkSet.isSizeSupported = function (benchName, inputSize) {
	// Check if name and inputSize are valid
	RosettaBenchmarkSet.getBenchmarkNames().test(benchName);
	RosettaBenchmarkSet.getInputSizes().test(inputSize);

	if (benchName == "optical-flow") {
		return (inputSize == "current" || inputSize == "sintel");
	}
	else {
		return (inputSize == "N")
	}
}

RosettaBenchmarkSet.prototype.setBenchmarks = function () {
	this._testBenchmarks = RosettaBenchmarkSet.getBenchmarkNames().parse(arrayFromArgs(arguments));
}

RosettaBenchmarkSet.prototype.setInputSizes = function () {
	this._testInputSizes = RosettaBenchmarkSet.getInputSizes().parse(arrayFromArgs(arguments));
}


/**
 * Prints the current Rosetta benchmark set.
 */
RosettaBenchmarkSet.prototype.print = function () {
	println("BenchmarkSet: " + this.getName());
	println("Benchmark names: " + this._testBenchmarks);
	println("Benchmark sizes: " + this._testInputSizes);

	for (var benchName of this._testBenchmarks) {

		print(benchName + ":");

		for (var inputSize of this._testInputSizes) {

			if (RosettaBenchmarkSet.isSizeSupported(benchName, inputSize)) {
				print(" " + inputSize);
			}
		}

		println();
	}
}

/*** IMPLEMENTATIONS ***/

RosettaBenchmarkSet.prototype._getInstancesPrivate = function () {

	var instances = [];

	for (var benchName of this._testBenchmarks) {

		for (var inputSize of this._testInputSizes) {

			if (!RosettaBenchmarkSet.isSizeSupported(benchName, inputSize)) {
				continue;
			}

			instances.push(new RosettaBenchmarkInstance(benchName, inputSize));

		}
	}

	return instances;
}
