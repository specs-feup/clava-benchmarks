# NAS BenchmnarkSet

This is a [BenchmarkSet](https://specs-feup.github.io/clava/api/lara.benchmark.BenchmarkSet.html) implementation for the [NAS Parallel benchmarks](https://www.nas.nasa.gov/software/npb.html).

## Installation

To use the NAS BenchmarkSet, first add this folder as a LARA include folder, with the option or the flag `-i`.

Alternatively, you can add the repository directly as an external dependency, either through the GUI or with the flag `-dep` and the link `https://github.com/specs-feup/clava-benchmarks.git?folder=NAS`.

It is also available as a predefined external dependency:

![image](https://user-images.githubusercontent.com/5724365/184380792-8392adc1-61dc-4ede-9432-288642ef7df4.png)

## Quick user guide

Start by importing the NAS benchmark set:

```JavaScript
laraImport("lara.benchmark.NasBenchmarkSet");
```

Then, create a new instance, defining which programs and sizes should be used, using the instance functions `setBenchmarks()` and `setInputSizes()`, respectively. By default, all 8 programs are setup, for the size W:

```JavaScript
const nasSet = new NasBenchmarkSet();
nasSet.setBenchmarks("EP", "IS");
nasSet.setSizes("A", "E");
```

Not all sizes are supported for all programs, please refer to the table below.

```
Benchmarks supported sizes map:
BT: S, W, A, B, C, D, E
CG: S, W, A, B, C
EP: S, W, A, B, C, D, E
FT: S, W, A, B, C, D, E
IS: S, W, A, B, C, D
LU: S, W, A, B, C, D, E
MG: S, W, A, B, C, D, E
SP: S, W, A, B, C, D, E
UA: S, W, A, B, C, D	
```

To check programmatically if a program supports a certain input size you can use the static method `isSizeSupported(benchName, inputSize)`. For a given setup, you can use the instance function `print()` to check what program-size pairs will be available:

```JavaScript
nasSet.print();

// Output:
//BenchmarkSet: NasBenchmarkSet
//Benchmark names: EP,IS
//Benchmark sizes: A,E
//EP: A E
//IS: A
```

To obtain the benchmark instances (three, in this case), you can use the instance function `getInstances()`, which returns an array of [BenchmarkInstance](https://specs-feup.github.io/clava/api/lara.benchmark.BenchmarkInstance.html) which contains functions such as `load()`, `compile()` and `execute()`.

Alternatively, since `BenchmarkSet` implements a generator function, you can use if in a `for..of` loop. In this case, in each iteration a program-size pair is automatically loaded at the beginning of the iteration, and unloaded at the end of the iteration.

## Example

The example below instantiates two NAS benchmarks (`EP` and `IS`), for two input sizes (`A` and `E`), and for each instance, instruments the code around the kernel using the API [Timer](https://specs-feup.github.io/clava/api/lara.code.Timer.html), which allows to measure execution time around a portion of code. After execution of each instance, the output is stored for further processing.

```JavaScript
laraImport("lara.benchmark.NasBenchmarkSet");
laraImport("lara.code.Timer");

const nasSet = new NasBenchmarkSet();
nasSet.setBenchmarks("EP", "IS");
nasSet.setInputSizes("A", "E");

const outputs = {};

for(const nasInstance of nasSet) {
  // Print name of the benchmark instance.
  // At this point, the current AST corresponds to this instance
	println("Name: " + nasInstance.getName());

  // Instrument code so that it measures execution time around the kernel
  new Timer().time(nasInstance.getKernel(), "Execution time: ");
	
  // Compile and execute the example
  const processExecutor = nasInstance.execute();
	
  // Store the console output for further processing 
  outputs[nasInstance.getName()] = processExecutor.getConsoleOutput();
}

// Partial output:
//Name: NAS-EP-A
//Compiling NAS-EP-A...
//Changes in file 'laraBenchmarks\NAS-EP-A\NAS_EP.c'
//Executing NAS-EP-A...
//
//
// NAS Parallel Benchmarks (NPB3.3-SER-C) - EP Benchmark
//
// Number of random numbers generated:       536870912
//Execution time: 28556.350200ms
//...



```

