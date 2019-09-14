import PageIndex from './pages/Index';
import store from '../../store';

function requireVuexLoaded(to, from, next) {
  store.watch(
    (state, getters) => getters.isVuexLoaded,
    () => {
      next();
    }
  );
}

export default [
  {
    path: '/',
    component: PageIndex,
    beforeEnter: requireVuexLoaded,
  },
];
