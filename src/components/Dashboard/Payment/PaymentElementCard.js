"use client";

import React, { useEffect, useState } from "react";
import PaymentCard from "./PaymentCard";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import PaidForm from "@/components/Dashboard/Payment/PaidForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const actionUrl = process.env.NEXT_PUBLIC_API_LINK;
const PaymentElementCard = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [users, setUsers] = useState([]);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [payee, setPayee] = useState(false);

  const onPayeeAction = async (payeeInf) => {
    setPayee(payeeInf);
    setIsSubmiting(true);
    const { data } = await axios.post(
      `${actionUrl}/payments/create-intent`,
      payeeInf
    );

    if (data.status) {
      setClientSecret(data?.response?.key);
    }
    setIsSubmiting(false);
  };

  useEffect(() => {
    axios.get(`${actionUrl}/users`).then(({ data }) => {
      if (data?.response) {
        setUsers(data?.response);
      }
    });
  }, []);

  const appearance = {
    theme: "stripe",
  };
  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  return (
    <div className="w-full grid gap-6 grid-cols-2">
      <div className="col-span-2 md:col-span-1">
        <Card>
          <CardHeader>Payment Via Stripe</CardHeader>
          <CardContent>
            <PaidForm
              onSubmit={onPayeeAction}
              users={users}
              isSubmiting={isSubmiting}
            />
          </CardContent>
        </Card>
      </div>
      <div className="col-span-2 md:col-span-1">
        {clientSecret ? (
          <Elements
            options={{ clientSecret, appearance, loader }}
            stripe={stripePromise}
          >
            <PaymentCard clientSecret={clientSecret} payee={payee} />
          </Elements>
        ) : (
          <div className="w-full min-h-48 flex flex-col gap-5 items-center justify-center  ">
            <h2 className="text-2xl">Select Payee</h2>
            <span className="text-green-800 text-4xl font-bold">
              <i className="fa-solid fa-circle-check fa-fw"></i>
            </span>
            <p className="text-amber-500">Please, Select Payee & submit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentElementCard;
