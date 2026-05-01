"use client";

import { useEffect, useState } from "react";

type Item = {
  id: string;
  planType: string;
  status: string;
  amount: string;
  createdAt: string;
  user: {
    email: string;
  };
};

export default function AdminSubscriptionsPage() {
  const [items, setItems] =
    useState<Item[]>([]);

  const load = async () => {
    const res = await fetch(
      "/api/admin/subscriptions/list"
    );

    const data =
      await res.json();

    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  const action = async (
    id: string,
    status: string
  ) => {
    await fetch(
      "/api/admin/subscriptions/update",
      {
        method: "POST",
        body: JSON.stringify({
          id,
          status,
        }),
      }
    );

    load();
  };

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">
        Suscripciones
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded"
          >
            <p>
              <strong>Email:</strong>{" "}
              {item.user.email}
            </p>

            <p>
              <strong>Plan:</strong>{" "}
              {item.planType}
            </p>

            <p>
              <strong>Estado:</strong>{" "}
              {item.status}
            </p>

            <p>
              <strong>Monto:</strong>{" "}
              ${item.amount}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() =>
                  action(
                    item.id,
                    "active"
                  )
                }
                className="bg-green-600 text-white px-3 py-1"
              >
                Activar
              </button>

              <button
                onClick={() =>
                  action(
                    item.id,
                    "canceled"
                  )
                }
                className="bg-red-600 text-white px-3 py-1"
              >
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}