import React, { useState, useEffect, useRef } from "react";
import PrimeReact from "primereact/api";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Chips } from "primereact/chips";
import { Chip } from "primereact/chip";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import axios from "axios";

import "./styles/DataTable.css";

PrimeReact.ripple = true;

const baseAPI = process.env.REACT_APP_SERVER_URL;

function App() {
  let emptyUser = {
    _id: null,
    name: "",
    email: "",
    phoneNumber: "",
    hobbies: [],
  };

  const [users, setUsers] = useState(null);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      await fetchUsers();
    })();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseAPI}/user`);
      setUsers(
        res.data.data.map((user, index) => {
          return { ...user, sl: index + 1 };
        })
      );
      console.log(res.data);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Unable to fetch users",
        life: 3000,
      });
    }
    setIsLoading(false);
  };

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  };

  const saveUser = async () => {
    setSubmitted(true);
    console.log(user);
    try {
      const body = {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        hobbies: user.hobbies,
      };
      if (user._id === null) {
        await axios.post(`${baseAPI}/user`, { ...body });
      } else {
        await axios.put(`${baseAPI}/user?id=${user._id}`, { ...body });
      }
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Users Saved",
        life: 3000,
      });
      await fetchUsers();
      setUserDialog(false);
      setUser(emptyUser);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Unable to save user",
        life: 3000,
      });
    }
  };

  const editUser = async (user) => {
    setUser({ ...user });
    setUserDialog(true);
  };

  const confirmDeleteUser = async (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`${baseAPI}/user?id=${user._id}&bulk=false`);

      await fetchUsers();
      setDeleteUserDialog(false);
      setUser(emptyUser);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Deleted",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Unable to delete user",
        life: 3000,
      });
    }
  };

  const deleteSelectedUsers = async () => {
    try {
      const ids = selectedUsers.map((user) => user._id);
      await axios.delete(`${baseAPI}/user?id=${JSON.stringify(ids)}&bulk=true`);
      await fetchUsers();
      setDeleteUsersDialog(false);
      setSelectedUsers(null);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Users Deleted",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Unable to delete users",
        life: 3000,
      });
    }
  };

  const sendMail = async (row) => {
    try {
      console.log(row);
      await axios.post(`${baseAPI}/user/send-mail`, {
        id: [row._id],
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

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...user };
    _product[`${name}`] = val;

    setUser(_product);
  };

  const leftToolbarTemplate = () => {
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
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-inbox"
          className="p-button-rounded p-button-info mr-2"
          onClick={() => sendMail(rowData)}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editUser(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteUser(rowData)}
        />
      </React.Fragment>
    );
  };

  const hobbiesBodyTemplate = (rowData) => {
    return (
      <>
        {rowData.hobbies.map((hobby) => {
          return <Chip label={hobby} className="m-1" />;
        })}
      </>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1 text-xl">Manage Users</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const userDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveUser}
      />
    </React.Fragment>
  );

  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteUser}
      />
    </React.Fragment>
  );

  const deleteUsersDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteUsersDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedUsers}
      />
    </React.Fragment>
  );

  return (
    <div className="grid-nogutter h-screen w-screen">
      <div className="col-12 md:col-10 mx-auto datatable-crud-demo">
        <Toast ref={toast} />
        <div className="card">
          <Toolbar className="mb-4" center={leftToolbarTemplate}></Toolbar>

          <DataTable
            scrollable
            scrollHeight="400px"
            loading={isLoading}
            ref={dt}
            value={users}
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
            globalFilter={globalFilter}
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
              exportable={false}
            ></Column>
            <Column
              field="sl"
              header="SL"
              sortable
              style={{ minWidth: "4rem" }}
            // align="center"
            ></Column>
            <Column
              field="name"
              header="Name"
              sortable
              style={{ minWidth: "12rem" }}
            // align="center"
            ></Column>
            <Column
              field="email"
              header="Email"
              sortable
              style={{ minWidth: "14rem" }}
            // align="center"
            ></Column>
            <Column
              field="phoneNumber"
              header="Phone Number"
              sortable
              style={{ minWidth: "12rem" }}
            // align="center"
            ></Column>
            <Column
              field="hobbies"
              header="Hobbies"
              sortable
              body={hobbiesBodyTemplate}
              style={{ minWidth: "16rem", maxWidth: "16rem" }}
            // align="center"
            ></Column>
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "12rem" }}
            // align="center"
            ></Column>
          </DataTable>
        </div>

        <Dialog
          visible={userDialog}
          style={{ width: "450px" }}
          header="User Details"
          modal
          className="p-fluid"
          footer={userDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label htmlFor="name">Name</label>
            <InputText
              id="name"
              value={user.name}
              onChange={(e) => onInputChange(e, "name")}
              required
              autoFocus
              className={classNames({ "p-invalid": submitted && !user.name })}
            />
            {submitted && !user.name && (
              <small className="p-error">Name required.</small>
            )}
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={user.email}
              onChange={(e) => onInputChange(e, "email")}
              required
              autoFocus
              type="email"
              className={classNames({ "p-invalid": submitted && !user.email })}
            />
            {submitted && !user.email && (
              <small className="p-error">Email required.</small>
            )}
          </div>
          <div className="field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <InputText
              id="phoneNumber"
              value={user.phoneNumber}
              onChange={(e) => onInputChange(e, "phoneNumber")}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && !user.phoneNumber,
              })}
            />
            {submitted &&
              (!user.phoneNumber || user.phoneNumber.length !== 10) && (
                <small className="p-error">
                  10 Digit Phone Number required.
                </small>
              )}
          </div>
          <div className="field">
            <label htmlFor="hobbies">Hobbies</label>
            <InputText
              id="hobbies"
              value={user.hobbies}
              onChange={(e) => {
                onInputChange(e, "hobbies");
              }}
              required
              autoFocus
              className={classNames({
                "p-invalid": submitted && user.hobbies.length === 0,
              })}
            />
            {submitted && user.hobbies.length === 0 && (
              <small className="p-error">Hobbies required.</small>
            )}
          </div>
        </Dialog>

        <Dialog
          visible={deleteUserDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteUserDialogFooter}
          onHide={hideDeleteUserDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {user && (
              <span>
                Are you sure you want to delete <b>{user.name}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <Dialog
          visible={deleteUsersDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteUsersDialogFooter}
          onHide={hideDeleteUsersDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {user && (
              <span>Are you sure you want to delete the selected users?</span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}

export default App;
