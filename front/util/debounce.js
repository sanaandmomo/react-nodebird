const debounce = (fn, ms) => {
    let timer;

    return () => {
        if (timer) clearTimeout(timer);

        timer = setTimeout(fn, ms);
    };
};

export default debounce;
