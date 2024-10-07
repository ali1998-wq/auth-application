import React from 'react';
import styles from "./contentModal.module.scss";
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../stateManagement/slices/modalslice';


function ContentModal() {
  const contentModal= useSelector(state => state.modal.contentModal);
  const content= useSelector(state => state.content.contentDetails);
  const dispatch= useDispatch();
  return (
    <Dialog visible={contentModal} style={{ width: '50vw' }} onHide={()=>dispatch(closeModal())}>
        <div className={styles.container}>
            <h1>{content?.title}</h1>
            <p>{content?.description}</p>
            <p>{content?.body}</p>
        </div>
    </Dialog>
  )
}

export default ContentModal