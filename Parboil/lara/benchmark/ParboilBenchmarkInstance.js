laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.ParboilBenchmarkResources");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.Query");

/**
 * Instance of a C Parboil benchmark.
 */
class ParboilBenchmarkInstance extends ClavaBenchmarkInstance {
  constructor(benchmarkName, inputSize) {
    inputSize = inputSize.toLowerCase();

    // Parent constructor
    super("Parboil-" + benchmarkName + "-" + inputSize);

    this.resources = new ParboilBenchmarkResources();
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
    Clava.getData().setStandard("c++11");

    // Set define
    this._previousFlags = Clava.getData().getFlags();
    var modifiedFlags =
      this._previousFlags + " -DCLASS_" + this._inputSize; /*+ " -D SW"*/
    Clava.getData().setFlags(modifiedFlags);
  }

  closeEpilogue() {
    // Restore standard
    Clava.getData().setStandard(this._previousStandard);
    this._previousStandard = undefined;

    // Restore flags
    Clava.getData().setFlags(this._previousFlags);
    this._previousFlags = undefined;

    // Cleanup files
    for (var file of Io.getFiles(Io.getWorkingFolder())) {
      const ext = [".bin", ".dat", ".mtx", ".of", ".pqr", ".txt", ".uks"];
      for (var i = 1; i <= 100; i++) {
        ext.push("." + i);
      }
      if (ext.some((char) => file.name.endsWith(char))) {
        Io.deleteFiles(file);
      }
    }
  }

  _copyDataFolder(fName) {
    let dataFolder = this.resources.getFolder(fName);
    let fullPath = Io.getWorkingFolder();
    const copiedFolderPath = Io.getPath(fullPath, dataFolder.getName());
    Io.copyFolder(dataFolder, copiedFolderPath);
    dataFolder = copiedFolderPath;
  }

  _copyDataFile(fName) {
    let dataFile = this.resources.getFile(fName);
    let fullPath = Io.getWorkingFolder();
    const copiedFilePath = Io.getPath(fullPath, dataFile.getName());
    Io.copyFile(dataFile, copiedFilePath);
    dataFile = copiedFilePath;
  }

  executePrivate() {
    if (this._currentExe === undefined) {
      throw "ParboilBenchmarkInstance._executePrivate(): no executable currently defined";
    }
    var benchName = this._benchmarkName;
    var inputSize = this._inputSize;

    if (benchName == "bfs") {
      var baseName = inputSize + "_graph_input.dat";
      var fName = benchName + "/data/" + baseName;
      this._copyDataFile(fName);
      this._currentExecutor.execute(
        this._currentExe.getAbsolutePath(),
        "-i",
        baseName
      );
    }
    if (benchName == "cutcp") {
      var baseName =
        inputSize +
        (inputSize == "large" ? "_watbox.sl100.pqr" : "_watbox.sl40.pqr");
      var fName = benchName + "/data/" + baseName;
      this._copyDataFile(fName);
      this._currentExecutor.execute(
        this._currentExe.getAbsolutePath(),
        "-i",
        baseName
      );
    }
    if (benchName == "histo") {
      var baseName = "img_" + inputSize + ".bin";
      var fName = benchName + "/data/" + baseName;
      this._copyDataFile(fName);

      var arg = inputSize == "large" ? "10000" : "200";
      this._currentExecutor.execute(
        this._currentExe.getAbsolutePath(),
        arg,
        "4",
        "-i",
        baseName
      );
    }
    if (benchName == "lbm") {
      var baseName = inputSize + "_120_120_150_ldc.of";
      var fName = benchName + "/data/" + baseName;
      this._copyDataFile(fName);

      var arg = inputSize == "long" ? "3000" : "100";
      this._currentExecutor.execute(
        this._currentExe.getAbsolutePath(),
        arg,
        "-i",
        baseName,
        "-o",
        "lbm_output.bin"
      );
    }
    if (benchName == "mri-gridding") {
      var baseName = inputSize + ".uks";
      var fName = benchName + "/data/" + baseName;
      this._copyDataFile(fName);
      this._currentExecutor.execute(
        this._currentExe.getAbsolutePath(),
        "32",
        "0",
        "-i",
        baseName
      );
    }
    if (benchName == "mri-q") {
      var baseName =
        inputSize == "large"
          ? "large_64_64_64_dataset.bin"
          : "small_32_32_32_dataset.bin";
      var fName = benchName + "/data/" + baseName;
      this._copyDataFile(fName);
      this._currentExecutor.execute(
        this._currentExe.getAbsolutePath(),
        "-i",
        baseName
      );
    }
    if (benchName == "sad") {
      var baseName1 =
        inputSize == "large" ? "large_reference.bin" : "default_reference.bin";
      var baseName2 =
        inputSize == "large" ? "large_frame.bin" : "default_frame.bin";
      var fName1 = benchName + "/data/" + baseName1;
      var fName2 = benchName + "/data/" + baseName2;
      this._copyDataFile(fName1);
      this._copyDataFile(fName2);
      this._currentExecutor.execute(
        this._currentExe.getAbsolutePath(),
        "-i",
        baseName1 + "," + baseName2
      );
    }
    if (benchName == "sgemm") {
      var baseName1 =
        inputSize == "medium" ? "medium_matrix1.txt" : "small_matrix1.txt";
      var baseName2 =
        inputSize == "medium" ? "medium_matrix2.txt" : "small_matrix2.txt";
      var baseName3 =
        inputSize == "medium" ? "medium_matrix2t.txt" : "small_matrix2t.txt";
      var fName1 = benchName + "/data/" + baseName1;
      var fName2 = benchName + "/data/" + baseName2;
      var fName3 = benchName + "/data/" + baseName3;
      this._copyDataFile(fName1);
      this._copyDataFile(fName2);
      this._copyDataFile(fName3);
      this._currentExecutor.execute(
        this._currentExe.getAbsolutePath(),
        "-i",
        baseName1 + "," + baseName2 + "," + baseName3
      );
    }
    if (benchName == "spmv") {
      var baseName1 =
        inputSize == "large"
          ? "large_Dubcova3.mtx.bin"
          : inputSize == "medium"
            ? "medium_bcsstk18.mtx"
            : "small_1138_bus.mtx";
      var baseName2 =
        inputSize == "large"
          ? "large_vector.bin"
          : inputSize == "medium"
            ? "medium_vector.bin"
            : "small_vector.bin";
      var fName1 = benchName + "/data/" + baseName1;
      var fName2 = benchName + "/data/" + baseName2;
      this._copyDataFile(fName1);
      this._copyDataFile(fName2);
      this._currentExecutor.execute(
        this._currentExe.getAbsolutePath(),
        "-i",
        baseName1 + "," + baseName2
      );
    }
    if (benchName == "stencil") {
      var baseName =
        inputSize == "default"
          ? "default_512x512x64x100.bin"
          : "small_128x128x32.bin";
      var fName = benchName + "/data/" + baseName;
      this._copyDataFile(fName);
      if (inputSize == "default") {
        this._currentExecutor.execute(
          this._currentExe.getAbsolutePath(),
          "-i",
          baseName,
          "512",
          "512",
          "64",
          "5",
          "5",
          "100"
        );
      } else {
        this._currentExecutor.execute(
          this._currentExe.getAbsolutePath(),
          "-i",
          baseName,
          "128",
          "128",
          "32",
          "5",
          "5",
          "100"
        );
      }
    }
    if (benchName == "tpacf") {
      var fName = benchName + "/data/" + inputSize + "/Datapnts.1";
      var randNames = [];
      for (var i = 1; i <= 100; i++) {
        randNames.push(benchName + "/data/" + inputSize + "/Randompnts." + i);
      }

      this._copyDataFile(fName);
      for (const randName of randNames) {
        this._copyDataFile(randName);
      }
      var finalArgs = fName + "," + randNames.join(",");
      var numArg =
        inputSize == "large" ? "10391" : inputSize == "medium" ? "4096" : "487";
      this._currentExecutor.execute(
        this._currentExe.getAbsolutePath(),
        "100",
        numArg,
        "-i",
        finalArgs
      );
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
    println(sourceFiles);

    // Add files to tree
    for (var filename of sourceFiles) {
      var file = this.resources.getFile(filename);
      var clavaJPFile = ClavaJoinPoints.file(file);
      Clava.addFile(clavaJPFile);
    }
  }
}
