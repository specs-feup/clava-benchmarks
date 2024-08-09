laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.LsuBenchmarkResources");
laraImport("lara.benchmark.LsuData");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.Query");

/**
 * Instance of a C Large Single Compilation Unit benchmark.
 */
class LsuBenchmarkInstance extends ClavaBenchmarkInstance {
  #benchmarkName;
  #inputSize;
  #sourceFile;
  #dataFile;
  #previousStandard;

  constructor(benchmarkName, inputSize) {
    super("LSU-" + benchmarkName + "-" + inputSize);

    let benchSizes = LsuData.getSizes()[benchmarkName];
    if (benchSizes === undefined) {
      throw new Error(
        `Benchmark name '${benchmarkName}' not valid, available benchmarks: ${Object.keys(LsuData.getSizes())}`
      );
    }

    this.resources = new LsuBenchmarkResources();
    this.#benchmarkName = benchmarkName;
    this.#inputSize = inputSize;

    // Source file
    let sourceFilename = benchmarkName + ".c";
    this.#sourceFile = this.resources.getFile(sourceFilename);

    // Input file
    let dataFilename = benchSizes[inputSize];
    if (dataFilename === undefined) {
      throw new Error(
        `Input size '${inputSize}' not valid for benchmark '${benchmarkName}', available input sizes: ${Object.keys(benchSizes)}`
      );
    }

    let dataFile = this.resources.getFile(dataFilename);
    if (LsuData.copyData(benchmarkName)) {
      const copiedFilePath = Io.getPath(
        Io.getWorkingFolder(),
        dataFile.getName()
      );
      Io.copyFile(dataFile, copiedFilePath);
      dataFile = copiedFilePath;
    }

    this.#dataFile = dataFile;

    this.getCMaker().addLibs("m");

    //const copyData = LsuData.copyData(benchmarkName.getName());

    // Check if this file should be copied to working dir (e.g., bzip2 will replace the input file)
    //this.#dataFile = copyData ? Io.copyFile(resourceFile, Io.getWorkingFolder()) : resourceFile;
    //this.#dataFile = copyData ? Io.copyFile(resourceFile, Io.getWorkingFolder()) : resourceFile;
    //this.#dataFile = LsuBenchmarkResources.getFile(dataFilename);

    /*

	this._previousStandard = undefined;
	this._previousFlags = undefined;
	

	
	// Add lib m
	this.getCMaker().addLibs("m");	
*/
  }

  loadPrologue() {
    // Set standard
    this.#previousStandard = Clava.getData().getStandard();
    //Clava.getData().setStandard("c99");
    Clava.getData().setStandard("gnu99");
    //Clava.getData().setStandard("gnu90");
    //Clava.getData().setStandard("c++11");
  }

  addCode() {
    // Add code
    var clavaJPFile = ClavaJoinPoints.file(this.#sourceFile);
    Clava.addFile(clavaJPFile);
  }

  // TODO: Not working in clava-js
  executePrivate() {
    if (this._currentExe === undefined) {
      throw "LsuBenchmarkInstance._executePrivate(): no executable currently defined";
    }

    this._currentExecutor.execute(
      this._currentExe.getAbsolutePath(),
      this.#dataFile.getAbsolutePath()
    );
    return this._currentExecutor;
  }

  closeEpilogue() {
    // Restore standard
    Clava.getData().setStandard(this.#previousStandard);
    this.#previousStandard = undefined;
  }
}
