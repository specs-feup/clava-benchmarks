laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.HiFlipVXBenchmarkResources");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.Query");

/**
 * Instance of a C++ HiFlipVX benchmark.
 */
class HiFlipVXBenchmarkInstance extends ClavaBenchmarkInstance {
  constructor(benchmarkName, inputSize) {
    // Parent constructor
    super("HiFlipVX-" + benchmarkName + "-" + inputSize);

    //const fullName = "HiFlipVX-" + benchmarkName + "-" + inputSize;
    //ClavaBenchmarkInstance.call(this, fullName);
    this.resources = new HiFlipVXBenchmarkResources();
    this._benchmarkName = benchmarkName;
    this._inputSize = inputSize;

    this._previousStandard = undefined;
    this._previousFlags = undefined;

    var filename = benchmarkName + "/img_main.cpp";
    var inputname = benchmarkName + "/img1.pgm";

    this._file = this.resources.getFile(filename);

    let dataFile = this.resources.getFile(inputname);
    // HiFlipVX requries img1.pgm to be in the same dir as the executable
    //let fullPath = Io.getWorkingFolder() + "/laraBenchmarks/" + fullName + "/build/bin";
    let fullPath = Io.getWorkingFolder();
    const copiedFilePath = Io.getPath(fullPath, dataFile.getName());
    Io.copyFile(dataFile, copiedFilePath);
    dataFile = copiedFilePath;

    this.dataFile = dataFile;
  }

  // Inheritance
  //HiFlipVXBenchmarkInstance.prototype = Object.create(ClavaBenchmarkInstance.prototype);

  /*** IMPLEMENTATIONS ***/
  /*
  _loadPrologue() {
    // Set standard
    this._previousStandard = Clava.getData().getStandard();
    Clava.getData().setStandard("c++11");

    // Set define
    this._previousFlags = Clava.getData().getFlags();
    var modifiedFlags = this._previousFlags + " -DCLASS_" + this._inputSize;
    Clava.getData().setFlags(modifiedFlags);
  }
*/
  loadPrologue() {
    // Set standard
    this._previousStandard = Clava.getData().getStandard();
    Clava.getData().setStandard("c++11");

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

  executePrivate() {
    if (this._currentExe === undefined) {
      throw "HiFlipVXBenchmarkInstance._executePrivate(): no executable currently defined";
    }

    this._currentExecutor.execute(
      this._currentExe.getAbsolutePath(),
      this.dataFile.getAbsolutePath()
    );
    return this._currentExecutor;
  }

  closeEpilogue() {
    // Restore standard
    Clava.getData().setStandard(this._previousStandard);
    this._previousStandard = undefined;

    // Restore flags
    Clava.getData().setFlags(this._previousFlags);
    this._previousFlags = undefined;

    // Delete input/output files
    Io.deleteFiles(
      "img1.pgm",
      "out1.pgm",
      "out2.pgm",
      "out3.pgm",
      "out4.pgm",
      "out5.pgm"
    );
  }
}
