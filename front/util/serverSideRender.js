import axios from 'axios';
import { END } from 'redux-saga';

const serverSideRender = (fn) => async (context) => {
    const cookie = context.req && context.req.headers.cookie ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = cookie;

    fn(context);

    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
};

export default serverSideRender;
