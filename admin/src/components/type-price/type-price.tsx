import type { FC } from "react";
import type { AvailableTypePrice } from "../../types/available-type-price";
import { Form } from "react-bootstrap";

type Props = {
    type: AvailableTypePrice;
    handlerChange: (value: AvailableTypePrice) => void;
};

export const TypePrice: FC<Props> = ({ type, handlerChange }) => {
    return (
        <div className="d-flex align-items-center gap-3">
            <Form.Check
                onChange={() => handlerChange("market")}
                checked={type === "market"}
                label={"Market"}
            />
            <Form.Check
                onChange={() => handlerChange("static")}
                checked={type === "static"}
                label={"Static"}
            />
            <Form.Check
                onChange={() => handlerChange("percent")}
                checked={type === "percent"}
                label={"Percent"}
            />
        </div>
    );
};
