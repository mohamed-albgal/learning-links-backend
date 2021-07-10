import * as uuid from "uuid"
import aws from 'aws-sdk'


const ddb = new aws.DynamoDB.DocumentClient()

export async function handler(event, context) {
    const data = JSON.parse(event.body)

    const params = {
        TableName : process.env.tableName,
        Item: {
            userId: "123A",
            linkId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            creationDate: Date.now()
        },
    }

    try {
        await ddb.put(params).promise()
        return {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        }
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify( { error: e.message })
        }
    }
}
