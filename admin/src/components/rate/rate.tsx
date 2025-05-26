import type { RateDTO } from "../../types/rate-dto";
import { Button, Form } from "react-bootstrap";
import { TypePrice } from "../type-price/type-price";
import { StaticPrice } from "../static-price/static-price";
import { PercentPrice } from "../percent-price/percent-price";
import type { FC } from "react";
import { useRate } from "./use-rate";

type Props = {
    rate: RateDTO;
};

export const Rate: FC<Props> = ({ rate }) => {
    const {
        handlerIsAffect,
        handlerPercent,
        handlerStaticRate,
        handlerTypePrice,
        values,
        saveValues,
    } = useRate(rate);

    return (
        <Form
            className="d-flex flex-column gap-3 h-100 justify-content-between"
            onSubmit={(e) => {
                e.preventDefault();
                saveValues();
            }}
        >
            <div className="d-flex flex-column gap-3">
                <h4>{`${rate.from}/${rate.to}`}</h4>
                <p className="m-0">
                    The exchange price: <strong>{rate.rate}</strong>
                </p>
                <TypePrice
                    handlerChange={handlerTypePrice}
                    type={values.typePrice}
                />
                {values.typePrice === "static" && (
                    <StaticPrice
                        checked={values.isAffect}
                        value={values.staticRate || ""}
                        handlerChangeCheck={handlerIsAffect}
                        handlerChangeInput={handlerStaticRate}
                    />
                )}
                {values.typePrice === "percent" && (
                    <PercentPrice
                        value={values.percent || ""}
                        handlerChange={handlerPercent}
                    />
                )}
            </div>
            <Button type="submit" className="mb-4" variant="secondary">
                Save
            </Button>
        </Form>
    );
};
