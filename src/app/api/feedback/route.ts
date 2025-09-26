import { NextResponse } from 'next/server';
import { Resend } from "resend";

export async function POST(req: Request) {         
    try {
        const { message } = await req.json();
        const resend = new Resend(process.env.RESEND_API_KEY);
        const domain = process.env.DOMAIN || "";
        const receiver = process.env.RECEIVER || "";
        const siteUrl = process.env.PUBLIC_URL || "";

        const { data, error } = await resend.emails.send({
            from: domain,
            to: receiver,
            subject: `New Feedback For Morph`,
            html:`
            <div style="font-family: var(--font-inter), Arial, sans-serif; background-color: #f9fafb; padding: 20px; color: #111827;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">
                <tr>
                    <td style="background-color: oklch(0.145 0 0); padding: 20px; text-align: center;">
                    <img src="${siteUrl}/images/email-logo.png" alt="Morph Logo" style="max-width: 120px;"/>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 30px;">
                    <h2 style="margin-top: 0; color: #111827; font-family: var(--font-inter), Arial, sans-serif;">New Feedback Received 🎉</h2>
                    <p style="color: #374151; font-size: 15px; font-family: var(--font-inter), Arial, sans-serif;">Here’s the latest feedback submitted through the Morph app:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #111827; margin-top: 15px; border-radius: 4px; font-size: 14px; color: #111827; line-height: 1.5; font-family: var(--font-inter), Arial, sans-serif;">
                        ${(message as string).replace(/\n/g, '<br/>')}
                    </div>
                    <p style="margin-top: 25px; font-size: 13px; color: #6b7280; font-family: var(--font-inter), Arial, sans-serif;">This email was automatically generated. Please do not reply directly.</p>
                    </td>
                </tr>
                </table>
            </div>
            `,
        })

        if (error) {
            return NextResponse.json({ message: error }, { status: 400 });
        }
        
       return NextResponse.json({ message: data }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 400 });
    }
} 