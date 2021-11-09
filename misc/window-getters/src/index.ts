function getFromWindow<T>(name: string): T | undefined {
  let res: T | undefined = undefined;
  if (typeof window !== "undefined" && typeof window[name] !== "undefined") {
    res = window[name];
  }
  return res;
}

export function getNavigator(): Navigator | undefined {
  return getFromWindow<Navigator>("navigator");
}

export function getLocation(): Location | undefined {
  return getFromWindow<Location>("location");
}
