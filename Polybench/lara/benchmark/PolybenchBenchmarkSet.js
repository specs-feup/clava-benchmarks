laraImport("lara.benchmark.PolybenchBenchmarkInstance");
laraImport("lara.benchmark.PolybenchBenchmarkResources");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");
laraImport("lara.Io");

/**
 * C-version of the Polybench benchmarks.
 */
class PolybenchBenchmarkSet extends BenchmarkSet {
  constructor(version) {
    super("PolybenchBenchmarkSet");

    // Default version is 4.2
    this._version = version !== undefined ? version.toString() : "4.2";

    // Check if version is supported
    if (!PolybenchBenchmarkSet.getVersions().isValid(this._version)) {
      throw (
        "Version '" +
        this._version +
        "' not supported. Supported versions: " +
        PolybenchBenchmarkSet.getVersions().values()
      );
    }

    var benchData = new PolybenchBenchmarkResources().getJson(
      this._version + "/data.json"
    );

    this._benchmarkNames = new PredefinedStrings(
      "benchmark name",
      true,
      benchData["names"]
    );
    this._inputSizes = new PredefinedStrings(
      "input size",
      false,
      benchData["sizes"]
    );

    // By default, all benchmarks
    this._testBenchmarks = this._benchmarkNames.values();

    // By default, the second smallest size
    this._testInputSizes = [this._inputSizes.values()[1]];
  }

  /**
   * @return {lara.util.PredefinedStrings} the benchmark names.
   */
  getBenchmarkNames() {
    return this._benchmarkNames;
  }

  /**
   * @return {lara.util.PredefinedStrings} Available input sizes.
   */
  getInputSizes() {
    return this._inputSizes;
  }

  /**
   * @return {lara.util.PredefinedStrings} Available versions.
   */
  static getVersions() {
    return PolybenchBenchmarkSet._VERSIONS;
    //return PolybenchBenchmarkSet._calculateVersions();
  }

  static _calculateVersions() {
    console.log(
      "BASE FOLDER: " + new PolybenchBenchmarkResources().getBaseFolder()
    );
    var versions = Io.getFolders(
      new PolybenchBenchmarkResources().getBaseFolder()
    ).map(function (value) {
      return value.getName();
    });
    return new PredefinedStrings("versions", false, versions);
  }

  static _VERSIONS = PolybenchBenchmarkSet._calculateVersions();

  setBenchmarks() {
    this._testBenchmarks = this.getBenchmarkNames().parse(
      arrayFromArgs(arguments)
    );
  }

  setInputSizes() {
    this._testInputSizes = this.getInputSizes().parse(arrayFromArgs(arguments));
  }

  /**
   * Prints the current Polybench benchmark set.
   */
  print() {
    println("BenchmarkSet: " + this.getName());
    println("Benchmark names: " + this._testBenchmarks);
    println("Benchmark sizes: " + this._testInputSizes);
    println("Benchmark version: " + this._version);
  }

  /*** IMPLEMENTATIONS ***/

  _getInstancesPrivate() {
    var instances = [];

    for (var benchName of this._testBenchmarks) {
      for (var inputSize of this._testInputSizes) {
        instances.push(
          new PolybenchBenchmarkInstance(benchName, inputSize, this._version)
        );
      }
    }

    return instances;
  }
}
