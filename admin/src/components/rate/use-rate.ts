import { useState } from "react";
import type { RateDTO } from "../../types/rate-dto";
import type { AvailableTypePrice } from "../../types/available-type-price";
import { produce } from "immer";
import { api } from "../../api";
import { useLoading } from "../../contexts/loading-context/use-loading";

export const useRate = (rate: RateDTO) => {
    const [values, setValues] = useState<RateDTO>({ ...rate });
    const { startLoading, stopLoading } = useLoading();

    const saveValues = () => {
        startLoading();
        api.post("/admin/rate", values).finally(() => stopLoading());
    };

    const handlerTypePrice = (type: AvailableTypePrice) => {
        setValues(
            produce((draft) => {
                draft.typePrice = type;
            })
        );
    };

    const handlerStaticRate = (value: string) => {
        setValues(
            produce((draft) => {
                if (!isNaN(+value) || value === "") {
                    draft.staticRate = value;
                }
            })
        );
    };

    const handlerIsAffect = (checked: boolean) => {
        setValues(
            produce((draft) => {
                draft.isAffect = checked;
            })
        );
    };

    const handlerPercent = (value: string) => {
        setValues(
            produce((draft) => {
                draft.percent = value;
            })
        );
    };

    return {
        handlerIsAffect,
        handlerPercent,
        handlerStaticRate,
        handlerTypePrice,
        values,
        saveValues,
    };
};
