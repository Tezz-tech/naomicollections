import LegalPage from '../../components/legal/LegalPage';

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updatedAt="September 2026">
      <p>
        This Privacy Policy explains how Naomi's Collections collects, uses, and protects your
        personal information when you use our site.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We collect information you provide directly — name, email, phone number, and delivery
        address — when you create an account, place an order, or contact us. We also collect
        basic usage data to improve the site.
      </p>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and deliver your orders</li>
        <li>To send order updates, receipts, and delivery confirmations</li>
        <li>To respond to bulk quote requests and customer support inquiries</li>
        <li>To send marketing communications, only if you've opted in to our newsletter</li>
      </ul>

      <h2>Payment Information</h2>
      <p>
        Payments are processed securely by Paystack. We do not store your card details on our
        servers.
      </p>

      <h2>Data Sharing</h2>
      <p>
        We do not sell your personal information. We share data only with service providers
        necessary to operate the store — payment processing, email delivery, and logistics.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data at any
        time by contacting us.
      </p>
    </LegalPage>
  );
}
