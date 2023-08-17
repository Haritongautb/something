import { createReducer } from "@reduxjs/toolkit";

// Для использования createReducer импортируем сюда все createAction
import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} from "../actions";

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
}

// II. вариант createReducer
const heroes = createReducer(initialState, {
    // нельзя писать так return state.heroesStatusLoading = 'loading';или state => state.heroesStatusLoading = 'loading'; - поскольку toolkit будет думать, что манипуляция над иммутабельностью не нужно проводить. Внутри toolkit уже есть втроенный плагин  и он сам понимает, что нужно проводить манипуляции для иммутабельности, поэтому мы можем писать иммутабельный код
    // toolkit сам понимает, как нужно делать иммутабельные манипуцляции, поэтому здесь не нужно делать жеструктуризацию или возвращать прежнее состояния
    [heroesFetching]: state => {
        state.heroesLoadingStatus = 'loading'
    },
    [heroesFetched]: (state, action) => {
        state.heroes = action.payload;
        state.heroesLoadingStatus = 'idle';
    },
    [heroesFetchingError]: state => {
        state.heroesLoadingStatus = 'error';
    },
    [heroCreated]: (state, action) => {
        // Метод push меняет старый массив, и это влияет на иммутабельность, мы по сути меняем старый массив, но благодаря плагин, который есть в toolkit, этот плагин дает нам возможность делать иммутабельные манипуляции с reducer 
        state.heroes.push(action.payload);
    },
    [heroDeleted]: (state, action) => {
        state.heroes = state.heroes.filter(item => item.id !== action.payload)
    },
},
    [],
    state => state
)

// I вариант createReducer
/* const heroes = createReducer(initialState, builder => {
    builder
        .addCase(heroesFetching, state => {
            // нельзя писать так return state.heroesStatusLoading = 'loading';или state => state.heroesStatusLoading = 'loading'; - поскольку toolkit будет думать, что манипуляция над иммутабельностью не нужно проводить
            // toolkit сам понимает, как нужно делать иммутабельные манипуцляции, поэтому здесь не нужно делать жеструктуризацию или возвращать прежнее состояния
            state.heroesStatusLoading = 'loading';
        })
        .addCase(heroesFetched, (state, action) => {
            // toolkit сам понимает, как нужно делать иммутабельные манипуцляции, поэтому здесь не нужно делать жеструктуризацию или возвращать прежнее состояния
            state.heroes = action.payload;
            state.heroesLoadingStatus = 'idle';
        })
        .addCase(heroesFetchingError, state => {
            state.heroesLoadingStatus = 'error';
        })
        .addCase(heroCreated, (state, action) => {
            // Метод push меняет старый массив, и это влияет на иммутабельность, мы по сути меняем старый массив, но благодаря плагин, который есть в toolkit, этот плагин дает нам возможность делать иммутабельные манипуляции с reducer 
            state.heroes.push(action.payload);
        })
        .addCase(heroDeleted, (state, action) => {
            state.heroes = state.heroes.filter(item => item.id !== action.payload)
        })
        .addDefaultCase(() => { });
}) */

// const heroes = (state = initialState, action) => {
//     switch (action.type) {
//         case 'HEROES_FETCHING':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'loading'
//             }
//         case 'HEROES_FETCHED':
//             return {
//                 ...state,
//                 heroes: action.payload,
//                 heroesLoadingStatus: 'idle'
//             }
//         case 'HEROES_FETCHING_ERROR':
//             return {
//                 ...state,
//                 heroesLoadingStatus: 'error'
//             }
//         case 'HERO_CREATED':
//             // Формируем новый массив    
//             let newCreatedHeroList = [...state.heroes, action.payload];
//             return {
//                 ...state,
//                 heroes: newCreatedHeroList,
//             }
//         case 'HERO_DELETED':
//             return {
//                 ...state,
//                 heroes: state.heroes.filter(item => item.id !== action.payload)
//             }
//         default: return state
//     }
// }

export default heroes;