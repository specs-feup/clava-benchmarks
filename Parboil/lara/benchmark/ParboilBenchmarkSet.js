laraImport("lara.benchmark.ParboilBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * C-version of the Parboil benchmarks.
 */
function ParboilBenchmarkSet() {
	// Parent constructor
	BenchmarkSet.call(this, "ParboilBenchmarkSet");

	this._testBenchmarks = ["bfs", "cutcp", "histo", "lbm", "mri-gridding", "mri-q", "sad", "sgemm", "spmv", "stencil", "tpacf"];
	this._testInputSizes = ["N"];
}
// Inheritance
ParboilBenchmarkSet.prototype = Object.create(BenchmarkSet.prototype);

/*
 * Available benchmarks
 */
ParboilBenchmarkSet._benchmarkNames = new PredefinedStrings("benchmark name", true, ["bfs", "cutcp", "histo", "lbm", "mri-gridding", 
							"mri-q", "sad", "sgemm", "spmv", "stencil", "tpacf"]);

/*
 * Available sizes
 */
ParboilBenchmarkSet._inputSizes = new PredefinedStrings("input size", true, ["N"]);


/**
 * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
 */
ParboilBenchmarkSet.getBenchmarkNames = function () {
	return ParboilBenchmarkSet._benchmarkNames;
}

/**
 * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
 */
ParboilBenchmarkSet.getInputSizes = function () {
	return ParboilBenchmarkSet._inputSizes;
}

ParboilBenchmarkSet.isSizeSupported = function (benchName, inputSize) {
	// Check if name and inputSize are valid
	ParboilBenchmarkSet.getBenchmarkNames().test(benchName);
	ParboilBenchmarkSet.getInputSizes().test(inputSize);

	// Parboil has no sizes, so this is superfluous

	return true;
}

ParboilBenchmarkSet.prototype.setBenchmarks = function () {
	this._testBenchmarks = ParboilBenchmarkSet.getBenchmarkNames().parse(arrayFromArgs(arguments));
}

ParboilBenchmarkSet.prototype.setInputSizes = function () {
	this._testInputSizes = ParboilBenchmarkSet.getInputSizes().parse(arrayFromArgs(arguments));
}


/**
 * Prints the current Parboil benchmark set.
 */
ParboilBenchmarkSet.prototype.print = function () {
	println("BenchmarkSet: " + this.getName());
	println("Benchmark names: " + this._testBenchmarks);
	println("Benchmark sizes: " + this._testInputSizes);

	for (var benchName of this._testBenchmarks) {

		print(benchName + ":");

		for (var inputSize of this._testInputSizes) {

			if (ParboilBenchmarkSet.isSizeSupported(benchName, inputSize)) {
				print(" " + inputSize);
			}
		}

		println();
	}
}

/*** IMPLEMENTATIONS ***/

ParboilBenchmarkSet.prototype._getInstancesPrivate = function () {

	var instances = [];

	for (var benchName of this._testBenchmarks) {

		for (var inputSize of this._testInputSizes) {

			if (!ParboilBenchmarkSet.isSizeSupported(benchName, inputSize)) {
				continue;
			}

			instances.push(new ParboilBenchmarkInstance(benchName, inputSize));

		}
	}

	return instances;
}
