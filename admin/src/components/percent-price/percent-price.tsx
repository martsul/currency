import type { FC } from "react";
import { Form } from "react-bootstrap";

type Props = {
    value: string;
    handlerChange: (value: string) => void;
};

export const PercentPrice: FC<Props> = ({ value, handlerChange }) => {
    return (
        <Form.Label>
            <Form.Control
                value={value}
                onChange={(e) => handlerChange(e.target.value)}
            />
        </Form.Label>
    );
};
