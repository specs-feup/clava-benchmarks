laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.MachSuiteBenchmarkResources");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.Query");

/**
 * Instance of a C MachSuite benchmark.
 */
class MachSuiteBenchmarkInstance extends ClavaBenchmarkInstance {
  constructor(benchmarkName, inputSize) {
    // Parent constructor
    var fullName = "MachSuite-" + benchmarkName + "-" + inputSize;
    super(fullName);

    this.resources = new MachSuiteBenchmarkResources();
    this._benchmarkName = benchmarkName;
    this._inputSize = inputSize;

    this._previousStandard = undefined;
    this._previousFlags = undefined;

    // Add lib m
    this.getCMaker().addLibs("m");
  }

  /*** IMPLEMENTATIONS ***/

  loadPrologue = function () {
    // Set standard
    this._previousStandard = Clava.getData().getStandard();
    Clava.getData().setStandard("c11");

    // Set define
    this._previousFlags = Clava.getData().getFlags();
    var modifiedFlags = this._previousFlags + " -O3";
    Clava.getData().setFlags(modifiedFlags);
  };

  closeEpilogue = function () {
    // Restore standard
    Clava.getData().setStandard(this._previousStandard);
    this._previousStandard = undefined;

    // Restore flags
    Clava.getData().setFlags(this._previousFlags);
    this._previousFlags = undefined;

    if (Io.isFile("output.data")) {
      Io.deleteFiles("output.data");
    }
  };

  _copyDataFolder = function (fName) {
    let dataFolder = this.resources.getFolder(fName);
    let fullPath = Io.getWorkingFolder();
    const copiedFolderPath = Io.getPath(fullPath, dataFolder.getName());
    Io.copyFolder(dataFolder, copiedFolderPath);
    dataFolder = copiedFolderPath;
  };

  /*
  executePrivate = function () {
    if (this._currentExe === undefined) {
      throw "MachSuiteBenchmarkInstance._executePrivate(): no executable currently defined";
    }

    this._currentExecutor.execute(this._currentExe.getAbsolutePath());
    return this._currentExecutor;
  };
  */

  addCode = function () {
    // Create array with source files
    const sourceFiles = [];

    const dir = this.resources.getFolder(this._benchmarkName);
    const exts = [".c", ".cpp", ".h", ".hpp"];

    if (Io.isFolder(dir)) {
      for (const file of Io.getFiles(dir)) {
        for (const ext of exts) {
          if (file.name.endsWith(ext)) {
            sourceFiles.push(this._benchmarkName + "/" + file.name);
          }
        }
      }
    }
    //sourceFiles.push(this._benchmarkName + "/test.cpp");
    //println(sourceFiles);

    // Add files to tree
    for (const filename of sourceFiles) {
      const file = this.resources.getFile(filename);
      const clavaJPFile = ClavaJoinPoints.file(file);
      Clava.addFile(clavaJPFile);
    }
  };
}
