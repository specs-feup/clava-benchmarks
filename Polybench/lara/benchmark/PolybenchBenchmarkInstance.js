laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.PolybenchBenchmarkResources");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.Query");

/**
 * Instance of a C Polybench benchmark.
 */
function PolybenchBenchmarkInstance(benchmarkName, inputSize, version) {
  // Parent constructor
  ClavaBenchmarkInstance.call(
    this,
    "Polybench-" + benchmarkName + "-" + inputSize
  );

  this._benchmarkName = benchmarkName;
  this._inputSize = inputSize;
  this._version = version;

  this._previousStandard = undefined;
  this._previousFlags = undefined;

  // Add -lm
  this.getCMaker().addLibs("m");
}
// Inheritance
PolybenchBenchmarkInstance.prototype = Object.create(
  ClavaBenchmarkInstance.prototype
);

/*** IMPLEMENTATIONS ***/

PolybenchBenchmarkInstance.prototype._loadPrologue = function () {
  // Set standard
  this._previousStandard = Clava.getData().getStandard();
  Clava.getData().setStandard("c99");

  // Set define
  this._previousFlags = Clava.getData().getFlags();
  var modifiedFlags =
    this._previousFlags + " -D" + this._inputSize + "_DATASET -DPOLYBENCH_TIME";
  Clava.getData().setFlags(modifiedFlags);
};

PolybenchBenchmarkInstance.prototype._loadPrivate = function () {
  // Save current AST
  Clava.pushAst();

  // Clean AST
  Query.root().removeChildren();

  // Add code
  this._addCode();

  // Rebuild
  Clava.rebuild();
};

PolybenchBenchmarkInstance.prototype._closePrivate = function () {
  // Restore standard
  Clava.getData().setStandard(this._previousStandard);
  this._previousStandard = undefined;

  // Restore flags
  Clava.getData().setFlags(this._previousFlags);
  this._previousFlags = undefined;

  // Restore previous AST
  Clava.popAst();
};

PolybenchBenchmarkInstance.prototype._addCode = function () {
  // Create array with source files
  var sourceFiles = [];
  sourceFiles.push(this._benchmarkName + ".c");
  sourceFiles.push(this._benchmarkName + ".h");
  sourceFiles.push("polybench.c");
  sourceFiles.push("polybench.h");

  // Add files to tree
  for (var filename of sourceFiles) {
    var file = PolybenchBenchmarkResources.getFile(
      this._version + "/" + filename
    );
    var clavaJPFile = ClavaJoinPoints.file(file);
    Clava.addFile(clavaJPFile);
  }
};

PolybenchBenchmarkInstance.prototype.getKernel = function () {
  var $call = Query.search("call", /kernel_*/).first();

  if ($call === undefined) {
    throw (
      "PolybenchBenchmarkInstance.getKernel: Could not find call to function that starts with 'kernel_' in benchmark " +
      this.getName()
    );
  }

  return $call;
};
