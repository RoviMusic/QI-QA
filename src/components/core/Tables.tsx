"use client";
import {
  ColumnsWithActionsType,
  DinamicColumnsType,
} from "@/shared/types/tableTypes";
import { Space, Table } from "antd";
import type { TableProps } from "antd";
import { CircleButton } from "./Buttons";
import { formattedPriceNormalized } from "@/lib/formattedPrice";

type Props = {
  columns: DinamicColumnsType[] | ColumnsWithActionsType[];
  dataSource: any[];
};

function DinamicTable({ columns, dataSource }: Props) {
  function getColumns(
    columns: DinamicColumnsType[] | ColumnsWithActionsType[]
  ) {
    const cols: TableProps<any>["columns"] = [];
    columns.map((col) => {
      cols.push({
        title: col.title.toLocaleUpperCase(),
        dataIndex: col.column_id,
        key: col.column_id,
        width: "auto",
        align: col.type === "actions" || col.type === "int" || col.type === "float" ? "center" : "left",
        render: (text: any, record: any) => {
          if (col.type === "price") {
            return `${formattedPriceNormalized(text)}`;
          } else if (col.type === "float") {
            return Number(text).toFixed(col.decimals || 2);
          }else if (col.type === "date") {
            return new Date(text).toLocaleDateString();
          } else if (col.type === "actions" && col.actions) {
            return (
              <Space>
                {col.actions.map((action, index) => (
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
          return text;
        },
      });
    });

    return cols;
  }

  const handleTotal = (total: number, range: [number, number]): JSX.Element => (
    <p>Total {total} registros</p>
  );

  const getTableSize = () => {
    if (columns.length > 8) {
      return "small";
    } else if (columns.length > 5) {
      return "middle";
    }
    return "large";
  };

  return (
    <div>
      <Table
        rowKey={(record) => {
          // Try to use a unique key from the record, fallback to Ant Design's default
          // Replace 'id' with your unique identifier field, or fallback to index if not present
          return (
            record.id ?? record.key ?? record._id ?? JSON.stringify(record)
          );
        }}
        bordered
        size={getTableSize()}
        columns={getColumns(columns)}
        dataSource={dataSource}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: [100, 200, 500, dataSource.length],
          total: dataSource?.length,
          showTotal: handleTotal,
          position: ["topRight"],
          defaultPageSize: 100,
        }}
        tableLayout="auto"
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}

export { DinamicTable };
