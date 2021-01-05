import { AzureFunction, Context } from "@azure/functions"
import axios from "axios"
import * as qs from "qs"

const activityFunction: AzureFunction = async function (context: Context): Promise<JSON> {
    
     const accessToken = await getBearerToken()

     const result = await getEmailData( accessToken )

    return result
}

async function getBearerToken(): Promise<any>{

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


async function getEmailData( token:any ): Promise<JSON>{

    const config = {
        headers: { Authorization: `${token.token_type} ${token.access_token}` }
    }
  
    axios.defaults.headers.get['Content-Type'] = 'application/json'

    const mail = await axios.get('https://graph.microsoft.com/v1.0/users/1500e606-adc5-4cd9-a4dc-970c10f7bdff/mailFolders/inbox/messages?$search="order"', config )

    return mail.data
}

export default activityFunction
