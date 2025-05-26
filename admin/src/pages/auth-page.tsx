import { Container } from "react-bootstrap";
import { AuthForm } from "../components/auth-form/auth-form";

export const AuthPage = () => {
    return (
        <Container className="mt-5">
            <AuthForm />
        </Container>
    );
};
