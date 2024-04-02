laraImport("lara.benchmark.CortexSuiteBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * CortexSuite C/C++ benchmark set
 */
function CortexSuiteBenchmarkSet() {
    // Parent constructor
    BenchmarkSet.call(this, "CortexSuiteBenchmarkSet");

    this._testBenchmarks = [
        "vision-disparity",
        "vision-localization",
        "vision-mser",
        "vision-multi-ncut",
        "vision-pca",
        "vision-sift",
        "vision-stitch",
        "vision-svm",
        "vision-texture-synthesis",
        "vision-tracking",
    ];
    this._testInputSizes = ["N"];
}
// Inheritance
CortexSuiteBenchmarkSet.prototype = Object.create(BenchmarkSet.prototype);

/*
 * Available benchmarks
 */
CortexSuiteBenchmarkSet._benchmarkNames = new PredefinedStrings("benchmark name", true, [
    "vision-disparity",
    "vision-localization",
    "vision-mser",
    "vision-multi-ncut",
    "vision-pca",
    "vision-sift",
    "vision-stitch",
    "vision-svm",
    "vision-texture-synthesis",
    "vision-tracking",
]);

/*
 * Available sizes
 */
CortexSuiteBenchmarkSet._inputSizes = new PredefinedStrings("input size", true, ["N"]);

CortexSuiteBenchmarkSet.prototype._standards = {
    "vision-disparity": "c11",
    "vision-localization": "c11",
    "vision-mser": "c11",
    "vision-multi-ncut": "c11",
    "vision-pca": "c11",
    "vision-sift": "c11",
    "vision-stitch": "c11",
    "vision-svm": "c11",
    "vision-texture-synthesis": "c11",
    "vision-tracking": "c11"
};


/**
 * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
 */
CortexSuiteBenchmarkSet.getBenchmarkNames = function () {
    return CortexSuiteBenchmarkSet._benchmarkNames;
}

/**
 * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
 */
CortexSuiteBenchmarkSet.getInputSizes = function () {
    return CortexSuiteBenchmarkSet._inputSizes;
}

CortexSuiteBenchmarkSet.isSizeSupported = function (benchName, inputSize) {
    // Check if name and inputSize are valid
    CortexSuiteBenchmarkSet.getBenchmarkNames().test(benchName);
    CortexSuiteBenchmarkSet.getInputSizes().test(inputSize);

    return (inputSize == "N");
}

CortexSuiteBenchmarkSet.prototype.setBenchmarks = function () {
    this._testBenchmarks = CortexSuiteBenchmarkSet.getBenchmarkNames().parse(arrayFromArgs(arguments));
}

CortexSuiteBenchmarkSet.prototype.setInputSizes = function () {
    this._testInputSizes = CortexSuiteBenchmarkSet.getInputSizes().parse(arrayFromArgs(arguments));
}


/**
 * Prints the current CortexSuite benchmark set.
 */
CortexSuiteBenchmarkSet.prototype.print = function () {
    println("BenchmarkSet: " + this.getName());
    println("Benchmark names: " + this._testBenchmarks);
    println("Benchmark sizes: " + this._testInputSizes);

    for (var benchName of this._testBenchmarks) {

        print(benchName + ":");

        for (var inputSize of this._testInputSizes) {

            if (CortexSuiteBenchmarkSet.isSizeSupported(benchName, inputSize)) {
                print(" " + inputSize);
            }
        }

        println();
    }
}

/*** IMPLEMENTATIONS ***/

CortexSuiteBenchmarkSet.prototype._getInstancesPrivate = function () {

    var instances = [];

    for (var benchName of this._testBenchmarks) {

        for (var inputSize of this._testInputSizes) {

            if (!CortexSuiteBenchmarkSet.isSizeSupported(benchName, inputSize)) {
                continue;
            }

            instances.push(new CortexSuiteBenchmarkInstance(benchName, inputSize, this._standards[benchName]));

        }
    }

    return instances;
}
