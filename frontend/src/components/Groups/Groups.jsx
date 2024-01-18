import { NavLink } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import {fetchGroups} from '../../store/groups'
import { useEffect } from 'react'

function Groups() {
    const dispatch = useDispatch()
    const groups = useSelector((state) => state.groups.groups.Groups);

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);
    
    const groupArray = groups && groups.map((group) => {console.log(group)})



    return (
        <>
        <div className='groups-header'>
            <div className="event-group-nav">
                <button>test</button>
                <NavLink to='/events' className='events-link inactive'>Events</NavLink>
                <NavLink to='/groups' className='groups-link active'>Groups</NavLink>
            </div>
            <p>Groups in Groupup</p>
        </div>
        </>
    );
    }

export default Groups