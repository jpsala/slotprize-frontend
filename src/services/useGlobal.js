import { reactive, toRefs, readonly } from 'vue';
// import axios from 'axios';

const state = reactive({
    menuItem: undefined,
});
export default () => {
    const setMenuItem = (value) => {
        state.menuItem = value;
    };
    return { setMenuItem, ...toRefs(readonly(state)) };
};
