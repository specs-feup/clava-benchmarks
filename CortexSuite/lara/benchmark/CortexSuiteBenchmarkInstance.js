laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.CortexSuiteBenchmarkResources");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.WeaverJps");

/**
 * Instance of a C CortexSuite benchmark.
 */
function CortexSuiteBenchmarkInstance(benchmarkName, inputSize, standard) {
    // Parent constructor
    var fullName = "CortexSuite-" + benchmarkName + "-" + inputSize;
    ClavaBenchmarkInstance.call(this, fullName);

    this._benchmarkName = benchmarkName;
    this._inputSize = inputSize;
    this._standard = standard;

    this._previousStandard = undefined;
    this._previousFlags = undefined;

    // Add lib m
    this.getCMaker().addLibs("m");
}


// Inheritance
CortexSuiteBenchmarkInstance.prototype = Object.create(ClavaBenchmarkInstance.prototype);


/*** IMPLEMENTATIONS ***/

CortexSuiteBenchmarkInstance.prototype._loadPrologue = function () {

    // Set standard
    this._previousStandard = Clava.getData().getStandard();

    Clava.getData().setStandard(this._standard);

    // Set define
    this._previousFlags = Clava.getData().getFlags();
    var modifiedFlags = this._previousFlags + " -lm";
    Clava.getData().setFlags(modifiedFlags);

}

CortexSuiteBenchmarkInstance.prototype._loadPrivate = function () {
    // Save current AST
    Clava.pushAst();

    // Clean AST
    WeaverJps.root().removeChildren();

    // Add code
    this._addCode();

    // Rebuild
    Clava.rebuild();

}

CortexSuiteBenchmarkInstance.prototype._closePrivate = function () {
    // Restore standard
    Clava.getData().setStandard(this._previousStandard);
    this._previousStandard = undefined;

    // Restore flags
    Clava.getData().setFlags(this._previousFlags);
    this._previousFlags = undefined;

    // Restore previous AST
    Clava.popAst();

    // Delete input/output files
    // TBD
}

CortexSuiteBenchmarkInstance.prototype._copyDataFolder = function (fName) {
    let dataFolder = CortexSuiteBenchmarkResources.getFolder(fName);
    let fullPath = Io.getWorkingFolder();
    const copiedFolderPath = Io.getPath(fullPath, dataFolder.getName());
    Io.copyFolder(dataFolder, copiedFolderPath);
    dataFolder = copiedFolderPath;
}

CortexSuiteBenchmarkInstance.prototype._executePrivate = function () {
    if (this._currentExe === undefined) {
        throw "CortexSuiteBenchmarkInstance._executePrivate(): no executable currently defined";
    }

    this._currentExecutor.execute(this._currentExe.getAbsolutePath());

    return this._currentExecutor;
}

CortexSuiteBenchmarkInstance.prototype._addCode = function () {
    // Create array with source files	
    var sourceFiles = [];

    var dir = CortexSuiteBenchmarkResources.getFolder(this._benchmarkName);
    if (Io.isFolder(dir)) {
        for (var file of Io.getFiles(dir)) {
            if (file.name.endsWith(".c") || file.name.endsWith(".cpp") || file.name.endsWith(".h")) {
                sourceFiles.push(this._benchmarkName + "/" + file.name);
            }
        }
    }
    //sourceFiles.push(this._benchmarkName + "/test.cpp");
    println(sourceFiles);

    // Add files to tree
    for (var filename of sourceFiles) {
        var file = CortexSuiteBenchmarkResources.getFile(filename);
        var clavaJPFile = ClavaJoinPoints.file(file);
        Clava.addFile(clavaJPFile);
    }
}