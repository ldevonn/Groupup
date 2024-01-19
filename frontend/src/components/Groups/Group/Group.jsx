import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups } from "../../../store/groups";
import './Group.css'
import { useNavigate } from "react-router-dom";

function Group() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const groups = useSelector((state) => state.groups.groups.Groups);

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const handleClick = (e, group) => {
        e.preventDefault()
        navigate(`/groups/${group.id}`, {state: {group}})
    }

    return (
        <>
        <div className="group">
            {groups && groups.map((group) => (
                <div key={group.id} onClick={(e) => handleClick(e, group)}>
                    <h1 id="name">{group.name}</h1>
                    <p id='location'>{group.city}, {group.state}</p>
                    <p id='details'>{group.about}</p>
                </div>
            ))}
            <img id='image' src="https://media.istockphoto.com/id/1369814693/photo/los-angeles.jpg?s=2048x2048&w=is&k=20&c=6NP3lu8yXQoYTT4v8ot9pgl81pMNc2gZvYD4xD1Y5o8=" alt="Group Image" />
        </div>
        </>
    );
}
export default Group