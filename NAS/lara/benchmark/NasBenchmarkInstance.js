laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.NasBenchmarkResources");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.Query");

/**
 * Instance of a C NAS benchmark.
 */
class NasBenchmarkInstance extends ClavaBenchmarkInstance {
  constructor(benchmarkName, inputSize) {
    // Parent constructor
    super("NAS-" + benchmarkName + "-" + inputSize);

    this._benchmarkName = benchmarkName;
    this._inputSize = inputSize;

    this._previousStandard = undefined;
    this._previousFlags = undefined;

    var filename = "NAS_" + benchmarkName + ".c";
    this._file = new NasBenchmarkResources().getFile(filename);

    // Add lib m
    this.getCMaker().addLibs("m");
  }

  /*** IMPLEMENTATIONS ***/

  loadPrologue() {
    // Set standard
    this._previousStandard = Clava.getData().getStandard();
    Clava.getData().setStandard("c99");

    // Set define
    this._previousFlags = Clava.getData().getFlags();
    var modifiedFlags = this._previousFlags + " -DCLASS_" + this._inputSize;
    Clava.getData().setFlags(modifiedFlags);
  }

  addCode() {
    // Add code
    var clavaJPFile = ClavaJoinPoints.file(this._file);
    Clava.addFile(clavaJPFile);
  }

  closeEpilogue() {
    // Restore standard
    Clava.getData().setStandard(this._previousStandard);
    this._previousStandard = undefined;

    // Restore flags
    Clava.getData().setFlags(this._previousFlags);
    this._previousFlags = undefined;
  }
}
