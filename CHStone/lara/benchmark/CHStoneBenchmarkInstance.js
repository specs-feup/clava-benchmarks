laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.CHStoneBenchmarkResources");
laraImport("lara.Io");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.Query");

/**
 * Instance of a C CHStone benchmark.
 */
class CHStoneBenchmarkInstance extends ClavaBenchmarkInstance {
  constructor(benchmarkName, inputSize) {
    super("CHStone-" + benchmarkName + "-" + inputSize);

    this._benchmarkName = benchmarkName;
    this._inputSize = inputSize;

    this._previousStandard = undefined;
    this._previousFlags = undefined;

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

  closeEpilogue() {
    // Restore standard
    // HACK: not working when passing undefined
    if (this._previousStandard !== undefined) {
      Clava.getData().setStandard(this._previousStandard);
      this._previousStandard = undefined;
    }

    // Restore flags
    Clava.getData().setFlags(this._previousFlags);
    this._previousFlags = undefined;
  }

  addCode() {
    // Create array with source files
    var sourceFiles = [];

    var dir = new CHStoneBenchmarkResources().getFolder(this._benchmarkName);
    if (Io.isFolder(dir)) {
      for (var file of Io.getFiles(dir)) {
        if (file.name.includes(".c") || file.name.includes(".h")) {
          sourceFiles.push(this._benchmarkName + "/" + file.name);
        }
      }
    }
    console.log("Source files: " + sourceFiles);

    // Add files to tree
    for (var filename of sourceFiles) {
      var file = new CHStoneBenchmarkResources().getFile(filename);
      var clavaJPFile = ClavaJoinPoints.file(file);
      Clava.addFile(clavaJPFile);
    }
  }
}
