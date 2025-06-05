// / <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    TEMPLATE: 'buyer' | 'seller' | 'admin'
    NODE_ENV: 'development' | 'production' | 'test'
    COREPACK_ENABLE_AUTO_PIN: '0' | '1'

    NEXT_PUBLIC_API_CLIENT_BASE_URL: string
    API_SERVER_BASE_URL: string
    BASE_URL: string

    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    NEXTAUTH_SESSION_MAX_AGE: string
    DEBUG_ENABLED: 'true' | 'false'

    NEXT_PUBLIC_AUTH_HOME_PAGE: string
    NEXT_PUBLIC_AUTH_REDIRECT_URI: string
    NEXT_PUBLIC_AUTH_LOGIN_URI: string

    NEXT_PUBLIC_APP_NAME: string

    NEXT_PUBLIC_PRODUCT_ATTR_CODE_UNIT_PRICE_DIVIDER: string
  }
}
