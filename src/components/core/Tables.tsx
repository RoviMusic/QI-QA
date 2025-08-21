"use client";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Button, Space, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { CircleButton } from "./Buttons";
import { formattedPriceNormalized } from "@/lib/formattedPrice";
import dayjs from "dayjs";
import { TableText } from "./Titulo";
const { Link } = Typography

/**
 * DinamicTable component renders a table with dynamic columns and data.
 * It supports various column types and actions.
 *
 * @param {Props} props - The properties for the DinamicTable component.
 * @returns {JSX.Element} The rendered DinamicTable component.
 */
type Props = {
  columns: DinamicColumnsType[];
  dataSource: any[];
  rowStyle?: boolean;
  rowActions?: {
    onRowClick?: (record: any) => void;
    onRowHover?: (record: any) => void;
  };
  getRowClass?: (type: any) => string;
  hasPagination?: boolean;
};

function renderColumns(
  columnConfig: DinamicColumnsType,
  text: any,
  record: any
) {
  switch (columnConfig.type) {
    case "price":
      return <TableText>{`${formattedPriceNormalized(text)}`}</TableText>;
    case "float":
      return (
        <TableText>
          {Number(text).toFixed(columnConfig.decimals || 2)}
        </TableText>
      );
    case "date":
      const fecha = dayjs.unix(Number(text));
      return (
        <TableText>
          {dayjs(text).format("DD/MM/YYYY [a las] HH:mm:ss a")}
          {/* {dayjs.unix(text).format("DD/MM/YYYY")} */}
          {/* {dayjs.unix(text).toDate().toDateString()} */}
          {/* {fecha.isValid() ? fecha.format("DD/MM/YYYY HH:mm:ss") : "Fecha inválida"} */}
          {/* {dayjs(text).toDate().toDateString()} */}
          {/* {text} */}
        </TableText>
      );
    case "actions":
      if (columnConfig.actions) {
        return (
          <Space>
            {columnConfig.actions.map((action, index) => (
              <CircleButton
                key={index}
                onPress={() => action.onPress(record)}
                icon={action.icon}
                tooltip={action.tooltip}
              />
            ))}
          </Space>
        );
      }
    case "link":
      if (columnConfig.actions) {
        return (
          // <Button
          //   size="small"
          //   type="link"
          //   onClick={() => columnConfig.actions![0].onPress(record)}
          // >
          //   {text}
          // </Button>
          <Link onClick={() => columnConfig.actions![0].onPress(record)}>{text}</Link>
        );
      }
    case "custom":
      return columnConfig.render ? columnConfig.render(text, record) : text;

    default:
      return <TableText>{text}</TableText>;
  }
}

const getTableSize = (columns: DinamicColumnsType[]) => {
  if (columns.length > 8) {
    return "small";
  } else if (columns.length > 5) {
    return "middle";
  }
  return "large";
};

const handleTotal = (total: number, range: [number, number]): JSX.Element => (
  <p>Total {total} registros</p>
);

function getColumns(columns: DinamicColumnsType[]) {
  const cols: TableProps<any>["columns"] = [];
  columns.map((col) => {
    cols.push({
      title: col.title.toLocaleUpperCase(),
      dataIndex: col.column_id,
      key: col.column_id,
      width: col.width || "auto",
      align:
        col.align ||
        col.type === "actions" ||
        col.type === "int" ||
        col.type === "float"
          ? "center"
          : "left",

      render: (text: any, record: any) => {
        return renderColumns(col, text, record);
      },
    });
  });

  return cols;
}

function DinamicTable({
  columns,
  dataSource,
  rowStyle = false,
  rowActions = undefined,
  hasPagination = true,
  getRowClass,
}: Props) {
  return (
    <div>
      <Table
        rowKey={(record) => {
          // Try to use a unique key from the record, fallback to Ant Design's default
          // Replace 'id' with your unique identifier field, or fallback to index if not present
          return JSON.stringify(record);
        }}
        bordered
        size={getTableSize(columns)}
        columns={getColumns(columns)}
        dataSource={dataSource}
        pagination={
          hasPagination
            ? {
                showSizeChanger: true,
                pageSizeOptions: [100, 200, 500, dataSource.length],
                total: dataSource?.length,
                showTotal: handleTotal,
                position: ["topRight"],
                defaultPageSize: 100,
              }
            : false
        }
        tableLayout="auto"
        //scroll={{ x: "max-content" }}
        scroll={{x: "max-content"}}
        rowClassName={(record) => {
          return rowStyle ? getRowClass!(record.type) : "";
        }}
        onRow={(record, rowIndex) => {
          return rowActions
            ? {
                onClick: (event) => {
                  rowActions.onRowClick ? rowActions.onRowClick(record) : {};
                },
                onMouseEnter: (event) => {
                  rowActions.onRowHover ? rowActions.onRowHover(record) : {};
                },
              }
            : {};
        }}
        sticky={true}
      />
    </div>
  );
}

function ExpandibleTable({ columns, dataSource }: Props) {}

export { DinamicTable, ExpandibleTable };
