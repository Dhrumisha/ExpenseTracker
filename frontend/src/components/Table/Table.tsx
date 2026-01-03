"use client";

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  noDataText?: string;
}

export default function SimpleTable<T>({
  columns,
  data,
  loading,
  noDataText = "No data",
}: Props<T>) {
  if (loading) return <p>Loading...</p>;

  if (!data.length) return <p>{noDataText}</p>;

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 text-left font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              {columns.map((col, j) => (
               <td key={j} className="px-4 py-3">
               {col.cell ? (
                 col.cell(row)
               ) : col.accessor ? (
                 typeof col.accessor === "function" ? (
                   col.accessor(row)
                 ) : (
                   <>{String(row[col.accessor as keyof T] ?? "")}</>
                 )
               ) : null}
             </td>
             
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
