import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<Row extends Record<string, unknown>> {
  key: keyof Row & string;
  label: string;
  sortable?: boolean;
  render?: (value: Row[keyof Row], row: Row) => ReactNode;
}

export function DataTable<Row extends Record<string, unknown>>({
  rows,
  columns,
  searchPlaceholder = "Search rows",
  pageSize = 5,
  getRowId,
}: {
  rows: Row[];
  columns: Array<DataTableColumn<Row>>;
  searchPlaceholder?: string;
  pageSize?: number;
  getRowId?: (row: Row, index: number) => string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: keyof Row & string; direction: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const nextRows = normalizedQuery
      ? rows.filter((row) =>
          Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedQuery))
        )
      : rows;

    if (!sort) return nextRows;

    return [...nextRows].sort((a, b) => {
      const aValue = String(a[sort.key] ?? "");
      const bValue = String(b[sort.key] ?? "");
      return sort.direction === "asc"
        ? aValue.localeCompare(bValue, undefined, { numeric: true })
        : bValue.localeCompare(aValue, undefined, { numeric: true });
    });
  }, [query, rows, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const pageRows = filteredRows.slice(page * pageSize, page * pageSize + pageSize);

  function rowId(row: Row, index: number) {
    return getRowId?.(row, index) ?? String(row.id ?? `${page}-${index}`);
  }

  function updateSort(key: keyof Row & string) {
    setSort((current) => {
      if (current?.key !== key) return { key, direction: "asc" };
      if (current.direction === "asc") return { key, direction: "desc" };
      return null;
    });
  }

  function updateQuery(value: string) {
    setQuery(value);
    setPage(0);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => updateQuery(event.target.value)} className="pl-8" placeholder={searchPlaceholder} />
        </div>
        <Badge variant="secondary">{selected.size} selected</Badge>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  aria-label="Select all rows"
                  checked={pageRows.length > 0 && pageRows.every((row, index) => selected.has(rowId(row, index)))}
                  onCheckedChange={(checked) => {
                    const next = new Set(selected);
                    pageRows.forEach((row, index) => {
                      const id = rowId(row, index);
                      if (checked) next.add(id);
                      else next.delete(id);
                    });
                    setSelected(next);
                  }}
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.sortable ? (
                    <Button variant="ghost" size="sm" className="-ml-2" onClick={() => updateSort(column.key)}>
                      {column.label}
                      {sort?.key === column.key && (
                        sort.direction === "asc" ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />
                      )}
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length > 0 ? (
              pageRows.map((row, rowIndex) => {
                const id = rowId(row, rowIndex);
                return (
                  <TableRow key={id} data-state={selected.has(id) ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        aria-label={`Select row ${rowIndex + 1}`}
                        checked={selected.has(id)}
                        onCheckedChange={(checked) => {
                          const next = new Set(selected);
                          if (checked) next.add(id);
                          else next.delete(id);
                          setSelected(next);
                        }}
                      />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.key} className={cn(column.key === columns[0]?.key && "font-medium")}>
                        {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1}>
                  <Empty>
                    <EmptyMedia variant="icon">
                      <Search />
                    </EmptyMedia>
                    <EmptyHeader>
                      <EmptyTitle>No rows found</EmptyTitle>
                      <EmptyDescription>Adjust the search query or clear filters.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Page {page + 1} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
