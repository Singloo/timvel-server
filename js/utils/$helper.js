import { from, throwError, of } from 'rxjs';
import { retryWhen, concatMap, delay } from 'rxjs/internal/operators';
const HTTP_DEFAULT_RES = res => () => res.status(200).send();
const HTTP_DEFAULT_ERROR_HANDLER = res => error => {
  console.warn(error);
  res.status(500).send({
    success: false,
    message: error.message || 'error',
  });
};
const EMPTY_FUNCTION = () => {};
const LOG_ERROR = error => console.warn(error);
const retry3 = (promise, { delayTime = 100, times = 1 } = {}) =>
  from(promise).pipe($retryWhenDelay(delayTime, times));

const $retryWhenDelay = (delayTime = 100, times = 1) =>
  retryWhen(err =>
    err.pipe(
      delay(delayTime),
      concatMap((error, index) =>
        index < times ? of(null) : throwError(error),
      ),
    ),
  );
const HANDLER = (successHandler, errorHandler) => ({
  next: successHandler || EMPTY_FUNCTION,
  error: errorHandler || LOG_ERROR,
});

export { retry3, $retryWhenDelay, HANDLER };
