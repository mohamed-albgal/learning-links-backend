import aws from 'aws-sdk';

const dynamoClient = new aws.DynamoDB.DocumentClient();

export const handler = async (event, context) => {
    const { linkId } = JSON.parse(event.pathParameters);
    const params = {
        TableName: process.env.TableName,
        Key: {
            userId: "123A",
            linkId,
        },
    };
    const result = await dynamoClient.get(params).promise();
    if (!result.Item) {
        throw new Error( `No item for ${linkId}`);
    }
    return result.Item;
};

