laraImport("lara.benchmark.MachSuiteBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * C-version of the MachSuite benchmarks.
 */
function MachSuiteBenchmarkSet() {
    // Parent constructor
    BenchmarkSet.call(this, "MachSuiteBenchmarkSet");

    this._testBenchmarks = [
        "backprop",
        "fft-strided",
        "fft-transpose",
        "gemm-blocked",
        "gemm-ncubed",
        "md-grid",
        "md-knn",
        "sort-merge",
        "sort-radix",
        "spmv-crs",
        "spmv-ellpack",
        "stencil-2d",
        "viterbi"];
    this._testInputSizes = ["D"];
}
// Inheritance
MachSuiteBenchmarkSet.prototype = Object.create(BenchmarkSet.prototype);

/*
 * Available benchmarks
 */
MachSuiteBenchmarkSet._benchmarkNames = new PredefinedStrings("benchmark name", true, [
    "backprop",
    "fft-strided",
    "fft-transpose",
    "gemm-blocked",
    "gemm-ncubed",
    "md-grid",
    "md-knn",
    "sort-merge",
    "sort-radix",
    "spmv-crs",
    "spmv-ellpack",
    "stencil-2d",
    "viterbi"]);

/*
 * Available sizes
 */
MachSuiteBenchmarkSet._inputSizes = new PredefinedStrings("input size", true, ["D"]);


/**
 * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
 */
MachSuiteBenchmarkSet.getBenchmarkNames = function () {
    return MachSuiteBenchmarkSet._benchmarkNames;
}

/**
 * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
 */
MachSuiteBenchmarkSet.getInputSizes = function () {
    return MachSuiteBenchmarkSet._inputSizes;
}

MachSuiteBenchmarkSet.isSizeSupported = function (benchName, inputSize) {
    // Check if name and inputSize are valid
    MachSuiteBenchmarkSet.getBenchmarkNames().test(benchName);
    MachSuiteBenchmarkSet.getInputSizes().test(inputSize);

    return (inputSize == "D")
}

MachSuiteBenchmarkSet.prototype.setBenchmarks = function () {
    this._testBenchmarks = MachSuiteBenchmarkSet.getBenchmarkNames().parse(arrayFromArgs(arguments));
}

MachSuiteBenchmarkSet.prototype.setInputSizes = function () {
    this._testInputSizes = MachSuiteBenchmarkSet.getInputSizes().parse(arrayFromArgs(arguments));
}


/**
 * Prints the current MachSuite benchmark set.
 */
MachSuiteBenchmarkSet.prototype.print = function () {
    println("BenchmarkSet: " + this.getName());
    println("Benchmark names: " + this._testBenchmarks);
    println("Benchmark sizes: " + this._testInputSizes);

    for (var benchName of this._testBenchmarks) {

        print(benchName + ":");

        for (var inputSize of this._testInputSizes) {

            if (MachSuiteBenchmarkSet.isSizeSupported(benchName, inputSize)) {
                print(" " + inputSize);
            }
        }

        println();
    }
}

/*** IMPLEMENTATIONS ***/

MachSuiteBenchmarkSet.prototype._getInstancesPrivate = function () {

    var instances = [];

    for (var benchName of this._testBenchmarks) {

        for (var inputSize of this._testInputSizes) {

            if (!MachSuiteBenchmarkSet.isSizeSupported(benchName, inputSize)) {
                continue;
            }

            instances.push(new MachSuiteBenchmarkInstance(benchName, inputSize));

        }
    }

    return instances;
}
