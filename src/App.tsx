import React, { useEffect, useState } from "react";
import Amplify, { API } from "aws-amplify";
import {
    withAuthenticator,
    useAuthenticator,
    Heading
} from "@aws-amplify/ui-react";
import { Button } from "reactstrap";
import config from "./aws-exports";
import "@aws-amplify/ui-react/styles.css";
import {
    Dialog,
    DialogActions,
    DialogContent,
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
    TextField,
    Box
} from "@mui/material";

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
                <Box sx={{ p: 5, ml: 5 }}>
                    <Heading>Loading...</Heading>
                </Box>
            ) : (
                <Box sx={{ p: 5, display: "flex", flexWrap: "wrap" }}>
                    <Box sx={{ ml: 5, pb: 2 }}>
                        <Heading>Hello {user.username}</Heading>
                    </Box>
                    <div className="container border border-secondary rounded center">
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Date of Birth</TableCell>
                                    <TableCell>Salary</TableCell>
                                    <TableCell>Joining Date</TableCell>
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {employees.map((employee: Employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>{employee.name}</TableCell>
                                        <TableCell>{employee.DOB}</TableCell>
                                        <TableCell>{employee.salary}</TableCell>
                                        <TableCell>{employee.joined}</TableCell>
                                        <TableCell>
                                            <Button
                                                className="btn btn-lg btn-info"
                                                onClick={() => {
                                                    handleOpen(true, employee);
                                                }}
                                            >
                                                Update
                                            </Button>
                                            <Dialog
                                                open={open}
                                                onClose={handleClose}
                                            >
                                                <DialogContent>
                                                    <Box
                                                        sx={{
                                                            display: "flex"
                                                        }}
                                                    >
                                                        <Box sx={{ p: 1 }}>
                                                            <TextField
                                                                label="Name"
                                                                value={name}
                                                                onChange={(e) =>
                                                                    setName(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </Box>
                                                        <Box sx={{ p: 1 }}>
                                                            <TextField
                                                                label="Date of Birth"
                                                                value={DOB}
                                                                onChange={(e) =>
                                                                    setDOB(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </Box>
                                                        <Box sx={{ p: 1 }}>
                                                            <TextField
                                                                label="Salary"
                                                                value={salary}
                                                                onChange={(e) =>
                                                                    setSalary(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </Box>
                                                        <Box sx={{ p: 1 }}>
                                                            <TextField
                                                                label="Joining Date"
                                                                value={joined}
                                                                onChange={(e) =>
                                                                    setJoined(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </Box>
                                                    </Box>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button
                                                        className="btn btn-lg btn-danger"
                                                        onClick={handleClose}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        className="btn btn-lg btn-success"
                                                        onClick={() => {
                                                            if (update) {
                                                                handleUpdate(
                                                                    updateId
                                                                );
                                                            } else {
                                                                handleAdd();
                                                            }
                                                        }}
                                                    >
                                                        {update ? (
                                                            <>Update</>
                                                        ) : (
                                                            <>Add</>
                                                        )}
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                className="btn btn-lg btn-danger"
                                                onClick={() => {
                                                    handleDelete(employee.id);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Box sx={{ ml: 4, mt: 2, display: "flex" }}>
                        <Box sx={{ mr: 1 }}>
                            <Button
                                className="btn btn-lg btn-success"
                                onClick={() => handleOpen(false, undefined)}
                            >
                                Add Employee
                            </Button>
                        </Box>
                        <Box sx={{ ml: 1 }}>
                            <Button className="btn btn-lg" onClick={signOut}>
                                Sign Out
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </div>
    );
}

export default withAuthenticator(App);
