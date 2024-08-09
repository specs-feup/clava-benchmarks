laraImport("lara.benchmark.RosettaBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * C-version of the Rosetta benchmarks.
 */
class RosettaBenchmarkSet extends BenchmarkSet {
  constructor() {
    // Parent constructor
    super("RosettaBenchmarkSet");

    this._testBenchmarks = [
      "3d-rendering",
      "digit-recognition",
      "face-detection",
      "optical-flow",
      "spam-filter",
    ];
    this._testInputSizes = ["N", "current", "sintel"];
  }

  /*
   * Available benchmarks
   */
  static _benchmarkNames = new PredefinedStrings("benchmark name", true, [
    "3d-rendering",
    "digit-recognition",
    "face-detection",
    "optical-flow",
    "spam-filter",
  ]);

  /*
   * Available sizes
   */
  static _inputSizes = new PredefinedStrings("input size", true, [
    "N",
    "current",
    "sintel",
  ]);

  /**
   * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
   */
  static getBenchmarkNames() {
    return RosettaBenchmarkSet._benchmarkNames;
  }

  /**
   * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
   */
  static getInputSizes() {
    return RosettaBenchmarkSet._inputSizes;
  }

  static isSizeSupported(benchName, inputSize) {
    // Check if name and inputSize are valid
    RosettaBenchmarkSet.getBenchmarkNames().test(benchName);
    RosettaBenchmarkSet.getInputSizes().test(inputSize);

    if (benchName == "optical-flow") {
      return inputSize == "current" || inputSize == "sintel";
    } else {
      return inputSize == "N";
    }
  }

  setBenchmarks() {
    this._testBenchmarks = RosettaBenchmarkSet.getBenchmarkNames().parse(
      arrayFromArgs(arguments)
    );
  }

  setInputSizes() {
    this._testInputSizes = RosettaBenchmarkSet.getInputSizes().parse(
      arrayFromArgs(arguments)
    );
  }

  /**
   * Prints the current Rosetta benchmark set.
   */
  print() {
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

  _getInstancesPrivate() {
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
}
