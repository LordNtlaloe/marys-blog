"use client";

import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Preview } from "@react-email/preview";
import { Body } from "@react-email/body";
import { Container } from "@react-email/container";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Hr } from "@react-email/hr";

interface ContactFormEmailProps {
    firstName: string;
    lastName: string;
    email: string;
    interest: string;
    message: string;
}

export default function ContactFormEmail({
    firstName,
    lastName,
    email,
    interest,
    message,
}: ContactFormEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>New contact form submission</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>New Contact Form Submission</Heading>
                    <Text style={text}>
                        <strong>Name:</strong> {firstName} {lastName}
                    </Text>
                    <Text style={text}>
                        <strong>Email:</strong> {email}
                    </Text>
                    <Text style={text}>
                        <strong>Interest:</strong> {interest}
                    </Text>
                    <Hr style={hr} />
                    <Text style={text}>
                        <strong>Message:</strong>
                    </Text>
                    <Text style={paragraph}>{message}</Text>
                    <Hr style={hr} />
                    <Text style={footer}>
                        This message was sent via the contact form on your website.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    width: "580px",
};

const h1 = {
    fontSize: "24px",
    lineHeight: "1.3",
    fontWeight: "700",
    color: "#484848",
};

const text = {
    fontSize: "16px",
    lineHeight: "1.4",
    color: "#484848",
    margin: "16px 0",
};

const paragraph = {
    fontSize: "16px",
    lineHeight: "1.4",
    color: "#484848",
    margin: "0",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
};

const hr = {
    borderColor: "#cccccc",
    margin: "20px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    margin: "0",
};
