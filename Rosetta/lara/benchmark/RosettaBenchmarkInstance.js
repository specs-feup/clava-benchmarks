laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.RosettaBenchmarkResources");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.WeaverJps");

/**
 * Instance of a C Rosetta benchmark.
 */
function RosettaBenchmarkInstance(benchmarkName, inputSize) {
    // Parent constructor
	var fullName = "Rosetta-" + benchmarkName + "-" + inputSize;
    ClavaBenchmarkInstance.call(this, fullName);
	
	this._benchmarkName = benchmarkName;
	this._inputSize = inputSize;
	
	this._previousStandard = undefined;
	this._previousFlags = undefined;

	// Add lib m
	this.getCMaker().addLibs("m");	
/*
	var inputname = benchmarkName + "/data";
	let dataFile = RosettaBenchmarkResources.getFile(inputname);
	let fullPath = Io.getWorkingFolder();
	const copiedFilePath = Io.getPath(fullPath, dataFile.getName());
	Io.copyFile(dataFile, copiedFilePath);
	dataFile = copiedFilePath;
	
	this.dataFile = dataFile;*/
}


// Inheritance
RosettaBenchmarkInstance.prototype = Object.create(ClavaBenchmarkInstance.prototype);


/*** IMPLEMENTATIONS ***/

RosettaBenchmarkInstance.prototype._loadPrologue = function() {

	// Set standard
	this._previousStandard = Clava.getData().getStandard();
	Clava.getData().setStandard("c++17");	

	// Set define
	this._previousFlags = Clava.getData().getFlags();
	var modifiedFlags = this._previousFlags + " -DCLASS_" + this._inputSize + " -D SW";
	Clava.getData().setFlags(modifiedFlags);

}

RosettaBenchmarkInstance.prototype._loadPrivate = function() {
	// Save current AST
	Clava.pushAst();
	
	// Clean AST
	WeaverJps.root().removeChildren();

	// Add code
	this._addCode();

	// Rebuild
	Clava.rebuild();

}

RosettaBenchmarkInstance.prototype._closePrivate = function() {
	// Restore standard
	Clava.getData().setStandard(this._previousStandard);	
	this._previousStandard = undefined;

	// Restore flags
	Clava.getData().setFlags(this._previousFlags);
	this._previousFlags = undefined;	

	// Restore previous AST
	Clava.popAst();

	// Delete input/output files
	if (this._benchmarkName == "spam-filter") {
		Io.deleteFiles("output.txt");
		Io.deleteFolder("data");
	}
	else if (this._benchmarkName == "optical-flow") {

	}
	else {
		Io.deleteFiles("outputs.txt");
	}
}

RosettaBenchmarkInstance.prototype._copyDataFolder = function(fName) {	
	let dataFolder = RosettaBenchmarkResources.getFolder(fName);
	let fullPath = Io.getWorkingFolder();
	const copiedFolderPath = Io.getPath(fullPath, dataFolder.getName());
	Io.copyFolder(dataFolder, copiedFolderPath);
	dataFolder = copiedFolderPath;
}

RosettaBenchmarkInstance.prototype._executePrivate = function() {		
	if(this._currentExe === undefined) {
		throw "RosettaBenchmarkInstance._executePrivate(): no executable currently defined";
	}

	if (this._benchmarkName == "spam-filter") {
		var fName = this._benchmarkName + "/data";
		this._copyDataFolder(fName);

		this._currentExecutor.execute(this._currentExe.getAbsolutePath(), "-p", "data");
	}
	else if (this._benchmarkName == "optical-flow") {
		if (this._inputSize == "current") {
			var fName = this._benchmarkName + "/datasets/current";
			this._copyDataFolder(fName);

			this._currentExecutor.execute(this._currentExe.getAbsolutePath(), "-p",
			"datasets/current", "-o", "output_current.flo");
		}
		if (this._inputSize == "sintel") {
			this._currentExecutor.execute(this._currentExe.getAbsolutePath(), "-p",
			"datasets/sintel_alley", "-o", "output_sintel.flo");
		}
	}
	else {
		this._currentExecutor.execute(this._currentExe.getAbsolutePath());
	}
	return this._currentExecutor;
}

RosettaBenchmarkInstance.prototype._addCode = function() {
	// Create array with source files	
	var sourceFiles = [];

	var dir = RosettaBenchmarkResources.getFolder(this._benchmarkName);
	if (Io.isFolder(dir)) {
		for (var file of Io.getFiles(dir)) {
			if(file.name.endsWith(".c") || file.name.endsWith(".cpp") || file.name.endsWith(".h")) {
				sourceFiles.push(this._benchmarkName + "/" + file.name);
			}
		}
	}
	//sourceFiles.push(this._benchmarkName + "/test.cpp");
	println(sourceFiles);

	// Add files to tree
	for(var filename of sourceFiles) {
		var file = RosettaBenchmarkResources.getFile(filename);
		var clavaJPFile = ClavaJoinPoints.file(file);
		Clava.addFile(clavaJPFile);	
	}
}