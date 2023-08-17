import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

// const initialState = {
//     filters: [],
//     filtersLoadingStatus: 'idle',
//     activeFilter: 'all',
// };

const heroesFiltersAdapter = createEntityAdapter();

const initialState = heroesFiltersAdapter.getInitialState({
    filtersLoadingStatus: 'idle',
    activeFilter: 'all',
})

export const fetchFilters = createAsyncThunk(
    'filters/fetchFilters',
    () => {
        const { request } = useHttp();
        return request("http://localhost:3001/filters");
    }
)

const heroesFiltersSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        // filtersFetching: state => {
        //     state.filtersLoadingStatus = "loading";
        // },
        // filtersFetched: (state, action) => {
        //     state.filters = action.payload;
        //     state.filtersLoadingStatus = "idle";
        // },
        // filtersFetchingError: state => {
        //     state.filtersLoadingStatus = "error";
        // },
        activeFilterChanged: (state, action) => {
            state.activeFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilters.pending, state => {
                state.filtersLoadingStatus = 'loading'
            })
            .addCase(fetchFilters.fulfilled, (state, action) => {
                state.filtersLoadingStatus = 'idle'
                heroesFiltersAdapter.setAll(state, action.payload)
            })
            .addCase(fetchFilters.rejected, state => {
                state.filtersLoadingStatus = 'error';
            })
            .addDefaultCase(() => { })
    }
})

const { actions, reducer } = heroesFiltersSlice;

export default reducer;

export const { selectAll } = heroesFiltersAdapter.getSelectors(state => state.filters);

export const {
    // filtersFetching,
    // filtersFetched,
    // filtersFetchingError,
    activeFilterChanged
} = actions;