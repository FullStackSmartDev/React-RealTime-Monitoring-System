interface Fetching {
  loading: boolean;
  error: Error | null;
}

export default function<S extends Fetching>(
  reducer: (state: S | undefined, action: Action) => S,
  sent: string,
  success: string,
  fail: string,
) {
  return (state: S | undefined, action: Action): S => {
    if (state !== undefined) {
      switch (action.type) {
        case sent:
          return reducer({ ...state, error: undefined, loading: true }, action);
        case success:
          return reducer({ ...state, error: undefined, loading: false }, action);
        case fail:
          return reducer({ ...state, error: action.payload.error, loading: false }, action);
      }
    }
    return reducer(state, action);
  };
}
