import type { RateDTO } from "../../types/rate-dto";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
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
        <tr>
            <td>{`${rate.from}/${rate.to}`}</td>
            <td>{rate.rate}</td>
            <td>
                <input
                    type="radio"
                    onChange={() => handlerTypePrice("market")}
                    checked={values.typePrice === "market"}
                />
            </td>
            <td>
                <input
                    type="radio"
                    onChange={() => handlerTypePrice("static")}
                    checked={values.typePrice === "static"}
                />
            </td>
            <td>
                <input
                    type="radio"
                    onChange={() => handlerTypePrice("percent")}
                    checked={values.typePrice === "percent"}
                />
            </td>
            <td>
                <input
                    type="text"
                    disabled={values.typePrice === "market"}
                    value={
                        values.typePrice === "percent"
                            ? values.percent || ""
                            : values.typePrice === "static"
                            ? values.staticRate || ""
                            : ""
                    }
                    onChange={(e) => {
                        if (values.typePrice === "percent") {
                            handlerPercent(e.target.value);
                        } else if (values.typePrice === "static") {
                            handlerStaticRate(e.target.value);
                        }
                    }}
                />
            </td>
            <td>
                <div>
                    <input
                        disabled={values.typePrice !== "static"}
                        type="checkbox"
                        checked={values.isAffect}
                        onChange={(e) => handlerIsAffect(e.target.checked)}
                    />
                </div>
            </td>
            <td>
                <Button onClick={saveValues}>Save</Button>
            </td>
            <td>
                {rate.error && (
                    <OverlayTrigger overlay={<Tooltip>{rate.error}</Tooltip>}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="#EA3323"
                        >
                            <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
                        </svg>
                    </OverlayTrigger>
                )}
            </td>
        </tr>
    );
};
