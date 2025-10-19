export interface FeaturesConfig {
  teams: boolean
  enterprise: boolean
  functionCalling: boolean
  personalities: boolean
  audioUpload: boolean
  imageUpload: boolean
  teamCollaboration: boolean
  prioritySupport: boolean
  customIntegrations: boolean
  dedicatedSupport: boolean
}

export const FEATURES_CONFIG: FeaturesConfig = {
  teams: process.env.NEXT_PUBLIC_ENABLE_TEAMS === 'true',
  enterprise: process.env.NEXT_PUBLIC_ENABLE_ENTERPRISE === 'true',
  functionCalling: process.env.NEXT_PUBLIC_ENABLE_FUNCTION_CALLING === 'true',
  personalities: process.env.NEXT_PUBLIC_ENABLE_PERSONALITIES === 'true',
  audioUpload: true,
  imageUpload: true,
  teamCollaboration: true,
  prioritySupport: true,
  customIntegrations: true,
  dedicatedSupport: true
}
