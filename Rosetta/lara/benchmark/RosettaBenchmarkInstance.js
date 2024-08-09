laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.RosettaBenchmarkResources");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.Query");

class RosettaBenchmarkInstance extends ClavaBenchmarkInstance {
  /**
   * Instance of a C Rosetta benchmark.
   */
  constructor(benchmarkName, inputSize) {
    // Parent constructor
    var fullName = "Rosetta-" + benchmarkName + "-" + inputSize;
    super(fullName);

    this.resources = new RosettaBenchmarkResources();

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
    Clava.getData().setStandard("c++17");

    // Set define
    this._previousFlags = Clava.getData().getFlags();
    var modifiedFlags =
      this._previousFlags + " -DCLASS_" + this._inputSize + " -D SW";
    Clava.getData().setFlags(modifiedFlags);
  }

  closeEpilogue() {
    // Restore standard
    Clava.getData().setStandard(this._previousStandard);
    this._previousStandard = undefined;

    // Restore flags
    Clava.getData().setFlags(this._previousFlags);
    this._previousFlags = undefined;

    // Delete input/output files
    if (this._benchmarkName == "spam-filter") {
      if (Io.isFile("output.txt")) {
        Io.deleteFiles("output.txt");
      }

      if (Io.isFolder("data")) {
        Io.deleteFolder("data");
      }
    } else if (this._benchmarkName == "optical-flow") {
    } else {
      if (Io.isFile("outputs.txt")) {
        Io.deleteFiles("outputs.txt");
      }
    }
  }

  copyDataFolder(fName) {
    let dataFolder = this.resources.getFolder(fName);
    let fullPath = Io.getWorkingFolder();
    const copiedFolderPath = Io.getPath(fullPath, dataFolder.getName());
    Io.copyFolder(dataFolder, copiedFolderPath);
    dataFolder = copiedFolderPath;
  }

  executePrivate() {
    if (this._currentExe === undefined) {
      throw "RosettaBenchmarkInstance.executePrivate(): no executable currently defined";
    }

    if (this._benchmarkName == "spam-filter") {
      var fName = this._benchmarkName + "/data";
      this.copyDataFolder(fName);

      this._currentExecutor.execute(
        this._currentExe.getAbsolutePath(),
        "-p",
        "data"
      );
    } else if (this._benchmarkName == "optical-flow") {
      if (this._inputSize == "current") {
        var fName = this._benchmarkName + "/datasets/current";
        this.copyDataFolder(fName);

        this._currentExecutor.execute(
          this._currentExe.getAbsolutePath(),
          "-p",
          "datasets/current",
          "-o",
          "output_current.flo"
        );
      }
      if (this._inputSize == "sintel") {
        this._currentExecutor.execute(
          this._currentExe.getAbsolutePath(),
          "-p",
          "datasets/sintel_alley",
          "-o",
          "output_sintel.flo"
        );
      }
    } else {
      this._currentExecutor.execute(this._currentExe.getAbsolutePath());
    }
    return this._currentExecutor;
  }

  addCode() {
    // Create array with source files
    var sourceFiles = [];

    var dir = this.resources.getFolder(this._benchmarkName);
    if (Io.isFolder(dir)) {
      for (var file of Io.getFiles(dir)) {
        if (
          file.name.endsWith(".c") ||
          file.name.endsWith(".cpp") ||
          file.name.endsWith(".h")
        ) {
          sourceFiles.push(this._benchmarkName + "/" + file.name);
        }
      }
    }
    //sourceFiles.push(this._benchmarkName + "/test.cpp");
    println(sourceFiles);

    // Add files to tree
    for (var filename of sourceFiles) {
      var file = this.resources.getFile(filename);
      var clavaJPFile = ClavaJoinPoints.file(file);
      Clava.addFile(clavaJPFile);
    }
  }
}
