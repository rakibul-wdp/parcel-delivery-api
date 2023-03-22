import React, { useRef, useState } from 'react';
import { Button } from "primereact/button";
import axios from "axios";

const baseAPI = process.env.REACT_APP_SERVER_URL;

const HeaderToolbarTemplate = () => {
  let emptyUser = {
    _id: null,
    name: "",
    email: "",
    phoneNumber: "",
    hobbies: [],
  };

  const [user, setUser] = useState(emptyUser);
  const [submitted, setSubmitted] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const toast = useRef(null);

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const sendMailBulk = async () => {
    try {
      await axios.post(`${baseAPI}/user/send-mail`, {
        id: selectedUsers.map((user) => user._id),
      });
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Mail sent successfully",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Unable to send mail",
        life: 3000,
      });
    }
  };

  return (
    <React.Fragment>
      <Button
        label="New"
        icon="pi pi-plus"
        className="p-button-success mr-2"
        onClick={openNew}
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        className="p-button-danger mr-2"
        onClick={confirmDeleteSelected}
        disabled={!selectedUsers || !selectedUsers.length}
      />
      <Button
        icon="pi pi-inbox"
        className="p-button-info mr-2"
        onClick={sendMailBulk}
        disabled={!selectedUsers || !selectedUsers.length}
      />
    </React.Fragment>
  )
}

export default HeaderToolbarTemplate;