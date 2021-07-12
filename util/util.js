export const respond = (status, body) =>  {
    return {
        status,
        body: JSON.stringify(body),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        },
    };
};

export const getAdjustedTimestamp = () => {
    const dateObj = new Date();
    const tzAdjust = dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000);
    const adjusted = new Date(tzAdjust);
    return adjusted.getTime();

};