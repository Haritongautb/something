import { createAction, nanoid } from "@reduxjs/toolkit";
// import { heroesFetching, heroesFetched, heroesFetchingError } from "../components/heroesList/heroesSlice";
// import { filtersFetching, filtersFetched, filtersFetchingError } from "../components/heroesFilters/heroesFiltersSlice";

// Во вторую переменную функции createAction можно передать функцию для предварительной подготовки payload. В документации вторая переменная для функции createAction так и называется - подготовительный callback
const addTodo = createAction('todos/add', function prepare(text) {
    return {
        payload: {
            text,
            id: nanoid(),
            createdAt: new Date().toISOString(),
        },
    }
})

console.log(addTodo('Write more docs'))

// export const heroesFetching = () => {
//     return {
//         type: 'HEROES_FETCHING'
//     }
// }

// export const heroesFetching = createAction('HEROES_FETCHING');

// export const heroesFetched = (heroes) => {
//     return {
//         type: 'HEROES_FETCHED',
//         payload: heroes
//     }
// }

// аргумент приходящий в createAction автоматически подставляется в payload, не нужно писать payload: heroes
// Старайся передавать не больше одной переменной в createAction, и эта первая переменная - всегда строка, так как данные приходящие в heroesFetched автоматически подставится в payload
// export const heroesFetched = createAction("HEROES_FETCHED");

// export const heroesFetchingError = () => {
//     return {
//         type: 'HEROES_FETCHING_ERROR'
//     }
// }
// export const heroesFetchingError = createAction('HEROES_FETCHING_ERROR');

// export const fetchFilters = (request) => (dispatch) => {
//     dispatch(filtersFetching);
//     request("http://localhost:3001/filters")
//         .then(data => dispatch(filtersFetched(data)))
//         .catch(() => dispatch(filtersFetchingError()))
// }

export const filtersFetching = createAction("FILTERS_FETCHING");
export const filtersFetched = createAction("FILTERS_FETCHED");
export const filtersFetchingError = createAction('FILTERS_FETCHING_ERROR');
// export const filtersFetching = () => {
//     return {
//         type: 'FILTERS_FETCHING'
//     }
// }

// export const filtersFetched = (filters) => {
//     return {
//         type: 'FILTERS_FETCHED',
//         payload: filters
//     }
// }

// export const filtersFetchingError = () => {
//     return {
//         type: 'FILTERS_FETCHING_ERROR'
//     }
// }

// I.
/* export const activeFilterChanged = (filter) => (dispatch) => {
    ReduxThunk автоматически подставит dispatch, не нужно его импортироватью.Благодаря тому, что при вызове middleware, теперь наш dispatch может принять функцию, вместо объекта.Теперь мы можем расширить нашу функциональностью, так как теперь возвращается какая - то функция и мы можем делать какие - то манипуляции
    Теперь dispatch сработает только через 1 секунду, так как мы возвращаем функцию setTimeout, так как наш middleware позволяет dispatch вернуть не только объект
    setTimeout(() => {
        dispatch({
            type: 'ACTIVE_FILTER_CHANGED',
            payload: filter
        })
    }, 1000)
} */

// export const activeFilterChanged = (filter) => {
//     return {
//         type: 'ACTIVE_FILTER_CHANGED',
//         payload: filter
//     }
// }

// II.
// плюс middleware - теперь не нужно в компоненте писать столько, наш middleware будет принимать всю внутренность fetchHeroes, так  как наш dispatch принимает может принять функцию
/* export const fetchHeroes = (request) => (dispatch) => {
    // Наш middleware stringMiddleware также может принимать строку вместо объекта и обработать его
    // либо так
    // dispatch("HEROES_FETCHING");
    // либо так
    dispatch(heroesFetching());
    request("http://localhost:3001/heroes")
        .then(data => dispatch(heroesFetched(data)))
        .catch(() => dispatch(heroesFetchingError()))
} */

// export const heroCreated = (hero) => {
//     return {
//         type: 'HERO_CREATED',
//         payload: hero
//     }
// }

// export const heroCreated = createAction('HERO_CREATED');

// export const heroDeleted = (id) => {
//     return {
//         type: 'HERO_DELETED',
//         payload: id
//     }
// }

// export const heroDeleted = createAction('HERO_DELETED');