#ifndef LDA_INFERENCE_H
#define LDA_INFERENCE_H

#include <math.h>
#include <float.h>
#include <assert.h>
#include "lda.h"
#include "utils.h"

double lda_inference(document *, lda_model *, double *, double **);
double compute_likelihood(document *, lda_model *, double **, double *);

#endif
