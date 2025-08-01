"use client";
import { DinamicColumnsType } from "@/shared/types/tableTypes";
import { Button, Space, Table } from "antd";
import type { TableProps } from "antd";
import { CircleButton } from "./Buttons";
import { formattedPriceNormalized } from "@/lib/formattedPrice";
import { getIcon } from "@/lib/utils";

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
};

function renderColumns(record: DinamicColumnsType, text: any) {
  //console.log("Rendering column:", text);
  // Handle arrays
  if (Array.isArray(text)) {
    return text.length >= 2 ? (
      <CircleButton
        onPress={() => record.actions && record.actions[0].onPress(text)}
        icon={"Circle-Info"}
        tooltip="Ver detalles"
      />
    ) : (
      <Space direction="vertical" size={5}>
        {text.map((item: any, idx: number) => (
          <div key={idx}>
            {record.type === "link" ? (
              <>
                {Object.entries(item).map(
                  ([key, value]) =>
                    key !== "sku" && (
                      <div key={key}>
                        {record.type === "link" ? (
                          <Button
                            type="link"
                            onClick={() => record.actions![0].onPress(text)}
                          >
                            {key.toUpperCase()}: {String(value)}
                          </Button>
                        ) : (
                          <>
                            <b>{key.toUpperCase()}:</b> {String(value)}
                          </>
                        )}
                      </div>
                    )
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        ))}
      </Space>
    );
  }

  // Handle objects (but not null)
  if (typeof text === "object" && text !== null) {
    return (
      <Space direction="vertical" size={5}>
        {Object.entries(text).map(
          ([key, value]) =>
            key !== "sku" && (
              <div key={key}>
                {record.type === "link" ? (
                  <Button
                    type="link"
                    onClick={() => record.actions![0].onPress(text)}
                  >
                    {key.toUpperCase()}: {String(value)}
                  </Button>
                ) : (
                  <>
                    <b>{key.toUpperCase()}:</b> {String(value)}
                  </>
                )}
              </div>
            )
        )}
      </Space>
    );
  }

  if (record.type === "price") {
    return `${formattedPriceNormalized(text)}`;
  } else if (record.type === "float") {
    return Number(text).toFixed(record.decimals || 2);
  } else if (record.type === "date") {
    return new Date(text).toLocaleDateString();
  } else if (record.type === "actions" && record.actions) {
    return (
      <Space>
        {record.actions.map((action, index) => (
          <CircleButton
            key={index}
            onPress={() => action.onPress(record)}
            icon={action.icon}
            tooltip={action.tooltip}
          />
        ))}
      </Space>
    );
  } else if (record.type === "link" && record.actions) {
    return (
      <Button type="link" onClick={() => record.actions![0].onPress(record)}>
        {text}
      </Button>
    );
  }

  return text;
}

function DinamicTable({ columns, dataSource }: Props) {
  
  function getColumns(columns: DinamicColumnsType[]) {
    const cols: TableProps<any>["columns"] = [];
    columns.map((col) => {
      cols.push({
        title: col.title.toLocaleUpperCase(),
        dataIndex: col.column_id,
        key: col.column_id,
        width: "auto",
        align: col.align || col.type === "actions" || col.type === "int" || col.type === "float"
            ? "center"
            : "left",
          
        render: (text: any, record: any) => {
          return renderColumns(col, text);
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
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}

function AdvancedTable({ columns, dataSource }: Props) {}

export { DinamicTable, AdvancedTable };
