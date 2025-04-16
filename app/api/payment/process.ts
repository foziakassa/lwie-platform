import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { amount, planName, currency, customerName, customerEmail, customerPhone } = req.body;

    const chapaSecretKey = process.env.CHAPA_SECRET_KEY; // Ensure this is set in your environment
    if (!chapaSecretKey) {
      return res.status(500).json({ success: false, message: "Chapa API key not configured" });
    }

    const tx_ref = `tx-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    try {
      const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${chapaSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount.toString(),
          currency,
          tx_ref,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          first_name: customerName.split(" ")[0] || "Customer",
          last_name: customerName.split(" ").slice(1).join(" ") || "",
          email: customerEmail || "customer@example.com",
          phone_number: customerPhone || "0900000000",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Chapa API error:", errorData);
        return res.status(response.status).json({ success: false, message: errorData.message });
      }

      const data = await response.json();
      return res.status(200).json({
        success: true,
        redirectUrl: data.data.checkout_url,
        transactionId: tx_ref,
      });
    } catch (error) {
      console.error("Payment processing error:", error);
      return res.status(500).json({ success: false, message: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}