'use server'

import ContactFormEmail from "@/components/email/contact-form-email";
import TokenEmail from "@/react-email-starter/emails/token-email";
import { render } from '@react-email/render';
import nodemailer from "nodemailer";

// Define types for better type safety
interface EmailResult {
    success: boolean;
    error?: string;
    messageId?: string;
}

interface ContactFormState {
    success: boolean;
    message: string;
}

// Send email with token
export async function sendTokenEmail({
    to,
    name,
    subject,
    token,
    tokenType = 'verification'
}: {
    to: string,
    name: string,
    subject: string,
    token: string,
    tokenType?: 'verification' | 'reset' | 'invitation'
}): Promise<EmailResult> {
    const { SMTP_EMAIL, SMTP_PASSWORD } = process.env

    if (!SMTP_EMAIL || !SMTP_PASSWORD) {
        console.error('SMTP credentials not found in environment variables');
        return { success: false, error: 'SMTP configuration missing' };
    }

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD
        }
    })

    // Test email connection
    try {
        const testResult = await transport.verify()
        console.log('SMTP connection verified:', testResult);
    } catch (error) {
        console.error('SMTP verification failed:', error);
        return { success: false, error: 'SMTP connection failed' };
    }

    // Render the React Email component to HTML
    const emailHtml = await render(TokenEmail({ name, token, tokenType }));

    // Send email
    try {
        const sendResult = await transport.sendMail({
            from: `"Your App Name" <${SMTP_EMAIL}>`,
            to: to,
            subject: subject,
            html: emailHtml
        })

        console.log('Email sent successfully:', sendResult.messageId);
        return { success: true, messageId: sendResult.messageId || 'sent' };

    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

// Usage examples:

// Example 1: Email verification
export async function sendVerificationEmail(email: string, name: string, token: string): Promise<EmailResult> {
    return await sendTokenEmail({
        to: email,
        name: name,
        subject: "Verify Your Email Address",
        token: token,
        tokenType: 'verification'
    });
}

// Example 2: Password reset
export async function sendPasswordResetEmail(email: string, name: string, token: string): Promise<EmailResult> {
    return await sendTokenEmail({
        to: email,
        name: name,
        subject: "Reset Your Password",
        token: token,
        tokenType: 'reset'
    });
}

// Example 3: User invitation
export async function sendInvitationEmail(email: string, name: string, token: string): Promise<EmailResult> {
    return await sendTokenEmail({
        to: email,
        name: name,
        subject: "You've Been Invited!",
        token: token,
        tokenType: 'invitation'
    });
}

export async function sendContactForm(
    prevState: ContactFormState | null,
    formData: FormData
): Promise<ContactFormState> {
    const { SMTP_EMAIL, SMTP_PASSWORD, CONTACT_FORM_RECIPIENT } = process.env;

    if (!SMTP_EMAIL || !SMTP_PASSWORD || !CONTACT_FORM_RECIPIENT) {
        console.error('SMTP configuration missing');
        return { success: false, message: 'Configuration error. Please try again later.' };
    }

    try {
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const email = formData.get('email') as string;
        const interest = formData.get('interest') as string;
        const message = formData.get('message') as string;

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: SMTP_EMAIL,
                pass: SMTP_PASSWORD
            }
        });

        // Render the email template - make sure to await this!
        const emailHtml = await render(
            ContactFormEmail({
                firstName,
                lastName,
                email,
                interest,
                message
            })
        );

        // Send email to your team
        await transport.sendMail({
            from: `"Contact Form" <${SMTP_EMAIL}>`,
            to: CONTACT_FORM_RECIPIENT,
            subject: `New Contact Form Submission: ${firstName} ${lastName}`,
            html: emailHtml, // Now this is a string, not a Promise<string>
            replyTo: email
        });

        // Optional: Send confirmation email to user
        await transport.sendMail({
            from: `"Your Company" <${SMTP_EMAIL}>`,
            to: email,
            subject: "We've received your message!",
            html: emailHtml
        });

        return { success: true, message: "Message sent successfully!" };
    } catch (error) {
        console.error('Error sending contact form:', error);
        return { success: false, message: "Failed to send message. Please try again." };
    }
}