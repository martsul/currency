import { Container } from "react-bootstrap";
import { Rates } from "../rates/rates";
import { Settings } from "../settings/settings";
import { useAdminContainer } from "./use-admin-container";

export const AdminContainer = () => {
    const { settings, rates } = useAdminContainer();

    return (
        <Container className="mt-5 d-flex flex-column gap-5">
            <Settings settings={settings} />
            <Rates rates={rates} />
        </Container>
    );
};
