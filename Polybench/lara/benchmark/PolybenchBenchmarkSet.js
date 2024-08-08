laraImport("lara.benchmark.PolybenchBenchmarkInstance");
laraImport("lara.benchmark.PolybenchBenchmarkResources");

laraImport("lara.benchmark.BenchmarkSet");

laraImport("lara.util.PredefinedStrings");
laraImport("lara.util.StringSet");
laraImport("lara.Io");

/**
 * C-version of the Polybench benchmarks.
 */
function PolybenchBenchmarkSet(version) {
  // Parent constructor
  BenchmarkSet.call(this, "PolybenchBenchmarkSet");

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
// Inheritance
PolybenchBenchmarkSet.prototype = Object.create(BenchmarkSet.prototype);

/**
 * @return {lara.util.PredefinedStrings} the benchmark names.
 */
PolybenchBenchmarkSet.prototype.getBenchmarkNames = function () {
  return this._benchmarkNames;
};

/**
 * @return {lara.util.PredefinedStrings} Available input sizes.
 */
PolybenchBenchmarkSet.prototype.getInputSizes = function () {
  return this._inputSizes;
};

/**
 * @return {lara.util.PredefinedStrings} Available versions.
 */
PolybenchBenchmarkSet.getVersions = function () {
  return PolybenchBenchmarkSet._VERSIONS;
  //return PolybenchBenchmarkSet._calculateVersions();
};

PolybenchBenchmarkSet._calculateVersions = function () {
  var versions = Io.getFolders(
    new PolybenchBenchmarkResources().getBaseFolder()
  ).map(function (value) {
    return value.getName();
  });
  return new PredefinedStrings("versions", false, versions);
};

PolybenchBenchmarkSet._VERSIONS = PolybenchBenchmarkSet._calculateVersions();

PolybenchBenchmarkSet.prototype.setBenchmarks = function () {
  this._testBenchmarks = this.getBenchmarkNames().parse(
    arrayFromArgs(arguments)
  );
};

PolybenchBenchmarkSet.prototype.setInputSizes = function () {
  this._testInputSizes = this.getInputSizes().parse(arrayFromArgs(arguments));
};

/**
 * Prints the current Polybench benchmark set.
 */
PolybenchBenchmarkSet.prototype.print = function () {
  println("BenchmarkSet: " + this.getName());
  println("Benchmark names: " + this._testBenchmarks);
  println("Benchmark sizes: " + this._testInputSizes);
  println("Benchmark version: " + this._version);
};

/*** IMPLEMENTATIONS ***/

PolybenchBenchmarkSet.prototype._getInstancesPrivate = function () {
  var instances = [];

  for (var benchName of this._testBenchmarks) {
    for (var inputSize of this._testInputSizes) {
      instances.push(
        new PolybenchBenchmarkInstance(benchName, inputSize, this._version)
      );
    }
  }

  return instances;
};
