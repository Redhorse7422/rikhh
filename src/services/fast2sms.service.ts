interface Fast2SMSResponse {
  return: boolean
  request_id: string
  message: string[]
}

interface Fast2SMSRequest {
  route: string
  sender_id: string
  message: string
  variables_values: string
  numbers: string
  flash?: number
  schedule_time?: string
}

class Fast2SMSService {
  private readonly apiKey = '3qwMzdBoZIsUKvTA9Lm8CcaYpFnXt1gu0EWh467e5OSRxklDGNQxGhwdLZvP2FgXJyfnqWSVtA671aND'
  private readonly baseUrl = 'https://www.fast2sms.com/dev/bulkV2'
  private readonly senderId = 'WORCVZ'

  async sendOTP(phoneNumber: string, otp: string): Promise<Fast2SMSResponse> {
    try {
      const requestBody: Fast2SMSRequest = {
        route: 'dlt',
        sender_id: this.senderId,
        message: '177690', // Template ID
        variables_values: otp,
        numbers: phoneNumber,
        flash: 0,
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          authorization: this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Fast2SMS API error: ${response.status}`)
      }

      const result: Fast2SMSResponse = await response.json()

      if (!result.return) {
        throw new Error(`Fast2SMS error: ${result.message.join(', ')}`)
      }

      return result
    } catch (error) {
      console.error('Fast2SMS sendOTP error:', error)
      throw new Error('Failed to send OTP')
    }
  }

  async sendOTPGet(phoneNumber: string, otp: string): Promise<Fast2SMSResponse> {
    try {
      const params = new URLSearchParams({
        authorization: this.apiKey,
        route: 'dlt',
        sender_id: this.senderId,
        message: '177690',
        variables_values: otp,
        numbers: phoneNumber,
        flash: '0',
      })

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`Fast2SMS API error: ${response.status}`)
      }

      const result: Fast2SMSResponse = await response.json()

      if (!result.return) {
        throw new Error(`Fast2SMS error: ${result.message.join(', ')}`)
      }

      return result
    } catch (error) {
      console.error('Fast2SMS sendOTP error:', error)
      throw new Error('Failed to send OTP')
    }
  }
}

export const fast2SMSService = new Fast2SMSService()
