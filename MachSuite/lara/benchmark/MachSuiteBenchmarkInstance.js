laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.MachSuiteBenchmarkResources");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.WeaverJps");

/**
 * Instance of a C MachSuite benchmark.
 */
function MachSuiteBenchmarkInstance(benchmarkName, inputSize) {
    // Parent constructor
    var fullName = "MachSuite-" + benchmarkName + "-" + inputSize;
    ClavaBenchmarkInstance.call(this, fullName);

    this._benchmarkName = benchmarkName;
    this._inputSize = inputSize;

    this._previousStandard = undefined;
    this._previousFlags = undefined;

    // Add lib m
    this.getCMaker().addLibs("m");
}


// Inheritance
MachSuiteBenchmarkInstance.prototype = Object.create(ClavaBenchmarkInstance.prototype);


/*** IMPLEMENTATIONS ***/

MachSuiteBenchmarkInstance.prototype._loadPrologue = function () {

    // Set standard
    this._previousStandard = Clava.getData().getStandard();
    Clava.getData().setStandard("c11");

    // Set define
    this._previousFlags = Clava.getData().getFlags();
    var modifiedFlags = this._previousFlags + " -O3";
    Clava.getData().setFlags(modifiedFlags);

}

MachSuiteBenchmarkInstance.prototype._loadPrivate = function () {
    // Save current AST
    Clava.pushAst();

    // Clean AST
    WeaverJps.root().removeChildren();

    // Add code
    this._addCode();

    // Rebuild
    Clava.rebuild();

}

MachSuiteBenchmarkInstance.prototype._closePrivate = function () {
    // Restore standard
    Clava.getData().setStandard(this._previousStandard);
    this._previousStandard = undefined;

    // Restore flags
    Clava.getData().setFlags(this._previousFlags);
    this._previousFlags = undefined;

    // Restore previous AST
    Clava.popAst();

    Io.deleteFiles("output.data");
}

MachSuiteBenchmarkInstance.prototype._copyDataFolder = function (fName) {
    let dataFolder = MachSuiteBenchmarkResources.getFolder(fName);
    let fullPath = Io.getWorkingFolder();
    const copiedFolderPath = Io.getPath(fullPath, dataFolder.getName());
    Io.copyFolder(dataFolder, copiedFolderPath);
    dataFolder = copiedFolderPath;
}

MachSuiteBenchmarkInstance.prototype._executePrivate = function () {
    if (this._currentExe === undefined) {
        throw "MachSuiteBenchmarkInstance._executePrivate(): no executable currently defined";
    }

    this._currentExecutor.execute(this._currentExe.getAbsolutePath());
    return this._currentExecutor;
}

MachSuiteBenchmarkInstance.prototype._addCode = function () {
    // Create array with source files	
    var sourceFiles = [];

    var dir = MachSuiteBenchmarkResources.getFolder(this._benchmarkName);
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
        var file = MachSuiteBenchmarkResources.getFile(filename);
        var clavaJPFile = ClavaJoinPoints.file(file);
        Clava.addFile(clavaJPFile);
    }
}