/***************************************************************************
 *cr
 *cr            (C) Copyright 2007 The Board of Trustees of the
 *cr                        University of Illinois
 *cr                         All Rights Reserved
 *cr
 ***************************************************************************/
#ifndef __MODEL_H__
#define __MODEL_H__

#include "parboil.h"

#define M_PI 3.14159265358979323846264338327950288
#define D2R M_PI / 180.0
#define R2D 180.0 / M_PI
#define R2AM 60.0 * 180.0 / M_PI

#define bins_per_dec 5
#define min_arcmin 1.0
#define max_arcmin 10000.0

#define NUM_BINS 20

typedef unsigned long hist_t;

struct spherical
{
  float ra, dec; // latitude, longitude pair
};

struct cartesian
{
  float x, y, z; // cartesian coodrinates
};

int readdatafile(char *fname, struct cartesian *data, int npoints);

int doCompute(struct cartesian *data1, int n1, struct cartesian *data2,
              int n2, int doSelf, long long *data_bins,
              int nbins, float *binb);

void initBinB(struct pb_TimerSet *timers);

#endif
