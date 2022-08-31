# EmployeeManager

This employees manager app is built using AWS Amplify with React to set up authentication, hosting, and a backend REST API. This API then connects to a DynamoDB table to store information for each Cognito profile. On the frontend, a Cognito user is able to perform CRUD operations to manage the employees present in a given company. Material UI and Bootstrap have been used to style components. The site hosted by Amplify can be found [here](https://main.d3dxgmtao87gyc.amplifyapp.com/).

## Installation

### Clone

Clone this repository to your machine using https://github.com/MMacdonald07/EmployeeManager.git

### Setup

Use the package manager npm to install prerequisite node dependencies so the program can run:

```bash
npm install
```

## Usage

To open the program ordinarily on your device, either use the provided URL above to access the site or deploy your own version.

To do this, it will be necessary to have an [AWS](https://eu-west-2.console.aws.amazon.com/console/home?region=eu-west-2#) account to generate API keys for deployment.

From here, run the following in the terminal to build and deploy the program:

```bash
npm run start
```

In order to make any changes to the backend API (under the /amplify directory), the following command will need to be run upon saving files to deploy the updated backend to the cloud:

```bash
amplify push
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Any contributions to the main branch will result in an automatic deployment by AWS Amplify.
