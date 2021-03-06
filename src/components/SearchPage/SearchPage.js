import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Paper, Typography, InputBase, IconButton, makeStyles, useTheme} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import UserCard from '../UserCard/UserCard';

const useStyles = makeStyles(theme => ({
    body: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        width: '100%',
        maxWidth: '100%',
        marginTop: '24px'
    },
    searchContainer: {
        width: '90%',
        maxWidth: '24rem',
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '16px'
    }
}));

function SearchResults(){
    const search = useSelector(state => state.searchResults);
    // will change when we want to update search results
    const refresh = useSelector(state => state.searchChange);
    const results = search.results;
    const term = search.searchTerm;
    const dispatch = useCallback(useDispatch(), []);

    return (
        <>
            <Typography variant='h5' component='h2' paragraph>
                {term &&
                    `${results.length} Result${results.length !== 1 ? 's':''} for ${term}`}
            </Typography>
            { results && results.map((profile, i) => 
                <UserCard key={i} profile={profile} showConnect />) }
        </>
    )
}

export default function SearchPage(){
    const theme = useTheme();
    const classes = useStyles(theme);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchEntered, setSearchEntered] = useState(false);
    const searchChange = useSelector(state => state.searchChange);
    const previousSearchTerm = useSelector(state => state.searchResults.searchTerm);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch({
            type: 'SET_SEARCH_RESULTS',
            payload: {
                results: [],
                searchTerm: ''
            }
        });
    }, []);

    useEffect(()=>{
        dispatch({
            type: 'FETCH_SEARCH',
            payload: {
                searchTerm: previousSearchTerm
            }
        });
    }, [searchChange])

    const onSearch = e => {
        if(searchTerm === '') return;
        e.stopPropagation();
        e.preventDefault();
        dispatch({type: "FETCH_SEARCH", payload: {searchTerm: searchTerm} } );
        setSearchTerm('');
        if(!searchEntered) setSearchEntered(true);
    }

    return(
        <div className={classes.body}>
            <Paper
                component="form"
                className={classes.searchContainer}
                onSubmit={onSearch}
            >
                <InputBase
                    placeholder="Search Users"
                    inputProps={{'aria-label': 'search users'}}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <IconButton type="submit">
                    <SearchIcon />
                </IconButton>
            </Paper>
            {searchEntered && <SearchResults />}
        </div>
    )
}