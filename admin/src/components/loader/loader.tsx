import { Spinner } from "react-bootstrap";
import { useLoading } from "../../contexts/loading-context/use-loading";

export const Loader = () => {
    const { isLoading } = useLoading();

    return isLoading ? (
        <div
            style={{ background: "rgb(0 0 0 / 37%)" }}
            className="position-fixed w-100 h-100 top-0 left-0 d-flex justify-content-center align-items-center"
        >
            <Spinner animation="border" />
        </div>
    ) : null;
};
