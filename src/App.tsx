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
    const [isLoading, setIsLoading]: [boolean, Function] = useState(true);
    const [open, setOpen]: [boolean, Function] = useState(false);
    const [update, setUpdate]: [boolean, Function] = useState(false);
    const [employees, setEmployees]: [Array<Employee>, Function] = useState([]);

    useEffect(() => {
        API.get("employeesapi", "/employees", {}).then((res) => {
            setEmployees([...res]);
            setIsLoading(false);
        });
    }, []);

    const handleAdd = () => {
        setOpen(false);
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
        });
    };

    const handleOpen = (updateItem: boolean, employee?: Employee) => {
        if (updateItem && employee) {
            setUpdate(true);
            setUpdateId(employee.id);
            setName(employee.name);
            setDOB(employee.DOB);
            setSalary(employee.salary);
            setJoined(employee.joined);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setUpdateId(0);
        setName("");
        setDOB("");
        setSalary("");
        setJoined("");
        setUpdate(false);
        setOpen(false);
    };

    const handleUpdate = (id: number) => {
        setOpen(false);
        API.put("employeesapi", `/employees/${id.toString()}`, {
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
                ...employees.filter((employee) => employee.id !== id)
            ]);
        });
        setUpdate(false);
        setUpdateId(0);
        setName("");
        setDOB("");
        setSalary("");
        setJoined("");
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
                    <ul>
                        {employees.map((employee: Employee) => (
                            <li key={employee.id}>
                                {employee.name}{" "}
                                <Button
                                    onClick={() => {
                                        handleOpen(true, employee);
                                    }}
                                >
                                    Update
                                </Button>
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogContent>
                                        <input
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                        <input
                                            value={DOB}
                                            onChange={(e) =>
                                                setDOB(e.target.value)
                                            }
                                        />
                                        <input
                                            value={salary}
                                            onChange={(e) =>
                                                setSalary(e.target.value)
                                            }
                                        />
                                        <input
                                            value={joined}
                                            onChange={(e) =>
                                                setJoined(e.target.value)
                                            }
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                if (update) {
                                                    handleUpdate(updateId);
                                                } else {
                                                    handleAdd();
                                                }
                                            }}
                                        >
                                            {update ? <>Update</> : <>Add</>}
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
                    <Button onClick={() => handleOpen(false, undefined)}>
                        Add Employee
                    </Button>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogContent>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                value={DOB}
                                onChange={(e) => setDOB(e.target.value)}
                            />
                            <input
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                            />
                            <input
                                value={joined}
                                onChange={(e) => setJoined(e.target.value)}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button
                                onClick={() => {
                                    if (update) {
                                        handleUpdate(updateId);
                                    } else {
                                        handleAdd();
                                    }
                                }}
                            >
                                {update ? <>Update</> : <>Add</>}
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Button onClick={signOut}>Sign Out</Button>
                </div>
            )}
        </div>
    );
}

export default withAuthenticator(App);
