export const truncate3 = (val: number | string) => {
    let newVal = Number(val) || 0;

    return (Math.trunc(newVal * 1000) / 1000).toFixed(3).toString();
};
