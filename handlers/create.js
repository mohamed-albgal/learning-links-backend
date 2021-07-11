import * as uuid from "uuid";
import aws from 'aws-sdk';
import respond from '../util/httpResponse';

const dynamoClient = new aws.DynamoDB.DocumentClient();

export const handler = async (event, context) => {
    const { linkNotes, attachment, questions } = JSON.parse(event.body);
    const params = {
        TableName: process.env.TableName,
        Item: {
            userId: "123A",
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
