/*===============================================================*/
/*                                                               */
/*                    optical_flow_host.cpp                      */
/*                                                               */
/*      Main host function for the Optical Flow application.     */
/*                                                               */
/*===============================================================*/

// standard C/C++ headers
#include <cstdio>
#include <cstdlib>
#include <getopt.h>
#include <string>
#include <time.h>
#include <sys/time.h>

// other headers
#include "utils.h"
#include "typedefs.h"
#include "check_result.h"

#include "optical_flow_sw.h"

int main(int argc, char **argv)
{
    printf("Optical Flow Application\n");

    // parse command line arguments
    std::string dataPath("");
    std::string outFile("");

    parse_sdsoc_command_line_args(argc, argv, dataPath, outFile);

    // create actual file names according to the datapath
    std::string frame_files[5];
    std::string reference_file;
    frame_files[0] = dataPath + "/frame1.ppm";
    frame_files[1] = dataPath + "/frame2.ppm";
    frame_files[2] = dataPath + "/frame3.ppm";
    frame_files[3] = dataPath + "/frame4.ppm";
    frame_files[4] = dataPath + "/frame5.ppm";
    reference_file = dataPath + "/ref.flo";

    // read in images and convert to grayscale
    printf("Reading input files ... \n");

    CByteImage imgs[5];
    for (int i = 0; i < 5; i++)
    {
        CByteImage tmpImg;
        ReadImage(tmpImg, frame_files[i].c_str());
        imgs[i] = ConvertToGray(tmpImg);
    }

    // read in reference flow file
    printf("Reading reference output flow... \n");

    CFloatImage refFlow;
    ReadFlowFile(refFlow, reference_file.c_str());

    // timers
    struct timeval start, end;

    static pixel_t frames[5][MAX_HEIGHT][MAX_WIDTH];
    static velocity_t outputs[MAX_HEIGHT][MAX_WIDTH];

    gettimeofday(&start, NULL);
    // use native C datatype arrays
    for (int f = 0; f < 5; f++)
        for (int i = 0; i < MAX_HEIGHT; i++)
            for (int j = 0; j < MAX_WIDTH; j++)
                frames[f][i][j] = imgs[f].Pixel(j, i, 0) / 255.0f;

    // run
    optical_flow_sw(frames[0], frames[1], frames[2], frames[3], frames[4], outputs);
    gettimeofday(&end, NULL);

    // check results
    printf("Checking results:\n");

    check_results(outputs, refFlow, outFile);

    // print time
    long long elapsed = (end.tv_sec - start.tv_sec) * 1000000LL + end.tv_usec - start.tv_usec;
    printf("elapsed time: %lld us\n", elapsed);

    return EXIT_SUCCESS;
}
