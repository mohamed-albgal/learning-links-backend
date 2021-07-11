export const respond = (status, body) =>  {
    return {
        status,
        body: JSON.stringify(body)
    };
};

export const getAdjustedTimestamp = () => {
    const dateObj = new Date();
    const tzAdjust = dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000);
    const adjusted = new Date(tzAdjust);
    return adjusted.getTime();

};