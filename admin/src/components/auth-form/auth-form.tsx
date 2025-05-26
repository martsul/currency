import { produce } from "immer";
import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { api } from "../../api";
import { useLoading } from "../../contexts/loading-context/use-loading";
import type { AxiosError } from "axios";
import { useAuth } from "../../contexts/auth-context/use-auth";

type Fields = { name: string; password: string };

type AuthResponse = { accessToken: string };

export const AuthForm = () => {
    const { setAuthToken } = useAuth();
    const { startLoading, stopLoading } = useLoading();
    const [fields, setFields] = useState<Fields>({ name: "", password: "" });
    const [error, setError] = useState<string | null>(null);

    const onSubmit = () => {
        startLoading();
        api.post<AuthResponse>("/auth", fields)
            .then((response) => {
                setError(null);
                setAuthToken(response.data.accessToken);
                sessionStorage.setItem(
                    "accessToken",
                    response.data.accessToken
                );
            })
            .catch((rejected: AxiosError<{ message: string }>) => {
                setError(rejected.response?.data.message || "Unknown Error");
            })
            .finally(() => stopLoading());
    };

    return (
        <section>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
                }}
                className="d-flex flex-column gap-4"
            >
                <Form.Label>
                    <p className="mb-1">Name</p>
                    <Form.Control
                        onChange={(e) => {
                            setFields(
                                produce((draft) => {
                                    draft.name = e.target.value;
                                })
                            );
                        }}
                        value={fields.name}
                    />
                </Form.Label>
                <Form.Label>
                    <p className="mb-1">Password</p>
                    <Form.Control
                        value={fields.password}
                        onChange={(e) => {
                            setFields(
                                produce((draft) => {
                                    draft.password = e.target.value;
                                })
                            );
                        }}
                        type="password"
                    />
                </Form.Label>
                <Button type="submit">Log In</Button>
            </Form>
        </section>
    );
};
