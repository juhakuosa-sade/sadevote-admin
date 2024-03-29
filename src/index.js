import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Amplify, PubSub } from 'aws-amplify'

//import awsExports from "./aws-exports";
/* 
* - Correct values for the configs can be copied from AWS AppSync Console | your target API | Settings
* - API Key expires after 7 days. It can be renewed also in AWS AppSync Console | your target API | Settings
*/

//API name: AppSyncSadevote-test
//API ID: x3rzlmes55gs7f6omuls73p3e4
const awsExports = {
  "aws_appsync_graphqlEndpoint": "https://bk3cs7tinnezfhhm4guwmar2ti.appsync-api.eu-west-1.amazonaws.com/graphql",
  "aws_appsync_region": "eu-west-1",
  "aws_appsync_authenticationType": "API_KEY",
  "aws_appsync_apiKey": "da2-zpaqisj2vzfjfgytfhcoffcklu",
  "aws_project_region": "eu-west-1",
  "aws_content_delivery_bucket": "sadevote-admin-20200424023034-hostingbucket-test",
  "aws_content_delivery_bucket_region": "eu-west-1",
  "aws_content_delivery_url": "https://d2ksfofv0xm7vg.cloudfront.net",
  "aws_cognito_identity_pool_id": "eu-west-1:d6e423e9-b7f4-46ab-9208-e0b400be3c49",
  "aws_cognito_region": "eu-west-1",
  "aws_user_pools_id": "eu-west-1_fUueFwy5j",
  "aws_user_pools_web_client_id": "6ke2ro39et5if62h2seh4h61vj",
  "oauth": {},
  
};

Amplify.configure(awsExports);
PubSub.configure(awsExports);


/*
// optional configuration
const styles = {
    dialogViewStyle: { height: 300, color: 'black', backgroundColor:'white', display: 'flex', flexDirection: 'column', },
    dialogButtonStyle: { width: 100, color: 'white', backgroundColor:'red', display: 'flex', flexDirection: 'column', },

}
const options = {
    position: positions.MIDDLE,
    timeout: 5000,
    transition: transitions.SCALE
  }
  
  const MyAlertTemplate = ({ messageRow1, messageRow2, close }) => (
    <div style={styles.alertDialogStyle}>
      {messageRow1}
      {messageRow2}
      <button onClick={() => { return true }}>OK</button>
      <button onClick={() => { return false }}>Cancel</button>
</div>
  )
*/
ReactDOM.render(
    <BrowserRouter>
          <App />
      </BrowserRouter>,
  document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
