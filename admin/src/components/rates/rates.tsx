import type { FC } from "react";
import type { RateDTO } from "../../types/rate-dto";
import { Rate } from "../rate/rate";
import { Col, Row } from "react-bootstrap";

type Props = { rates: RateDTO[] };

export const Rates: FC<Props> = ({ rates }) => {
    return (
        <section>
            <h2>Rates</h2>
            <Row>
                {rates.map((r) => (
                    <Col key={r.id} md="6">
                        <Rate rate={r} />
                    </Col>
                ))}
            </Row>
        </section>
    );
};
