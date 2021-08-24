import produce, { enableES5 } from 'immer';

const es5Produce = (...args) => {
    enableES5();
    return produce(...args);
};

export default es5Produce;
