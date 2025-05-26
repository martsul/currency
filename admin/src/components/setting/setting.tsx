import { useState, type FC } from "react";
import type { SettingDTO } from "../../types/setting-dto";
import { Button, Form } from "react-bootstrap";
import { SETTINGS_NAMES } from "../../constants/settings-names";
import { api } from "../../api";
import { useLoading } from "../../contexts/loading-context/use-loading";

type Props = {
    setting: SettingDTO;
};

export const Setting: FC<Props> = ({ setting }) => {
    const [value, setValue] = useState(setting.value);
    const { startLoading, stopLoading } = useLoading();

    const onSubmit = () => {
        startLoading();
        api.post("/admin/settings", { ...setting, value }).finally(() =>
            stopLoading()
        );
    };

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
            className="d-flex flex-column gap-3"
        >
            <h4 className="mb-0">
                {SETTINGS_NAMES[setting.name] || setting.name}
            </h4>
            <Form.Control
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <Button variant="secondary" type="submit">
                Save
            </Button>
        </Form>
    );
};
