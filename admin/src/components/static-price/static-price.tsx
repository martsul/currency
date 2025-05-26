import type { FC } from "react";
import { Form } from "react-bootstrap";

type Props = {
    value: string;
    handlerChangeInput: (values: string) => void;
    handlerChangeCheck: (checked: boolean) => void;
    checked: boolean;
};

export const StaticPrice: FC<Props> = ({
    handlerChangeInput,
    value,
    handlerChangeCheck,
    checked,
}) => {
    return (
        <div className="w-100">
            <Form.Label className="w-100">
                <Form.Control
                    value={value}
                    onChange={(e) => handlerChangeInput(e.target.value)}
                />
            </Form.Label>
            <Form.Check
                label="Influence other prices"
                checked={checked}
                onChange={(e) => handlerChangeCheck(e.target.checked)}
            />
        </div>
    );
};
