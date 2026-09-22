import LegalPage from '../../components/legal/LegalPage';

export default function Returns() {
  return (
    <LegalPage title="Returns & Refunds" updatedAt="September 2026">
      <p>
        We want you to love what you order. If something isn't right, here's how returns work.
      </p>

      <h2>Return Window</h2>
      <p>
        Items can be returned within 7 days of delivery, provided they are unworn, unwashed,
        and have all original tags attached.
      </p>

      <h2>Non-Returnable Items</h2>
      <ul>
        <li>Items marked as final sale</li>
        <li>Bulk orders, unless the items received are faulty or incorrect</li>
        <li>Earrings and other hygiene-sensitive accessories</li>
      </ul>

      <h2>How to Start a Return</h2>
      <p>
        Log in to your account, go to your order history, and select the order you'd like to
        return — or contact us directly with your order number if you checked out as a guest.
      </p>

      <h2>Refunds</h2>
      <p>
        Once your return is received and inspected, refunds are processed to your original
        payment method within 5-7 business days. Delivery fees are non-refundable unless the
        return is due to our error.
      </p>

      <h2>Exchanges</h2>
      <p>
        For a different size or color, we recommend returning the original item and placing a
        new order to ensure the fastest turnaround.
      </p>
    </LegalPage>
  );
}
