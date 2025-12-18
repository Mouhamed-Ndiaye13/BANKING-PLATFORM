import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

export default function AccountCharts({ transactions }) {

  const data = transactions.map(tx => ({
    date: new Date(tx.createdAt).toLocaleDateString(),
    amount: tx.amount,
    type: tx.type
  }));

  const stats = [
    {
      name: "Entrées",
      value: transactions
        .filter(t => t.type === "deposit")
        .reduce((s, t) => s + t.amount, 0)
    },
    {
      name: "Sorties",
      value: transactions
        .filter(t => t.type === "withdraw")
        .reduce((s, t) => s + t.amount, 0)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* ÉVOLUTION */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold text-[#432703] mb-2">
          Évolution des transactions
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#432703"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ENTRÉES / SORTIES */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold text-[#432703] mb-2">
          Entrées vs Sorties
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={stats}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#a28870" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
