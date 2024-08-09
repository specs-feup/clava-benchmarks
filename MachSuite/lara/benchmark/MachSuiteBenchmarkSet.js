laraImport("lara.benchmark.MachSuiteBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * C-version of the MachSuite benchmarks.
 */
class MachSuiteBenchmarkSet extends BenchmarkSet {
  constructor() {
    // Parent constructor
    super("MachSuiteBenchmarkSet");

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
      "viterbi",
    ];
    this._testInputSizes = ["D"];
  }

  /*
   * Available benchmarks
   */
  static _benchmarkNames = new PredefinedStrings("benchmark name", true, [
    "aes",
    "backprop",
    "bfs-bulk",
    "bfs-queue",
    "fft-strided",
    "fft-transpose",
    "gemm-blocked",
    "gemm-ncubed",
    "kmp",
    "md-grid",
    "md-knn",
    "nw",
    "sort-merge",
    "sort-radix",
    "spmv-crs",
    "spmv-ellpack",
    "stencil-2d",
    "stencil-3d",
    "viterbi",
  ]);

  /*
   * Available sizes
   */
  static _inputSizes = new PredefinedStrings("input size", true, ["D"]);

  /**
   * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
   */
  static getBenchmarkNames() {
    return MachSuiteBenchmarkSet._benchmarkNames;
  }

  /**
   * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
   */
  static getInputSizes() {
    return MachSuiteBenchmarkSet._inputSizes;
  }

  static isSizeSupported(benchName, inputSize) {
    // Check if name and inputSize are valid
    MachSuiteBenchmarkSet.getBenchmarkNames().test(benchName);
    MachSuiteBenchmarkSet.getInputSizes().test(inputSize);

    return inputSize == "D";
  }

  setBenchmarks() {
    this._testBenchmarks = MachSuiteBenchmarkSet.getBenchmarkNames().parse(
      arrayFromArgs(arguments)
    );
  }

  setInputSizes() {
    this._testInputSizes = MachSuiteBenchmarkSet.getInputSizes().parse(
      arrayFromArgs(arguments)
    );
  }

  /**
   * Prints the current MachSuite benchmark set.
   */
  print() {
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

  _getInstancesPrivate() {
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
}
