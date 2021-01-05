import * as df from "durable-functions"
import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpStart: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
    const client = df.getClient(context)
    
    const input = <JSON><any>{ "input": req.body }
    
    const instanceId = await client.startNew(req.params.functionName, undefined, input)

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    return client.createCheckStatusResponse(context.bindingData.req, instanceId)
}

export default httpStart;
