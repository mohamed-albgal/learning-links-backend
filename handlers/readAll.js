import aws from 'aws-sdk';
import respond from '../util/httpResponse';

const dynamoClient = new aws.DynamoDB.DocumentClient();

export const handler = async (event, context) => {
    // return all the links for a given user
    const  userId  = JSON.parse(event.pathParameters).userId || "123A";
    const params = {
        TableName: process.env.TableName,
        //specify the condition on which to match (by userId)
        KeyConditionExpression: "userId = :userId",
        //referred to _something_ called :userId, define it here
        ExpressionAttributeValues: {
            ":userId" : userId,
        }
    };
    //.get is for single items, query is get * where
    try {
        const result = await dynamoClient.query(params).promise();
        return respond(200, result);
    }catch (e) {
        return respond(500, e.message);
    }
};