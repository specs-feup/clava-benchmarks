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
    ClavaBenchmarkInstance.call(this, "Rosetta-" + benchmarkName + "-" + inputSize);
	
	this._benchmarkName = benchmarkName;
	this._inputSize = inputSize;
	
	this._previousStandard = undefined;
	this._previousFlags = undefined;

	// Add lib m
	this.getCMaker().addLibs("m");	
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
	println(sourceFiles);

	// Add files to tree
	for(var filename of sourceFiles) {
		var file = RosettaBenchmarkResources.getFile(filename);
		var clavaJPFile = ClavaJoinPoints.file(file);
		Clava.addFile(clavaJPFile);	
	}
}