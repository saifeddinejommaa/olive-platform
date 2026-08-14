import React from "react";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;

  pageNumber: number;
  pageSize: number;
  totalCount: number;

  onPageChange: (page: number) => void;
};

export default function DataTable<T>({
  data,
  columns,
  onRowClick,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
}: Props<T>) {
  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / pageSize)
  );

  return (
    <div className="glass-card">
      <div className="table-wrapper">
      <table className="modern-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(item)}
              style={{
                cursor: onRowClick ? "pointer" : "default",
              }}
            >
              {columns.map((col) => (
                <td key={String(col.key)}>
                  {col.render
                    ? col.render(item)
                    : String(item[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
       </div>
      <div className="pagination">
        <button
          disabled={pageNumber <= 1}
          onClick={() => onPageChange(pageNumber - 1)}
        >
          Prev
        </button>

        <span>
          Page {pageNumber} / {totalPages}
          {" • "}
          {totalCount} items
        </span>

        <button
          disabled={pageNumber >= totalPages}
          onClick={() => onPageChange(pageNumber + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}