import { useState, useCallback } from 'react';

const useInput = (initialValue, getValue = (e) => e.target.value) => {
    const [value, setValue] = useState(initialValue);

    const handler = useCallback(
        (...arg) => setValue(getValue(...arg)),
        [],
    );

    return [value, handler, setValue];
};

export default useInput;
