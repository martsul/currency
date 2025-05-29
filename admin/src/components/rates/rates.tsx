import { useState, type FC } from "react";
import type { RateDTO } from "../../types/rate-dto";
import { Rate } from "../rate/rate";
import { Form, Table } from "react-bootstrap";

type Props = { rates: RateDTO[] };

export const Rates: FC<Props> = ({ rates }) => {
    const [filteredRates, setFilteredRates] = useState([...rates]);
    const [searchValue, setSearchValue] = useState("");

    return (
        <section>
            <h2 className="mb-5">Rates</h2>
            <span className="fs-4">Search</span>
            <Form.Control
            className="mb-4"
                value={searchValue}
                onChange={(e) => {
                    const value = e.target.value;
                    setSearchValue(value);
                    setFilteredRates(
                        rates.filter((e) => {
                            const title = `${e.from}/${e.to}`;
                            return title.includes(value);
                        })
                    );
                }}
            />
            <div className="overflow-auto">
                <Table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Market Price</th>
                            <th>Market</th>
                            <th>Static</th>
                            <th>Percent</th>
                            <th>Static Price/Percent</th>
                            <th>Influence other prices</th>
                            <th>Save</th>
                            <th>Error</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRates.map((r) => (
                            <Rate rate={r} />
                        ))}
                    </tbody>
                </Table>
            </div>
        </section>
    );
};
