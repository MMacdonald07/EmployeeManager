import React, { useEffect, useState } from "react";
import Amplify, { API } from "aws-amplify";
import {
    withAuthenticator,
    useAuthenticator,
    Button,
    Heading
} from "@aws-amplify/ui-react";
import config from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";
import { Dialog, DialogActions, DialogContent } from "@mui/material";

Amplify.configure(config);

interface Employee {
    id: number;
    name: string;
    DOB: string;
    salary: string;
    joined: string;
}

function App(): JSX.Element {
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const [updateId, setUpdateId]: [number, Function] = useState(0);
    const [name, setName]: [string, Function] = useState("");
    const [DOB, setDOB]: [string, Function] = useState("");
    const [salary, setSalary]: [string, Function] = useState("");
    const [joined, setJoined]: [string, Function] = useState("");
    const [updatedName, setUpdatedName]: [string, Function] = useState("");
    const [updatedDOB, setUpdatedDOB]: [string, Function] = useState("");
    const [updatedSalary, setUpdatedSalary]: [string, Function] = useState("");
    const [updatedJoined, setUpdatedJoined]: [string, Function] = useState("");
    const [isLoading, setIsLoading]: [boolean, Function] = useState(true);
    const [open, setOpen]: [boolean, Function] = useState(false);
    const [employees, setEmployees]: [Array<Employee>, Function] = useState([]);

    useEffect(() => {
        API.get("employeesapi", "/employees", {}).then((res) => {
            setEmployees([...res]);
            setIsLoading(false);
        });
    }, []);

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
        const id: number = new Date().valueOf();

        API.post("employeesapi", "/employees", {
            body: {
                id,
                name,
                DOB,
                salary,
                joined
            }
        }).then(() => {
            setEmployees([
                {
                    id,
                    name,
                    DOB,
                    salary,
                    joined
                },
                ...employees
            ]);
            setName("");
            setDOB("");
            setSalary("");
            setJoined("");
        });
    };

    const handleOpen = (employee: Employee) => {
        setUpdateId(employee.id);
        setUpdatedName(employee.name);
        setUpdatedDOB(employee.DOB);
        setUpdatedSalary(employee.salary);
        setUpdatedJoined(employee.joined);
        setOpen(true);
    };

    const handleClose = () => {
        setUpdateId(0);
        setUpdatedName("");
        setUpdatedDOB("");
        setUpdatedSalary("");
        setUpdatedJoined("");
        setOpen(false);
    };

    const handleUpdate = (id: number) => {
        setOpen(false);
        API.put("employeesapi", `/employees/${id.toString()}`, {
            body: {
                id,
                name: updatedName,
                DOB: updatedDOB,
                salary: updatedSalary,
                joined: updatedJoined
            }
        }).then(() => {
            setEmployees([
                {
                    id,
                    name: updatedName,
                    DOB: updatedDOB,
                    salary: updatedSalary,
                    joined: updatedJoined
                },
                ...employees.filter((employee) => employee.id !== id)
            ]);
        });
    };

    const handleDelete = (id: number) => {
        API.del("employeesapi", `/employees/${id.toString()}`, {}).then(() => {
            setEmployees(employees.filter((employee) => employee.id !== id));
        });
    };

    return (
        <div>
            {isLoading ? (
                <div>
                    <Heading>Loading...</Heading>
                </div>
            ) : (
                <div>
                    <Heading>Hello {user.username}</Heading>
                    <form onSubmit={handleSubmit}>
                        <input
                            value={name}
                            placeholder="Name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            value={DOB}
                            placeholder="Date of Birth"
                            onChange={(e) => setDOB(e.target.value)}
                        />
                        <input
                            value={salary}
                            placeholder="Salary"
                            onChange={(e) => setSalary(e.target.value)}
                        />
                        <input
                            value={joined}
                            placeholder="Date Joined"
                            onChange={(e) => setJoined(e.target.value)}
                        />
                        <button>Add Employee</button>
                    </form>
                    <ul>
                        {employees.map((employee: Employee) => (
                            <li key={employee.id}>
                                {employee.name}{" "}
                                <Button
                                    onClick={() => {
                                        handleOpen(employee);
                                    }}
                                >
                                    Update
                                </Button>
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogContent>
                                        <input
                                            value={updatedName}
                                            onChange={(e) =>
                                                setUpdatedName(e.target.value)
                                            }
                                        />
                                        <input
                                            value={updatedDOB}
                                            onChange={(e) =>
                                                setUpdatedDOB(e.target.value)
                                            }
                                        />
                                        <input
                                            value={updatedSalary}
                                            onChange={(e) =>
                                                setUpdatedSalary(e.target.value)
                                            }
                                        />
                                        <input
                                            value={updatedJoined}
                                            onChange={(e) =>
                                                setUpdatedJoined(e.target.value)
                                            }
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                handleUpdate(updateId);
                                            }}
                                        >
                                            Update
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Button
                                    onClick={() => {
                                        handleDelete(employee.id);
                                    }}
                                >
                                    Delete
                                </Button>
                            </li>
                        ))}
                    </ul>
                    <Button onClick={signOut}>Sign Out</Button>
                </div>
            )}
        </div>
    );
}

export default withAuthenticator(App);
