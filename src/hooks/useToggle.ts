import { useState, useMemo } from 'react';

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  // Defined once, so guaranteed stability
  const setters = useMemo(
    () => ({
      toggle: () => setValue((v) => !v),
      setFalse: () => setValue(false),
      setTrue: () => setValue(true),
      setValue,
    }),
    [setValue]
  );

  // Defined each time the value changes, so less than every render.
  return useMemo(
    () => ({
      ...setters,
      value,
    }),
    [value, setters]
  );
}
