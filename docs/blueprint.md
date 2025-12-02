# **App Name**: CargoCerta

## Core Features:

- Company Registration: Allow companies to register using CNPJ, company name, email, and password, validating the CNPJ.
- User Authentication: Authenticate users based on CNPJ and password, issuing a JWT that includes the company ID.
- Multi-Tenancy Data Isolation: Ensure that all data (drivers, loads, documents) is isolated by company ID, restricting access to authorized personnel only.
- Subscription Management: Enable companies to choose a subscription plan (Starter, Pro, Enterprise) and integrate with Mercado Pago or Stripe for payment processing, using webhooks for payment confirmation.
- Driver Management: Allow companies to manage drivers, including adding, editing, and deleting driver information, while enforcing plan limits.
- Load Management: Enable companies to manage loads, including tracking delivery status, origin, and destination, while enforcing plan limits.
- Document Management: Facilitate document uploads to Firebase Storage, associating them with drivers and ensuring data isolation by company.

## Style Guidelines:

- Primary color: Deep blue (#1A237E) to convey trust and professionalism, referencing the reliability needed in logistics.
- Background color: Very light blue (#E3F2FD), a desaturated version of the primary color, for a clean and calm interface.
- Accent color: A vibrant purple (#7B1FA2), for a noticeable but analogous highlight on interactive elements.
- Body and headline font: 'Inter', a sans-serif font for a modern, machined look, suitable for headlines or body text.
- Use consistent, modern line icons for key actions and data points.
- Implement a clear, responsive layout that adapts to different screen sizes, ensuring readability and usability.
- Incorporate subtle transitions and animations for interactive elements to provide feedback and enhance user experience.