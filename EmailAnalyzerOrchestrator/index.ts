import * as df from "durable-functions"

const orchestrator = df.orchestrator(function* (context) {
    
    const emailData = yield context.df.callActivity("GetEmailsActivity", context.bindingData.input)

    context.bindingData.input.emailData = emailData

    const sentimentScoring = yield context.df.callActivity("AnalyzeSentimentActivity", context.bindingData.input)

    return sentimentScoring
})

export default orchestrator
