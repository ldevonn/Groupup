import { useDispatch } from 'react-redux';
import { removeEvent } from '../../../store/events.js';
import { useModal } from '../../../context/Modal.jsx';
// import '../../Groups/GroupById/DeleteGroupModal/DeleteGroupModal.jsx'

function DeleteEventModal({ event, handleDeleteEvnt }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    function handleDelete(e) {
        e.preventDefault()
        return dispatch(removeEvent(event))
        .then(closeModal())
        .then(handleDeleteEvnt())
    }

    function handleCancel(e) {
        e.preventDefault()
        closeModal()
    }

    return (
        <div id='delete-group-modal'>
            <h1>Confirm Delete</h1>
            <h2 id="confirmation-text"> Are you sure you want to remove this event?</h2>
            <button id='confirm-delete' onClick={handleDelete}>Yes, {`(Delete Event)`}</button>
            <button id='keep-group' onClick={handleCancel}>No, {`(Keep Event)`}</button>
        </div>
    );
}

export default DeleteEventModal;
