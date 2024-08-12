laraImport("lara.benchmark.HiFlipVXBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * C++ version of the HiFlipVX benchmarks.
 */
class HiFlipVXBenchmarkSet extends BenchmarkSet {
  constructor() {
    // Parent constructor
    //BenchmarkSet.call(this, "HiFlipVXBenchmarkSet");
    super("HiFlipVXBenchmarkSet");

    this._testBenchmarks = ["v2"];
    this._testInputSizes = ["N"];
  }
  // Inheritance
  //HiFlipVXBenchmarkSet.prototype = Object.create(BenchmarkSet.prototype);

  /*
   * Available benchmarks
   */
  static _benchmarkNames = new PredefinedStrings("benchmark name", true, [
    "v2",
  ]);

  /*
   * Available sizes
   */
  static _inputSizes = new PredefinedStrings("input size", true, ["N"]);

  /**
   * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
   */
  static getBenchmarkNames() {
    return HiFlipVXBenchmarkSet._benchmarkNames;
  }

  /**
   * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
   */
  static getInputSizes() {
    return HiFlipVXBenchmarkSet._inputSizes;
  }

  static isSizeSupported(benchName, inputSize) {
    // Check if name and inputSize are valid
    HiFlipVXBenchmarkSet.getBenchmarkNames().test(benchName);
    HiFlipVXBenchmarkSet.getInputSizes().test(inputSize);

    // HiFlipVX has no sizes, so this is superfluous

    return true;
  }

  setBenchmarks() {
    this._testBenchmarks = HiFlipVXBenchmarkSet.getBenchmarkNames().parse(
      arrayFromArgs(arguments)
    );
  }

  setInputSizes() {
    this._testInputSizes = HiFlipVXBenchmarkSet.getInputSizes().parse(
      arrayFromArgs(arguments)
    );
  }

  /**
   * Prints the current HiFlipVX benchmark set.
   */
  print() {
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

  _getInstancesPrivate() {
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
}
