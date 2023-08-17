import { useHttp } from '../../hooks/http.hook';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// в redux-toolkit тоже есть включенный плагин reselect
// import { createSelector } from 'reselect';
// в redux-toolkit тоже есть включенный плагин reselect
// import { createSelector } from "@reduxjs/toolkit";

// import { fetchHeroes } from '../../actions';
import { heroDeleted, fetchHeroes, filteredHeroesSelector } from './heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import './heroesList.scss';
const HeroesList = () => {
    // create Selector вместо useSelector, чтобы при изменении свойство другого компонента, не пересоздавалась функция с const filteredHeroes = useSelector();
    // короче говоря, при каждом клике на фильтры даже если на один и тот же фильтр будет происходить проверка (сработает это - console.log("filteredHeroes") и const filteredHeroes = useSelector будет проверять и функция получается снова вызывается. createSelector дает нам возможность этого избежать, если state.filters.activeFilter не изменится, то она не будет вызывать перерендер компонента. В createSelector работает Мемоизация
    // Если писать как обычно это, то постоянно при клике на один и тот же фильтр будет заново вызываться filteredHeroes и компонент заново перерисовываться
    // const filteredHeroes = useSelector(state => {
    //     console.log("filteredHeroes")
    //     if (state.filters.activeFilter === "all") {
    //         return state.heroes.heroes;
    //     } else {
    //         return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter)
    //     }
    // })
    /*     const filteredHeroesSelector = createSelector(
            // Первый аргумент
            (state) => state.filters.activeFilter,
            // Второй аргумент
            selectAll,
            // Первый аргумент, Второй аргумент
            (filter, heroes) => {
                if (filter === "all") {
                    return heroes;
                } else {
                    return heroes.filter(item => item.element === filter)
                }
            }
        ); */
    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    // Работает замыкание. То есть теперь у компонента, у которого есть request - это его собественный request, потому что сработало замыкание
    const { request } = useHttp();

    useEffect(() => {
        // благодаря ReduxThrunk
        // dispatch(fetchHeroes(request));

        // С использованием reduxAsyncThunk
        // request находится уже в heroesSlice
        dispatch(fetchHeroes());

        // eslint-disable-next-line
    }, []);

    // Функция берет id и по нему удаляет ненужного персонажа из store
    // ТОЛЬКО если запрос на удаление прошел успешно
    // Отслеживайте цепочку действий actions => reducers
    const onDelete = useCallback((id) => {
        // Удаление персонажа по его id
        request(`http://localhost:3001/heroes/${id}`, "DELETE")
            .then(data => console.log(data, 'Deleted'))
            .then(dispatch(heroDeleted(id)))
            .catch(err => console.log(err));
        // eslint-disable-next-line  
        // Работает замыкание. То есть теперь у компонента, у которого есть request - это его собественный request, потому что сработало замыкание
        // И поскольку этот request никак не связан с httpHook, то useCallback срабатывае только, когда мы удаляем кого-то и получаем новое сообщение, и срабатывет функция onDelete
    }, [request]);

    // console.log("list");
    if (heroesLoadingStatus === "loading") {
        return <Spinner />;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return (
                <CSSTransition
                    timeout={0}
                    classNames="hero">
                    <h5 className="text-center mt-5">Героев пока нет</h5>
                </CSSTransition>
            )
        }

        return arr.map(({ id, ...props }, index) => {
            return (
                <CSSTransition
                    key={id}
                    timeout={500}
                    classNames="hero">
                    <HeroesListItem {...props} onDelete={() => onDelete(id)} />
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}


export default HeroesList;