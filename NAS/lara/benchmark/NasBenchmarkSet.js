laraImport("lara.benchmark.NasBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * C-version of the NAS benchmarks.
 */
class NasBenchmarkSet extends BenchmarkSet {
  constructor() {
    // Parent constructor
    super("NasBenchmarkSet");

    this._testBenchmarks = ["BT", "CG", "EP", "FT", "IS", "LU", "MG", "SP"];
    this._testInputSizes = ["W"];
  }

  /*
   * Available benchmarks
   */
  static _benchmarkNames = new PredefinedStrings("benchmark name", true, [
    "BT",
    "CG",
    "EP",
    "FT",
    "IS",
    "LU",
    "MG",
    "SP",
  ]); // UA is currently having compilation problems, disabled

  /*
   * Available sizes
   */
  static _inputSizes = new PredefinedStrings("input size", true, [
    "S",
    "W",
    "A",
    "B",
    "C",
    "D",
    "E",
  ]);

  /**
   * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
   */
  static getBenchmarkNames() {
    return NasBenchmarkSet._benchmarkNames;
  }

  /**
   * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
   */
  static getInputSizes() {
    return NasBenchmarkSet._inputSizes;
  }

  static isSizeSupported(benchName, inputSize) {
    // Check if name and inputSize are valid
    NasBenchmarkSet.getBenchmarkNames().test(benchName);
    NasBenchmarkSet.getInputSizes().test(inputSize);

    // Benchmarks supported sizes map:
    //BT: S, W, A, B, C, D, E
    //CG: S, W, A, B, C
    //EP: S, W, A, B, C, D, E
    //FT: S, W, A, B, C, D, E
    //IS: S, W, A, B, C, D
    //LU: S, W, A, B, C, D, E
    //MG: S, W, A, B, C, D, E
    //SP: S, W, A, B, C, D, E
    //UA: S, W, A, B, C, D

    if (benchName === "CG" && (inputSize === "D" || inputSize === "E")) {
      return false;
    }

    if (benchName === "IS" && inputSize === "E") {
      return false;
    }

    if (benchName === "UA" && inputSize === "E") {
      return false;
    }

    return true;
  }

  setBenchmarks() {
    this._testBenchmarks = NasBenchmarkSet.getBenchmarkNames().parse(
      arrayFromArgs(arguments)
    );

    return this;
  }

  setInputSizes() {
    this._testInputSizes = NasBenchmarkSet.getInputSizes().parse(
      arrayFromArgs(arguments)
    );

    return this;
  }

  /**
   * Prints the current NAS benchmark set.
   */
  print() {
    println("BenchmarkSet: " + this.getName());
    println("Benchmark names: " + this._testBenchmarks);
    println("Benchmark sizes: " + this._testInputSizes);

    for (var benchName of this._testBenchmarks) {
      print(benchName + ":");

      for (var inputSize of this._testInputSizes) {
        if (NasBenchmarkSet.isSizeSupported(benchName, inputSize)) {
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
        if (!NasBenchmarkSet.isSizeSupported(benchName, inputSize)) {
          continue;
        }

        instances.push(new NasBenchmarkInstance(benchName, inputSize));
      }
    }

    return instances;
  }
}
