laraImport("lara.benchmark.ClavaBenchmarkInstance");
laraImport("lara.benchmark.ParboilBenchmarkResources");

laraImport("clava.Clava");
laraImport("clava.ClavaJoinPoints");

laraImport("weaver.WeaverJps");

/**
 * Instance of a C Parboil benchmark.
 */
function ParboilBenchmarkInstance(benchmarkName, inputSize) {
    // Parent constructor
    ClavaBenchmarkInstance.call(this, "Parboil-" + benchmarkName + "-" + inputSize);
	
	this._benchmarkName = benchmarkName;
	this._inputSize = inputSize;
	
	this._previousStandard = undefined;
	this._previousFlags = undefined;

	// Add lib m
	this.getCMaker().addLibs("m");	
}


// Inheritance
ParboilBenchmarkInstance.prototype = Object.create(ClavaBenchmarkInstance.prototype);


/*** IMPLEMENTATIONS ***/

ParboilBenchmarkInstance.prototype._loadPrologue = function() {

	// Set standard
	this._previousStandard = Clava.getData().getStandard();
	Clava.getData().setStandard("c++11");	

	// Set define
	this._previousFlags = Clava.getData().getFlags();
	var modifiedFlags = this._previousFlags + " -DCLASS_" + this._inputSize /*+ " -D SW"*/;
	Clava.getData().setFlags(modifiedFlags);

}

ParboilBenchmarkInstance.prototype._loadPrivate = function() {


	// Save current AST
	Clava.pushAst();
	
	// Clean AST
	WeaverJps.root().removeChildren();

	// Add code
	this._addCode();

	// Rebuild
	Clava.rebuild();

}

ParboilBenchmarkInstance.prototype._closePrivate = function() {
	// Restore standard
	Clava.getData().setStandard(this._previousStandard);	
	this._previousStandard = undefined;

	// Restore flags
	Clava.getData().setFlags(this._previousFlags);
	this._previousFlags = undefined;	

	// Restore previous AST
	Clava.popAst();
		
}

ParboilBenchmarkInstance.prototype._addCode = function() {

	// Create array with source files	
	var sourceFiles = [];

	var dir = ParboilBenchmarkResources.getFolder(this._benchmarkName);
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
		var file = ParboilBenchmarkResources.getFile(filename);
		var clavaJPFile = ClavaJoinPoints.file(file);
		Clava.addFile(clavaJPFile);	
	}
}