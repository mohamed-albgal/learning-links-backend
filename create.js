import * as uuid from "uuid";
import aws from 'aws-sdk';
import { respond } from './util/util';

const dynamoClient = new aws.DynamoDB.DocumentClient();

export const handler = async (event, context) => {
    const { linkNotes, attachment, questions } = JSON.parse(event.body);
    const params = {
        TableName: process.env.TableName,
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            linkId: uuid.v1(),
            linkNotes,
            attachment,
            questions,
            creationDate: Date.now()
        },
    };
    try {
        //call returns empty object on successful case
        await dynamoClient.put(params).promise();
        return respond(200, params.Item.linkId );
    } catch (e) {
        return respond(500, { error: e.message });
    }
};

/**
 * should create everything in the request.body
 * could either "register" expected incoming attributes to tie them to some schema OR allow the frontend to 
 * insert any data it wants to take advantage of noSql flexibility
 */
