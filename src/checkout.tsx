import { useState } from "react";

// mock data here

const books = [
  { id: "b1", title: "Kafka on the Shore", author: "Haruki Murakami", cover: "https://placehold.co/80x120", price: 18.99 },
  { id: "b2", title: "Blood Meridan", author: "Cormac McCarthy", cover: "https://placehold.co/80x120", price: 16.00 },
  { id: "b3", title: "Crime and Punishment", author: "Fyodr Dostoevesky", cover: "https://placehold.co/80x120", price: 15.50 },
];

const address = {
  name: "Jaskaran Singh",
  street: "32 Charlotte St",
  city: "Carteret",
  state: "NJ",
  zip: "07008",
};

type Book = { id: string; title: string; author: string; cover: string; price: number };
type Address = { name: string; street: string; city: string; state: string; zip: string };
// only statuses that are allowed
type Status = "idle" | "loading" | "success" | "error";


function CheckoutPage() {

  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<{ orderId: string; shipDate: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  function addPrices(){
    return books.reduce((sum, book) => sum + book.price, 0)
  }

  function returnAddress(){
    return address.street + " , " + address.city + "," + address.state + ' ' + address.zip
  }

  async function handlePlaceOrder () {
    setStatus("loading");
    try {
      // need to map objects to ids
      const booksIds = books.map((b) => b.id);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({booksIds}),
      });
      const data = await res.json();
      setResult(data);
      setStatus("success");
    } catch (err) {
      setErrorMsg("Something is wrong, try again!");
      setStatus("error")
    }
  }

  if (status === "loading") {
    return <p>Placing your order…</p>;
  }

  if (status === "success") {
    return (
      <div>
        <h2>Order confirmed!</h2>
        <p>Order ID: {result?.orderId}</p>
        <p>Estimated ship date: {result?.shipDate}</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div>
        <p>{errorMsg}</p>
        <button onClick={handlePlaceOrder}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Review Your Order</h1>

      {books.map((book) => (
        <div key={book.id}>
          <img src={book.cover} alt={book.title} />
          <p>{book.title} by {book.author}</p>
          <p>${book.price.toFixed(2)}</p>
        </div>
      ))} 
      <p>Total: ${addPrices().toFixed(2)}</p>

      <p>Shipping to: {returnAddress()}</p>

      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}

export default CheckoutPage;



