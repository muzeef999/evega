"use client";
import { Card, Button } from 'react-bootstrap';
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap"; // Importing necessary components

export default function AuthErrorPage({ searchParams }) {
  const error = searchParams?.error || "Default";

  const errorMessage = {
    Configuration: "Configuration error. Please check your settings.",
    AccessDenied: "Access denied. Please check your credentials.",
    Verification: "Verification error. Try logging in again.",
    OAuthSignin: "Error in OAuth sign-in process.",
    OAuthCallback: "OAuth callback failed. Ensure correct client ID and redirect URI.",
    OAuthCreateAccount: "Error creating an account during OAuth.",
    EmailCreateAccount: "Error creating an account with email.",
    Callback: "Callback error. Check your settings.",
    Default: "An unknown error occurred.",
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{marginTop:'50px'}}>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-lg p-4 rounded-lg">
            <Card.Body className="text-center">
              <h1 className="mb-4">Authentication Error</h1>
              <p>{errorMessage[error] || errorMessage.Default}</p>
              <Link href="/login" passHref legacyBehavior>
                <Button variant="primary" size="lg" className="mt-3">
                  Return to Login
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
