laraImport("lara.benchmark.CHStoneBenchmarkInstance");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");

/**
 * C-version of the CHStone benchmarks.
 */
class CHStoneBenchmarkSet extends BenchmarkSet {
  constructor() {
    super("CHStoneBenchmarkSet");

    this._testBenchmarks = [
      "adpcm",
      "aes",
      "blowfish",
      "dfadd",
      "dfdiv",
      "dfmul",
      "dfsin",
      "gsm",
      "jpeg",
      "mips",
      "motion",
      "sha",
    ];
    this._testInputSizes = ["N"];
  }

  /*
   * Available benchmarks
   */
  static _benchmarkNames = new PredefinedStrings("benchmark name", true, [
    "adpcm",
    "aes",
    "blowfish",
    "dfadd",
    "dfdiv",
    "dfmul",
    "dfsin",
    "gsm",
    "jpeg",
    "mips",
    "motion",
    "sha",
  ]);

  /*
   * Available sizes
   */
  static _inputSizes = new PredefinedStrings("input size", true, ["N"]);

  /**
   * @return {lara.util.PredefinedStrings} Names of the available benchmarks.
   */
  static getBenchmarkNames() {
    return CHStoneBenchmarkSet._benchmarkNames;
  }

  /**
   * @return {lara.util.PredefinedStrings} Available input sizes (some benchmarks might not support all sizes).
   */
  static getInputSizes() {
    return CHStoneBenchmarkSet._inputSizes;
  }

  static isSizeSupported(benchName, inputSize) {
    // Check if name and inputSize are valid
    CHStoneBenchmarkSet.getBenchmarkNames().test(benchName);
    CHStoneBenchmarkSet.getInputSizes().test(inputSize);

    // CHStone has no sizes, so this is superfluous

    return true;
  }

  setBenchmarks() {
    this._testBenchmarks = CHStoneBenchmarkSet.getBenchmarkNames().parse(
      arrayFromArgs(arguments)
    );
  }

  setInputSizes() {
    this._testInputSizes = CHStoneBenchmarkSet.getInputSizes().parse(
      arrayFromArgs(arguments)
    );
  }

  /**
   * Prints the current CHStone benchmark set.
   */
  print() {
    println("BenchmarkSet: " + this.getName());
    println("Benchmark names: " + this._testBenchmarks);
    println("Benchmark sizes: " + this._testInputSizes);

    for (var benchName of this._testBenchmarks) {
      print(benchName + ":");

      for (var inputSize of this._testInputSizes) {
        if (CHStoneBenchmarkSet.isSizeSupported(benchName, inputSize)) {
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
        if (!CHStoneBenchmarkSet.isSizeSupported(benchName, inputSize)) {
          continue;
        }

        instances.push(new CHStoneBenchmarkInstance(benchName, inputSize));
      }
    }

    return instances;
  }
}
