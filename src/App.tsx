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

Amplify.configure(config);

interface Employee {
    id: number;
    name: string;
    dob: string;
    salary: string;
    joined: string;
}

function App(): JSX.Element {
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const [name, setName]: [string, Function] = useState("");
    const [DOB, setDOB]: [string, Function] = useState("");
    const [salary, setSalary]: [string, Function] = useState("");
    const [joined, setJoined]: [string, Function] = useState("");
    const [isLoading, setIsLoading]: [boolean, Function] = useState(true);
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
