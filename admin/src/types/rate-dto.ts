export type RateDTO = {
    id: string;
    from: string;
    to: string;
    rate: string;
    typePrice: "market" | "static" | "percent";
    isAffect: boolean;
    staticRate: string | null;
    percent: string | null;
    error: string | null;
};
