laraImport("lara.benchmark.AxBenchBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * AxBench C/C++ benchmark set
 */
function AxBenchBenchmarkSet() {
    // Parent constructor
    BenchmarkSet.call(this, "AxBenchBenchmarkSet");

    this._testBenchmarks = [
        "blackscholes",
        "fft",
        "inversek2j",
        "jmeint",
        "jpeg",
        "kmeans",
        "sobel"
    ];
    this._testInputSizes = ["N"];
}
// Inheritance
AxBenchBenchmarkSet.prototype = Object.create(BenchmarkSet.prototype);

/*
 * Available benchmarks
 */
AxBenchBenchmarkSet._benchmarkNames = new PredefinedStrings("benchmark name", true, [
    "blackscholes",
    "fft",
    "inversek2j",
    "jmeint",
    "jpeg",
    "kmeans",
    "sobel"
]);

/*
 * Available sizes
 */
AxBenchBenchmarkSet._inputSizes = new PredefinedStrings("input size", true, ["N"]);

AxBenchBenchmarkSet.prototype._standards = {
    "blackscholes": "c++17",
    "fft": "c++17",
    "inversek2j": "c++17",
    "jmeint": "c++17",
    "jpeg": "c11",
    "kmeans": "c++17",
    "sobel": "c++17"
};


/**
 * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
 */
AxBenchBenchmarkSet.getBenchmarkNames = function () {
    return AxBenchBenchmarkSet._benchmarkNames;
}

/**
 * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
 */
AxBenchBenchmarkSet.getInputSizes = function () {
    return AxBenchBenchmarkSet._inputSizes;
}

AxBenchBenchmarkSet.isSizeSupported = function (benchName, inputSize) {
    // Check if name and inputSize are valid
    AxBenchBenchmarkSet.getBenchmarkNames().test(benchName);
    AxBenchBenchmarkSet.getInputSizes().test(inputSize);

    return (inputSize == "N");
}

AxBenchBenchmarkSet.prototype.setBenchmarks = function () {
    this._testBenchmarks = AxBenchBenchmarkSet.getBenchmarkNames().parse(arrayFromArgs(arguments));
}

AxBenchBenchmarkSet.prototype.setInputSizes = function () {
    this._testInputSizes = AxBenchBenchmarkSet.getInputSizes().parse(arrayFromArgs(arguments));
}


/**
 * Prints the current AxBench benchmark set.
 */
AxBenchBenchmarkSet.prototype.print = function () {
    println("BenchmarkSet: " + this.getName());
    println("Benchmark names: " + this._testBenchmarks);
    println("Benchmark sizes: " + this._testInputSizes);

    for (var benchName of this._testBenchmarks) {

        print(benchName + ":");

        for (var inputSize of this._testInputSizes) {

            if (AxBenchBenchmarkSet.isSizeSupported(benchName, inputSize)) {
                print(" " + inputSize);
            }
        }

        println();
    }
}

/*** IMPLEMENTATIONS ***/

AxBenchBenchmarkSet.prototype._getInstancesPrivate = function () {

    var instances = [];

    for (var benchName of this._testBenchmarks) {

        for (var inputSize of this._testInputSizes) {

            if (!AxBenchBenchmarkSet.isSizeSupported(benchName, inputSize)) {
                continue;
            }

            instances.push(new AxBenchBenchmarkInstance(benchName, inputSize, this._standards[benchName]));

        }
    }

    return instances;
}
