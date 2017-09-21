## Interpolating bus travel times

### The motivation
Currently, the NYC bus system's GPS sensors only give us 30-second granularity on bus position, and - as is par for the course with GPS sensors - are fairly noisy. In general, whether for nice visualizations or for general interest, we might want to get a better sense of where a given bus is, especially if a GPS sensor report fails. How can we interpolate between our messy measurements into something nice?

### The solution: a Kalman Filter
Kalman Filters are the exact tool typically used to solve this sort of problem. We make a prediction for our next state, based only on the previous state, via a linear model - then measure and update the estimate of our state based on the measurement - adding in a Gaussian error term to account for noise.

In particular, we make predictions every 5 seconds, ignoring the measure/update phase of the filter until the next measurement comes in (usually about 30 seconds later). Hence, we use the filter as a way to smooth out our interpolations to something "smarter" than pure linear interpolation based on how fast the bus was previously moving. It will be interesting to test this against pure linear interpolation to see how much the filter's smoothing can help us better estimate bus position at any point in time.

[The notebook](kalman.ipynb) contains the machinery making the model work.


