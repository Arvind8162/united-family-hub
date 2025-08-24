import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { VerificationEmail } from './_templates/verification-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    const wh = new Webhook(hookSecret)
    
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
      }
    }

    // Determine email subject based on action type
    let subject = 'Verify your email address - Samaj Setu'
    if (email_action_type === 'recovery') {
      subject = 'Reset your password - Samaj Setu'
    } else if (email_action_type === 'invite') {
      subject = 'You\'ve been invited to Samaj Setu'
    } else if (email_action_type === 'magiclink') {
      subject = 'Sign in to Samaj Setu'
    }

    // Render the email template
    const html = await renderAsync(
      React.createElement(VerificationEmail, {
        supabase_url: Deno.env.get('SUPABASE_URL') ?? 'https://xuxxeidywyvyovrclnje.supabase.co',
        token,
        token_hash,
        redirect_to: redirect_to || 'http://localhost:3000',
        email_action_type,
        user_email: user.email,
      })
    )

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Samaj Setu <onboarding@resend.dev>',
      to: [user.email],
      subject,
      html,
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify({ success: true, message: 'Email sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          code: error.code || 'UNKNOWN_ERROR',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})