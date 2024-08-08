laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.PolybenchBenchmarkResources");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.Query");

class PolybenchBenchmarkInstance extends ClavaBenchmarkInstance {
  /**
   * Instance of a C Polybench benchmark.
   */
  constructor(benchmarkName, inputSize, version) {
    super("Polybench-" + benchmarkName + "-" + inputSize);

    // Resources
    this.resources = new PolybenchBenchmarkResources();

    this._benchmarkName = benchmarkName;
    this._inputSize = inputSize;
    this._version = version;

    this._previousStandard = undefined;
    this._previousFlags = undefined;

    // Add -lm
    this.getCMaker().addLibs("m");
  }

  /*** IMPLEMENTATIONS ***/

  loadPrologue() {
    // Set standard
    this._previousStandard = Clava.getData().getStandard();
    Clava.getData().setStandard("c99");

    // Set define
    this._previousFlags = Clava.getData().getFlags();
    var modifiedFlags =
      this._previousFlags +
      " -D" +
      this._inputSize +
      "_DATASET -DPOLYBENCH_TIME";
    Clava.getData().setFlags(modifiedFlags);
  }

  closeEpilogue() {
    // Restore standard
    Clava.getData().setStandard(this._previousStandard);
    this._previousStandard = undefined;

    // Restore flags
    Clava.getData().setFlags(this._previousFlags);
    this._previousFlags = undefined;
  }

  addCode() {
    // Create array with source files
    var sourceFiles = [];
    sourceFiles.push(this._benchmarkName + ".c");
    sourceFiles.push(this._benchmarkName + ".h");
    sourceFiles.push("polybench.c");
    sourceFiles.push("polybench.h");

    // Add files to tree
    for (var filename of sourceFiles) {
      var file = this.resources.getFile(this._version + "/" + filename);
      var clavaJPFile = ClavaJoinPoints.file(file);
      Clava.addFile(clavaJPFile);
    }
  }

  getKernel() {
    var $call = Query.search("call", /kernel_*/).first();

    if ($call === undefined) {
      throw (
        "PolybenchBenchmarkInstance.getKernel: Could not find call to function that starts with 'kernel_' in benchmark " +
        this.getName()
      );
    }

    return $call;
  }
}
