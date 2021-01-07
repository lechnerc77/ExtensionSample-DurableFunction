import { AzureFunction, Context } from "@azure/functions"
import axios from "axios"
import * as qs from "qs"

const activityFunction: AzureFunction = async function (context: Context): Promise<JSON> {

    const accessToken = await getBearerToken()

    const orderIds = await extractOrderIds(context.bindingData.data)

    const result = await getEmailData(accessToken, orderIds)

    return result
}

async function getBearerToken(): Promise<any> {

    const postData = {
        client_id: process.env["APP_ID"],
        scope: process.env["MS_GRAPH_SCOPE"],
        client_secret: process.env["APP_SECRET"],
        grant_type: 'client_credentials'
    }

    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    const response = await axios.post(process.env["TOKEN_ENDPOINT"], qs.stringify(postData))
    const result = {
        "token_type": response.data.token_type,
        "access_token": response.data.access_token
    }

    return result

}


async function getEmailData(token: any, orderIds: Array<String>): Promise<JSON> {

    const config = {
        headers: { Authorization: `${token.token_type} ${token.access_token}` }
    }

    axios.defaults.headers.get['Content-Type'] = 'application/json'

    let queryUrl = process.env['GRAPH_API_ENDPOINT_BASE']


    for (const [index, orderId] of orderIds.entries()) {

        if (index === 0) {
            queryUrl = queryUrl + '"' + orderId
        }
        else {
            queryUrl = queryUrl + ' OR ' + orderId
        }

    }

    queryUrl = queryUrl + '"'

    const mail = await axios.get(queryUrl, config)

    return mail.data
}

async function extractOrderIds(orderHistory: any): Promise<Array<String>> {

    let orderArray = []

    for (const orderline of orderHistory.input) {

        orderArray.push(orderline.orderId)

    }

    return orderArray
}


export default activityFunction
