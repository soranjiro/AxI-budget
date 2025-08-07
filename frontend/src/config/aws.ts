import { Amplify } from 'aws-amplify'

// AWS Amplify設定
const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_example',
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID || 'example-client-id',
      identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID || 'us-east-1:example-identity-pool',
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN || 'example.auth.us-east-1.amazoncognito.com',
          scopes: ['openid', 'profile', 'email'],
          redirectSignIn: [import.meta.env.VITE_APP_URL || 'http://localhost:5173/'],
          redirectSignOut: [import.meta.env.VITE_APP_URL || 'http://localhost:5173/'],
          responseType: 'code' as const,
        },
      },
    },
  },
  API: {
    REST: {
      'AxI-Budget-API': {
        endpoint: import.meta.env.VITE_API_ENDPOINT || 'https://api.example.com',
        region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      },
    },
  },
}

// Amplifyを設定
Amplify.configure(awsConfig)

export default awsConfig
