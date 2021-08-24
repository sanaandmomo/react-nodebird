const throttle = (fn, ms = 200) => {
    let timer;

    return () => {
        if (timer) return;

        timer = setTimeout(() => {
            fn();
            timer = null;
        }, ms);
    };
};

export default throttle;
