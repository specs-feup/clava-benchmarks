laraImport(lara.benchmark.ClavaBenchmarkInstance);
laraImport(lara.benchmark.HiFlipVXBenchmarkResources);

laraImport(clava.Clava);
laraImport(clava.ClavaJoinPoints);

laraImport(weaver.WeaverJps);

/**
 * Instance of a C++ HiFlipVX benchmark.
 */
function HiFlipVXBenchmarkInstance(benchmarkName, inputSize) {
    // Parent constructor
    ClavaBenchmarkInstance.call(this, "HiFlipVX-" + benchmarkName + "-" + inputSize);
	
	this._benchmarkName = benchmarkName;
	this._inputSize = inputSize;
	
	this._previousStandard = undefined;
	this._previousFlags = undefined;
	
	var filename = benchmarkName + "/img_main.cpp";
	this._file = HiFlipVXBenchmarkResources.getFile(filename);

	// Add lib m
	//this.getCMaker().addLibs("m");	
}


// Inheritance
HiFlipVXBenchmarkInstance.prototype = Object.create(ClavaBenchmarkInstance.prototype);


/*** IMPLEMENTATIONS ***/

HiFlipVXBenchmarkInstance.prototype._loadPrologue = function() {

	// Set standard
	this._previousStandard = Clava.getData().getStandard();
	Clava.getData().setStandard("c++11");	

	// Set define
	this._previousFlags = Clava.getData().getFlags();
	var modifiedFlags = this._previousFlags + " -DCLASS_" + this._inputSize;
	Clava.getData().setFlags(modifiedFlags);

}

HiFlipVXBenchmarkInstance.prototype._loadPrivate = function() {


	// Save current AST
	Clava.pushAst();
	
	// Clean AST
	WeaverJps.root().removeChildren();

	// Add code
	var clavaJPFile = ClavaJoinPoints.file(this._file);
	Clava.addFile(clavaJPFile);	

	// Rebuild
	Clava.rebuild();

}



HiFlipVXBenchmarkInstance.prototype._closePrivate = function() {
	// Restore standard
	Clava.getData().setStandard(this._previousStandard);	
	this._previousStandard = undefined;

	// Restore flags
	Clava.getData().setFlags(this._previousFlags);
	this._previousFlags = undefined;	

	// Restore previous AST
	Clava.popAst();
		
}

