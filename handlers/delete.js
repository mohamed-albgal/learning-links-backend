import aws from 'aws-sdk';
import { respond } from '../util/util';

const dynamoClient = new aws.DynamoDB.DocumentClient();


export const handler = async (event, context) => {
    const { linkId } = JSON.parse(event.pathParameters);
    const params = {
        TableName: process.env.TableName,
        Key:{
            linkId,
            userId : event.requestContext.identity.cognitoIdentityId
        },
    };
    try {
        await dynamoClient.delete(params).promise();
        return respond(200);
    }catch (e) {
        return respond(500, {error: e.message});
    }
};