import { useState, useCallback } from 'react';

const useToggle = (initialValue) => {
    const [value, setValue] = useState(initialValue);

    const handler = useCallback(
        () => setValue((prev) => !prev),
        [],
    );

    return [value, handler, setValue];
};

export default useToggle;
