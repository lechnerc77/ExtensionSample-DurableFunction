import { AzureFunction, Context } from "@azure/functions"
import { TextAnalyticsClient, AzureKeyCredential } from "@azure/ai-text-analytics"
import { htmlToText } from "html-to-text"

const activityFunction: AzureFunction = async function (context: Context): Promise<any> {

    const key = process.env["COGNITIVE_SERVICE_KEY"]
    const endpoint = process.env["COGNITIVE_SERVICE_ENDPOINT"]

    const textAnalyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key))

    let input = []

    for (const emailDataValue of context.bindingData.emailData.value) {
        if (emailDataValue.body.contentType === 'text') {

            input.push(emailDataValue.body.content)
        }
        else if (emailDataValue.body.contentType === 'html') {
            
            const textBody = htmlToText(emailDataValue.body.content, {
                wordwrap: 0
            })

            input.push(textBody)
        }

    }

    const sentimentResult = await textAnalyticsClient.analyzeSentiment(input)

    return sentimentResult
}

export default activityFunction

