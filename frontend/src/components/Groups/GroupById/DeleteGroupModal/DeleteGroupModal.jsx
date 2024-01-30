import { useDispatch } from 'react-redux';
import { removeGroup } from '../../../../store/groups';
import { useModal } from '../../../../context/Modal';
import './DeleteGroupModal.css'

function DeleteGroupModal({ group, handleDeleteGrp }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    function handleDelete(e) {
        e.preventDefault()
        return dispatch(removeGroup(group))
        .then(closeModal())
        .then(handleDeleteGrp())
    }

    function handleCancel(e) {
        e.preventDefault()
        closeModal()
    }

    return (
        <div id='delete-group-modal'>
            <h1>Confirm Delete</h1>
            <h2 id="confirmation-text"> Are you sure you want to remove this group?</h2>
            <button id='confirm-delete' onClick={handleDelete}>Yes, {`(Delete Group)`}</button>
            <button id='keep-group' onClick={handleCancel}>No, {`(Keep Group)`}</button>
        </div>
    );
}

export default DeleteGroupModal;
