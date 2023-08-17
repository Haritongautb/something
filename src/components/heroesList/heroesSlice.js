import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from '../../hooks/http.hook';

const heroesAdapter = createEntityAdapter();
// const initialState = {
//     heroes: [],
//     heroesLoadingStatus: 'idle'
// }

const initialState = heroesAdapter.getInitialState({
    heroesLoadingStatus: 'idle',
});

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    () => {
        const { request } = useHttp();
        // Нельзу использовать useCallback в createAsyncThunk, поэтому функция useHttp() не обернут в useCallback в файле http.hook.js
        return request("http://localhost:3001/heroes");
    },
)
const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        // Эти actions все равно больше нигде не применяются, а в extraReducers не создается actions, а реакиии на запросы от createAsyncThunk
        /*         heroesFetching: state => { state.heroesLoadingStatus = 'loading' },
                heroesFetched: (state, action) => {
                    state.heroes = action.payload;
                    state.heroesLoadingStatus = 'idle';
                },
                heroesFetchingError: state => {
                    state.heroesLoadingStatus = 'error';
                }, */

        // reducer и prepare это как предварительная подхотовка для отправки в reducer. Это что-то типа второй параметр для createAction. Второй параметр в createAction принимает функцию callback для предварительной подготовки чтобы отправить его в reducer
        // Только здесь у нас сначала приходит в prepare. Prepare получает какие-то параметры (если есть) и возвращает payload
        /*         const addTodo = createAction('todos/add', function prepare(text) {
                    return {
                        payload: {
                            text,
                            id: nanoid(),
                            createdAt: new Date().toISOString(),
                        },
                    }
                })
                
                console.log(addTodo('Write more docs')) */
        heroCreated: {
            reducer: (state, action) => {
                // Метод push меняет старый массив, и это влияет на иммутабельность, мы по сути меняем старый массив, но благодаря плагин, который есть в toolkit, этот плагин дает нам возможность делать иммутабельные манипуляции с reducer 
                heroesAdapter.addOne(state, action.payload)
            },
            prepare: (data) => {
                /* Что-то типа того, и после этого срабатывает метод reducer и получает что вернет prepare
                    const id = nanoid();
                    return {payload: {...data, id}}
                
                */
                return { payload: data }
            }
        },
        heroDeleted: (state, action) => {
            // state.heroes = state.heroes.filter(item => item.id !== action.payload)
            heroesAdapter.removeOne(state, action.payload);
        },
    },
    // I.
    // Для асинхронных запросов, точнее для fetchHeroes
    // II.
    // extraReducers позволяет нам реагировать на действие в нашем heroesSlice, но extraReducers не создает функцию создания действия
    // III.
    // то есть при отправки request потом в then мы писали then(data => dispatch(heroesFetched(data))) и catch(error => dispatch(heroesFetchingError(error))). и extraReducers просто реагирует на те действия, которые нужно сделать при отправки запроса, получении запроса, ошибки.
    // IV.
    // В extraReducers не создается actions, а реакиии на запросы от createAsyncThunk
    // V.
    // Вы бы использовали extraReducers, когда имеете дело с действием, которое вы уже определили (к примеру в том же reducers сверху или на действия от других createSlice от других reducer в других файлах или от других отдельных createAction) где-то еще. Наиболее распространенными примерами являются реакция на createAsyncThunkдействие и реакция на действие из другого фрагмента.
    extraReducers: (builder) => {
        // Это реакции при запроса createAsyncThunk на уже созданные actios сверху в reducers. Просто раньше были switch, а теперь мы не можем к ним обратиться, поэтому прописываем сценарии/реакции при реализации или запроса от createAsyncThunk
        // В папке reducers в filters и heroes есть пример как создается createReducer
        // В addCase(какой-то createAction, (action. payload) => {state.какое-то состояние redux = action.payload или "что-то"})
        // пример createAction - const heroFetching = createAction('HERO_FETCHING');
        builder
            // createSyncThunk - возвращаем нам три createAction - это pending, fulfilled, rejected
            // pending - когда запрос отправляется
            .addCase(fetchHeroes.pending, state => { state.heroesLoadingStatus = 'loading' })
            // fulfilled - когда запрос был отправлен успешно
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                state.heroesLoadingStatus = 'idle';
                heroesAdapter.setAll(state, action.payload)
            })
            .addCase(fetchHeroes.rejected, state => {
                state.heroesLoadingStatus = 'error';
            })
            .addDefaultCase(() => { })
    }
})

const { actions, reducer } = heroesSlice;

export default reducer;

// по сути  getSelectors возвращает объект с методами и один из них selectAll и они как бы при вызове пойдут по ссылке и вытащат state.heroes
const { selectAll } = heroesAdapter.getSelectors(state => state.heroes);

export const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    selectAll,
    (filter, heroes) => {
        if (filter === "all") {
            return heroes;
        } else {
            return heroes.filter(item => item.element === filter)
        }
    }
);

export const {
    // heroesFetching,
    // heroesFetched,
    // heroesFetchingError,
    heroDeleted,
    heroCreated
} = actions;