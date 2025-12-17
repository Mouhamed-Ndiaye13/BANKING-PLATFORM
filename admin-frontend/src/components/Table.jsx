export default function Table({ data, columns }) {
  return (
    <table className="min-w-full border">
      <thead>
        <tr className="border-b bg-gray-200">
          {columns.map((col) => (
            <th key={col.accessor} className="p-2 text-left">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row._id} className="border-b">
            {columns.map((col) => (
              <td key={col.accessor} className="p-2">
                {row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
