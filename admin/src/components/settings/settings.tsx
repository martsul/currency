import type { FC } from "react";
import type { SettingDTO } from "../../types/setting-dto";
import { Setting } from "../setting/setting";
import { Col, Row } from "react-bootstrap";

type Props = { settings: SettingDTO[] };

export const Settings: FC<Props> = ({ settings }) => {
    return (
        <section>
            <h2>Settings</h2>
            <Row>
                {settings.map((s) => (
                    <Col className="mb-4" md="6" key={s.id}>
                        <Setting setting={s} />
                    </Col>
                ))}
            </Row>
        </section>
    );
};
