import { NavLink } from 'react-router-dom'
import Group from './Group/Group'

function Groups() {
    return (
        <>
        <div className='groups-header'>
            <div className="event-group-nav">
                <NavLink to='/events' className='events-link inactive'>Events</NavLink>
                <NavLink to='/groups' className='groups-link active'>Groups</NavLink>
            </div>
            <p>Groups in Groupup</p>
        </div>
            <Group/>
        </>
    );
    }

export default Groups