// import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
// import ReduxThunk from "redux-thunk";
// import heroes from '../reducers/heroes';
// Использование createSlice
import heroes from "../components/heroesList/heroesSlice";
import filters from '../components/heroesFilters/heroesFiltersSlice';

// const enhancer = (createStore) => (...args) => {
//     const store = createStore(...args);

//     const oldDispatch = store.dispatch;

//     store.dispatch = (action) => {
//         if (typeof action === "string") {
//             return oldDispatch({
//                 type: action
//             })
//         }

//         return oldDispatch(action);
//     }

//     return store;
// }

// На всякий случай, если вместо {type: "HEROES_FETCHING", action: payload} придет просто "HEROES_FETCHING";
// Это просто настройка нашего store. Мы немного модифицруем нашего store. В store уже существует метод dispatch и в oldDIspatch есть сссылка на него - store.dispatch. Мы это делаем, чтобы достать уже существущий метод, чтобы передать ему нашу строку, который к не будет объектом, как store и ожидает
// Ngthm в store.dispatch - мы немного модифицируем его и он может вернуть нам действие, если мы отправим не объект {type: "HEROES_FETCHING", action: payload} - а просто строку "HEROES_FETCHING"
// enhancer - это функция, позволяющая добавить к хранилищу дополнительный функционал. 
function enhancer(createStore) {
    return function (...args) {
        const store = createStore(...args);

        const oldDispatch = store.dispatch;

        store.dispatch = (action) => {
            if (typeof action === "string") {
                return oldDispatch({
                    type: action
                })
            }

            return oldDispatch(action);
        }

        return store;
    }
}


// middleware - меняет только dispatch
/* это возможность выполнить какие-то действия до того, как будет выполнен dispatch (либо можно заблокировать вызов последнего). А dispatch, как вы знаете, запускает reducer. */
//  с помощью middleware мы можем передавать через dispatch не только объект или вызова функции, но и функцию напрямую в dispatch типа (dispatch(heroesFetching))
//  На что можно заменить в первом аргументе при входе
//{ dispatch, getState }
// store
// ()
// то наш ручной middleware, а так практически никто сам не пишет, а используют уже готовые плагины, к примеру ReduxThunk

/* export const activeFilterChanged = (filter) => (dispatch) => {
    ReduxThunk автоматически подставит dispatch, не нужно его импортироватью. Благодаря тому, что при вызове middleware, теперь наш dispatch может принять функцию, вместо объекта. Теперь мы можем расширить нашу функциональностью, так как теперь возвращается какая-то функция и мы можем делать какие-то манипуляции
    setTimeout(() => {
        dispatch({
            type: 'ACTIVE_FILTER_CHANGED',
            payload: filter
        })
    }, 1000)
} */

// Этот наш stringMiddleware - может принять строку в dispatch. Чтобы можно было его использовтаь нужно добавить в appleMiddleware
// на самом деле можно делать любые middleware для проверки чего-либо, чтобы когда dispatch принимал и пропускал нужные dispatch или слова если мы в dispatch передаем string в state, то можно сделать проверку этого string? чтобы он не дошел до state
function stringMiddleware() {
    return function (next) {
        return function (action) {
            if (typeof action === "string") {
                return next({
                    type: action
                })
            }

            return next(action);
        }
    }
}

// Это просто пример
// middleware для проверки слов к примеру, который не пропускает маты для хранения в state 
// Только не забудль добавить его в applyMiddleware
const badWords = ['MotherFuckers', 'Sucker']
const errorOn = (text) => {
    return dispatch => {
        dispatch({
            type: "ERROR_DISPLAY_ON",
            text
        })

        setTimeout(() => {
            dispatch("ERROR_DISPLAY_OFF");
        }, 2000)
    }
}

function noBadWordsMiddleware(store) {
    return function (next) {
        return function (action) {
            if (typeof action === "string" && action === "HEROES_FETCHING") {
                console.log("here");
                return next({
                    type: action
                })
                // if (action.type === "Heroes_FETCHING") {
                //     const hasBadWords = badWords.some(res => action.data.text.includes(res))
                //     if (hasBadWords) {
                //         return store.dispatch(errorOn("Уважайте людей"))
                //         console.log()
                //     }
                // }
            }

            return next(action);
        }
    }
}
// 

// Без использования toolkit
// ReduxThunk - позволяет делать асинхронные операции
// const store = createStore(
// combineReducers({ heroes: heroes, filters: filters }),
/*     applyMiddleware – это функция из библиотеки redux. Функция реализует store enhancer (расширитель хранилища… не знаю, как по-русски это обозвать, пусть будет так). */
/*     applyMiddleware принимает в качестве параметров одну или более функций, составляет из этих функций цепочку вызовов (в цепочку входит оригинальный dispatch) и заменяет в store оригинальный dispatch на результирующую цепочку. */
// compose(applyMiddleware(ReduxThunk, stringMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// compose(applyMiddleware(stringMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// compose(
//         enhancer, 
//         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// );

// Использование toolkit
const store = configureStore({
    reducer: { heroes, filters },
    // ReduxThunk уже включен в redux toolkit
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== "production",
})

export default store;