# How to execute:

## bfs:

* bfs -i data/1M_graph_input.dat
* bfs -i data/NY_graph_input.dat
* bfs -i data/SF_graph_input.dat
* bfs -i data/UT_graph_input.dat

## cutcp:

* cutcp -i data/large_watbox.sl100.pqr
* cutcp -i data/small_watbox.sl40.pqr

## histo:

* histo 10000 4 -i data/img_large.bin 
* histo 20 4 -i data/img_default.bin 

## lbm (NOT WORKING):

* lbm 3000 -i data/long_120_120_150_ldc.of
* lbm 100 -i data/short_120_120_150_ldc.of

## mri-gridding

* mrig 32 0 -i data/small.uks

## mri-q

* mriq -i data/large_64_64_64_dataset.bin
* mriq -i data/small_32_32_32_dataset.bin

## sad

* sad -i data/default_reference.bin,data/default_frame.bin
* sad -i data/large_reference.bin,data/large_frame.bin

## sgemm

* sgemm -i data/medium_matrix1.txt,data/medium_matrix2.txt,data/medium_matrix2t.txt
* sgemm -i data/small_matrix1.txt,data/small_matrix2.txt,data/small_matrix2t.txt

## spmv

* spmv -i data/small_1138_bus.mtx,data/small_vector.bin
* spmv -i data/medium_bcsstk18.mtx,data/medium_vector.bin
* spmv -i data/large_Dubcova3.mtx.bin,data/large_vector.bin 

## stencil

* stencil -i data/default_512x512x64x100.bin 512 512 64 5 5 100
* stencil -i data/small_128x128x32.bin 128 128 32 5 5 100

## tpacf

* tpacf 100 10391 -i data/large/Datapnts.1,data/large/Randompnts.1,data/large/Randompnts.2,data/large/Randompnts.3,data/large/Randompnts.4,data/large/Randompnts.5,data/large/Randompnts.6,data/large/Randompnts.7,data/large/Randompnts.8,data/large/Randompnts.9,data/large/Randompnts.10,data/large/Randompnts.11,data/large/Randompnts.12,data/large/Randompnts.13,data/large/Randompnts.14,data/large/Randompnts.15,data/large/Randompnts.16,data/large/Randompnts.17,data/large/Randompnts.18,data/large/Randompnts.19,data/large/Randompnts.20,data/large/Randompnts.21,data/large/Randompnts.22,data/large/Randompnts.23,data/large/Randompnts.24,data/large/Randompnts.25,data/large/Randompnts.26,data/large/Randompnts.27,data/large/Randompnts.28,data/large/Randompnts.29,data/large/Randompnts.30,data/large/Randompnts.31,data/large/Randompnts.32,data/large/Randompnts.33,data/large/Randompnts.34,data/large/Randompnts.35,data/large/Randompnts.36,data/large/Randompnts.37,data/large/Randompnts.38,data/large/Randompnts.39,data/large/Randompnts.40,data/large/Randompnts.41,data/large/Randompnts.42,data/large/Randompnts.43,data/large/Randompnts.44,data/large/Randompnts.45,data/large/Randompnts.46,data/large/Randompnts.47,data/large/Randompnts.48,data/large/Randompnts.49,data/large/Randompnts.50,data/large/Randompnts.51,data/large/Randompnts.52,data/large/Randompnts.53,data/large/Randompnts.54,data/large/Randompnts.55,data/large/Randompnts.56,data/large/Randompnts.57,data/large/Randompnts.58,data/large/Randompnts.59,data/large/Randompnts.60,data/large/Randompnts.61,data/large/Randompnts.62,data/large/Randompnts.63,data/large/Randompnts.64,data/large/Randompnts.65,data/large/Randompnts.66,data/large/Randompnts.67,data/large/Randompnts.68,data/large/Randompnts.69,data/large/Randompnts.70,data/large/Randompnts.71,data/large/Randompnts.72,data/large/Randompnts.73,data/large/Randompnts.74,data/large/Randompnts.75,data/large/Randompnts.76,data/large/Randompnts.77,data/large/Randompnts.78,data/large/Randompnts.79,data/large/Randompnts.80,data/large/Randompnts.81,data/large/Randompnts.82,data/large/Randompnts.83,data/large/Randompnts.84,data/large/Randompnts.85,data/large/Randompnts.86,data/large/Randompnts.87,data/large/Randompnts.88,data/large/Randompnts.89,data/large/Randompnts.90,data/large/Randompnts.91,data/large/Randompnts.92,data/large/Randompnts.93,data/large/Randompnts.94,data/large/Randompnts.95,data/large/Randompnts.96,data/large/Randompnts.97,data/large/Randompnts.98,data/large/Randompnts.99,data/large/Randompnts.100
* tpacf 100 4096 -i data/medium/Datapnts.1,data/medium/Randompnts.1,data/medium/Randompnts.2,data/medium/Randompnts.3,data/medium/Randompnts.4,data/medium/Randompnts.5,data/medium/Randompnts.6,data/medium/Randompnts.7,data/medium/Randompnts.8,data/medium/Randompnts.9,data/medium/Randompnts.10,data/medium/Randompnts.11,data/medium/Randompnts.12,data/medium/Randompnts.13,data/medium/Randompnts.14,data/medium/Randompnts.15,data/medium/Randompnts.16,data/medium/Randompnts.17,data/medium/Randompnts.18,data/medium/Randompnts.19,data/medium/Randompnts.20,data/medium/Randompnts.21,data/medium/Randompnts.22,data/medium/Randompnts.23,data/medium/Randompnts.24,data/medium/Randompnts.25,data/medium/Randompnts.26,data/medium/Randompnts.27,data/medium/Randompnts.28,data/medium/Randompnts.29,data/medium/Randompnts.30,data/medium/Randompnts.31,data/medium/Randompnts.32,data/medium/Randompnts.33,data/medium/Randompnts.34,data/medium/Randompnts.35,data/medium/Randompnts.36,data/medium/Randompnts.37,data/medium/Randompnts.38,data/medium/Randompnts.39,data/medium/Randompnts.40,data/medium/Randompnts.41,data/medium/Randompnts.42,data/medium/Randompnts.43,data/medium/Randompnts.44,data/medium/Randompnts.45,data/medium/Randompnts.46,data/medium/Randompnts.47,data/medium/Randompnts.48,data/medium/Randompnts.49,data/medium/Randompnts.50,data/medium/Randompnts.51,data/medium/Randompnts.52,data/medium/Randompnts.53,data/medium/Randompnts.54,data/medium/Randompnts.55,data/medium/Randompnts.56,data/medium/Randompnts.57,data/medium/Randompnts.58,data/medium/Randompnts.59,data/medium/Randompnts.60,data/medium/Randompnts.61,data/medium/Randompnts.62,data/medium/Randompnts.63,data/medium/Randompnts.64,data/medium/Randompnts.65,data/medium/Randompnts.66,data/medium/Randompnts.67,data/medium/Randompnts.68,data/medium/Randompnts.69,data/medium/Randompnts.70,data/medium/Randompnts.71,data/medium/Randompnts.72,data/medium/Randompnts.73,data/medium/Randompnts.74,data/medium/Randompnts.75,data/medium/Randompnts.76,data/medium/Randompnts.77,data/medium/Randompnts.78,data/medium/Randompnts.79,data/medium/Randompnts.80,data/medium/Randompnts.81,data/medium/Randompnts.82,data/medium/Randompnts.83,data/medium/Randompnts.84,data/medium/Randompnts.85,data/medium/Randompnts.86,data/medium/Randompnts.87,data/medium/Randompnts.88,data/medium/Randompnts.89,data/medium/Randompnts.90,data/medium/Randompnts.91,data/medium/Randompnts.92,data/medium/Randompnts.93,data/medium/Randompnts.94,data/medium/Randompnts.95,data/medium/Randompnts.96,data/medium/Randompnts.97,data/medium/Randompnts.98,data/medium/Randompnts.99,data/medium/Randompnts.100
* tpacf 100 487 -i data/small/Datapnts.1,data/small/Randompnts.1,data/small/Randompnts.2,data/small/Randompnts.3,data/small/Randompnts.4,data/small/Randompnts.5,data/small/Randompnts.6,data/small/Randompnts.7,data/small/Randompnts.8,data/small/Randompnts.9,data/small/Randompnts.10,data/small/Randompnts.11,data/small/Randompnts.12,data/small/Randompnts.13,data/small/Randompnts.14,data/small/Randompnts.15,data/small/Randompnts.16,data/small/Randompnts.17,data/small/Randompnts.18,data/small/Randompnts.19,data/small/Randompnts.20,data/small/Randompnts.21,data/small/Randompnts.22,data/small/Randompnts.23,data/small/Randompnts.24,data/small/Randompnts.25,data/small/Randompnts.26,data/small/Randompnts.27,data/small/Randompnts.28,data/small/Randompnts.29,data/small/Randompnts.30,data/small/Randompnts.31,data/small/Randompnts.32,data/small/Randompnts.33,data/small/Randompnts.34,data/small/Randompnts.35,data/small/Randompnts.36,data/small/Randompnts.37,data/small/Randompnts.38,data/small/Randompnts.39,data/small/Randompnts.40,data/small/Randompnts.41,data/small/Randompnts.42,data/small/Randompnts.43,data/small/Randompnts.44,data/small/Randompnts.45,data/small/Randompnts.46,data/small/Randompnts.47,data/small/Randompnts.48,data/small/Randompnts.49,data/small/Randompnts.50,data/small/Randompnts.51,data/small/Randompnts.52,data/small/Randompnts.53,data/small/Randompnts.54,data/small/Randompnts.55,data/small/Randompnts.56,data/small/Randompnts.57,data/small/Randompnts.58,data/small/Randompnts.59,data/small/Randompnts.60,data/small/Randompnts.61,data/small/Randompnts.62,data/small/Randompnts.63,data/small/Randompnts.64,data/small/Randompnts.65,data/small/Randompnts.66,data/small/Randompnts.67,data/small/Randompnts.68,data/small/Randompnts.69,data/small/Randompnts.70,data/small/Randompnts.71,data/small/Randompnts.72,data/small/Randompnts.73,data/small/Randompnts.74,data/small/Randompnts.75,data/small/Randompnts.76,data/small/Randompnts.77,data/small/Randompnts.78,data/small/Randompnts.79,data/small/Randompnts.80,data/small/Randompnts.81,data/small/Randompnts.82,data/small/Randompnts.83,data/small/Randompnts.84,data/small/Randompnts.85,data/small/Randompnts.86,data/small/Randompnts.87,data/small/Randompnts.88,data/small/Randompnts.89,data/small/Randompnts.90,data/small/Randompnts.91,data/small/Randompnts.92,data/small/Randompnts.93,data/small/Randompnts.94,data/small/Randompnts.95,data/small/Randompnts.96,data/small/Randompnts.97,data/small/Randompnts.98,data/small/Randompnts.99,data/small/Randompnts.100
