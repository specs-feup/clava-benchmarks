laraImport("lara.benchmark.RodiniaBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * Rodinia C/C++ benchmark set
 */
function RodiniaBenchmarkSet() {
    // Parent constructor
    BenchmarkSet.call(this, "RodiniaBenchmarkSet");

    this._testBenchmarks = [
        "backprop",
        "bfs",
        "b+tree",
        "cfd-euler3d",
        "cfd-euler3d-double",
        "cfd-pre-euler3d",
        "cfd-pre-euler3d-double",
        "heartwall",
        "hotspot",
        "hotspot3D",
        "kmeans",
        "lavaMD",
        "leukocyte",
        "lud",
        "myocyte",
        "nn",
        "nw",
        "particlefilter",
        "pathfinder",
        "srad-v1",
        "srad-v2",
        "streamcluster"
    ];
    this._testInputSizes = ["N"];
}
// Inheritance
RodiniaBenchmarkSet.prototype = Object.create(BenchmarkSet.prototype);

/*
 * Available benchmarks
 */
RodiniaBenchmarkSet._benchmarkNames = new PredefinedStrings("benchmark name", true, [
    "backprop",
    "bfs",
    "b+tree",
    "cfd-euler3d",
    "cfd-euler3d-double",
    "cfd-pre-euler3d",
    "cfd-pre-euler3d-double",
    "heartwall",
    "hotspot",
    "hotspot3D",
    "kmeans",
    "lavaMD",
    "leukocyte",
    "lud",
    "myocyte",
    "nn",
    "nw",
    "particlefilter",
    "pathfinder",
    "srad-v1",
    "srad-v2",
    "streamcluster"
]);

/*
 * Available sizes
 */
RodiniaBenchmarkSet._inputSizes = new PredefinedStrings("input size", true, ["N"]);


/**
 * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
 */
RodiniaBenchmarkSet.getBenchmarkNames = function () {
    return RodiniaBenchmarkSet._benchmarkNames;
}

/**
 * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
 */
RodiniaBenchmarkSet.getInputSizes = function () {
    return RodiniaBenchmarkSet._inputSizes;
}

RodiniaBenchmarkSet.isSizeSupported = function (benchName, inputSize) {
    // Check if name and inputSize are valid
    RodiniaBenchmarkSet.getBenchmarkNames().test(benchName);
    RodiniaBenchmarkSet.getInputSizes().test(inputSize);

    return (inputSize == "N");
}

RodiniaBenchmarkSet.prototype.setBenchmarks = function () {
    this._testBenchmarks = RodiniaBenchmarkSet.getBenchmarkNames().parse(arrayFromArgs(arguments));
}

RodiniaBenchmarkSet.prototype.setInputSizes = function () {
    this._testInputSizes = RodiniaBenchmarkSet.getInputSizes().parse(arrayFromArgs(arguments));
}


/**
 * Prints the current Rodinia benchmark set.
 */
RodiniaBenchmarkSet.prototype.print = function () {
    println("BenchmarkSet: " + this.getName());
    println("Benchmark names: " + this._testBenchmarks);
    println("Benchmark sizes: " + this._testInputSizes);

    for (var benchName of this._testBenchmarks) {

        print(benchName + ":");

        for (var inputSize of this._testInputSizes) {

            if (RodiniaBenchmarkSet.isSizeSupported(benchName, inputSize)) {
                print(" " + inputSize);
            }
        }

        println();
    }
}

/*** IMPLEMENTATIONS ***/

RodiniaBenchmarkSet.prototype._getInstancesPrivate = function () {

    var instances = [];

    for (var benchName of this._testBenchmarks) {

        for (var inputSize of this._testInputSizes) {

            if (!RodiniaBenchmarkSet.isSizeSupported(benchName, inputSize)) {
                continue;
            }

            instances.push(new RodiniaBenchmarkInstance(benchName, inputSize));

        }
    }

    return instances;
}
