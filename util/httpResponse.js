export default (status, body) =>  {
    return {
        status,
        body: JSON.stringify(body)
    };
};