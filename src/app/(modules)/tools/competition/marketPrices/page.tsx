import { MainTitle } from "@/components/core/Titulo";
import MainFilters from "@/modules/tools/competition/components/MainFilters";
import MainTable from "@/modules/tools/competition/components/MainTable";
import { Space } from "antd";

export default function CompetenciaPage() {
  return (
    <>
      <Space direction="vertical" style={{width: '100%'}} size="large">
        <MainTitle>Competencia</MainTitle>
        <MainFilters />
        <MainTable />
      </Space>
    </>
  );
}
