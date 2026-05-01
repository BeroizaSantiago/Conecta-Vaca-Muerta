"use client";

export default function PricingPage() {
  const plans = [
    {
      key: "recruiting",
      name: "Recruiting",
      price: "$120.000",
      desc: "Para empresas que buscan talento.",
    },
    {
      key: "sponsorship",
      name: "Sponsorship",
      price: "$250.000",
      desc: "Para marcas que buscan visibilidad.",
    },
    {
      key: "strategic",
      name: "Strategic",
      price: "Consultar",
      desc: "Para grandes cuentas.",
    },
  ];

  const contratar = async (
    planType: string
  ) => {
    const res = await fetch(
      "/api/subscriptions/create",
      {
        method: "POST",
        body: JSON.stringify({
          planType,
        }),
      }
    );

    const data =
      await res.json();

    alert(data.message);
  };

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Planes para Empresas
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className="border rounded p-6"
          >
            <h2 className="text-2xl font-bold">
              {plan.name}
            </h2>

            <p className="text-3xl my-4">
              {plan.price}
            </p>

            <p className="mb-6">
              {plan.desc}
            </p>

            <button
              onClick={() =>
                contratar(
                  plan.key
                )
              }
              className="w-full bg-black text-white px-4 py-2"
            >
              Solicitar Plan
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}