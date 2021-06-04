type Comparator = (a: any, b: any, index?: number) => boolean;
type ComparatorOrNull = Comparator | null;

function defaultEqualityCheck(a: any, b: any) {
  return Object.is(a, b);
}

function shallowCompare(prev: any, next: any, isEqual: Comparator | ComparatorOrNull[] = defaultEqualityCheck) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }
  var length = prev.length;
  for (var i = 0; i < length; i++) {
    const compare = (Array.isArray(isEqual) ? isEqual[i] : isEqual) || defaultEqualityCheck;
    if (!compare(prev[i], next[i], i)) {
      return false;
    }
  }
  return true;
}

export default function memoize<F extends Function>(func: F, isEqual: Comparator | ComparatorOrNull[]): F {
  let prevArgs: any = null;
  let prevResult: any = null;
  return (function() {
    if (!shallowCompare(prevArgs, arguments, isEqual)) {
      prevResult = func.apply(null, arguments);
    }
    prevArgs = arguments;
    return prevResult;
  } as unknown) as F;
}
