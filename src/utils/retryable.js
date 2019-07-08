const { defer } = require("rxjs");
const { delay, retryWhen, take, tap } = require("rxjs/operators");

const retryIntervalTime = 15 * 60 * 1000;

const retryable = restaurant => {
  return defer(() => restaurant.getter(restaurant)).pipe(
    retryWhen(errors =>
      errors.pipe(
        delay(retryIntervalTime),
        tap(() =>
          console.log(`Retrying receive food from ${restaurant.name}...`)
        ),
        take(8)
      )
    )
  );
};

module.exports = {
  retryable
};
